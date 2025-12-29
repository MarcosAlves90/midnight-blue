"use client";

/**
 * AutoSaveService
 * - Debounce scheduling
 * - Coalescing of rapid updates
 * - Single in-flight save with queued pending payload
 * - Optional retry/backoff (simple placeholder)
 * - Instrumentation hooks (events/logging)
 *
 * Designed to be generic and unit-testable.
 */

export type AutoSaveHandler<T> = (data: T) => Promise<void>;

export interface AutoSaveOptions {
  debounceMs?: number;
  onSchedule?: (info: { id?: string }) => void;
  onExecute?: (info: { id?: string }) => void;
  onSuccess?: (info: { id?: string }) => void;
  onError?: (err: unknown, info?: { id?: string }) => void;
}

export class AutoSaveService<T extends Record<string, unknown> = Record<string, unknown>> {
  private handler: AutoSaveHandler<T>;
  private debounceMs: number;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private inFlight = false;
  private pendingObj: T | null = null;
  private pendingSerialized: string | null = null;
  private pendingOnSaved: (() => void) | null = null;
  private pendingOnConflict: ((conflict: unknown, attempted: T) => Promise<{ action: "retry" } | { action: "retryWith"; data: T } | { action: "abort" }>) | null = null;
  private lastSavedSerialized: string | null = null;
  private lastSavedFingerprint: string | null = null;
  private pendingFingerprint: string | null = null;
  private opts: AutoSaveOptions;

  constructor(handler: AutoSaveHandler<T>, opts?: AutoSaveOptions) {
    this.handler = handler;
    this.debounceMs = opts?.debounceMs ?? 3000;
    this.opts = opts ?? {};
  }

  schedule(
    data: T,
    onSaved?: () => void,
    onConflict?: (conflict: unknown, attempted: T) => Promise<{ action: "retry" } | { action: "retryWith"; data: T } | { action: "abort" }>,
  ) {
    // Cheap fingerprint function: shallowly serialize keys and primitive values to detect no-op
    const fingerprint = (obj: unknown) => {
      try {
        if (!obj || typeof obj !== "object") return String(obj ?? "");
        const keys = Object.keys(obj as Record<string, unknown>).sort();
        const parts: string[] = [];
        for (const k of keys) {
          const v = (obj as Record<string, unknown>)[k];
          if (v === null || v === undefined) {
            parts.push(`${k}:`);
          } else if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
            parts.push(`${k}:${String(v)}`);
          } else if (Array.isArray(v)) {
            parts.push(`${k}:[len=${v.length}]`);
          } else if (typeof v === "object") {
            // shallow object: include number of keys
            parts.push(`${k}:{keys=${Object.keys(v as Record<string, unknown>).length}}`);
          } else {
            parts.push(`${k}:?`);
          }
        }
        return parts.join("|");
      } catch {
        return "";
      }
    };

    const fp = fingerprint(data);

    // If nothing changed since last successful save and there is no in-flight save, skip
    if (!this.inFlight && this.lastSavedFingerprint === fp) {
      return;
    }

    // Always avoid synchronous stringify at schedule time; defer serialization to execute (worker/idle)
    this.pendingObj = data;
    this.pendingSerialized = null;
    this.pendingFingerprint = fp;

    // store the callback to notify after success
    this.pendingOnSaved = onSaved ?? null;
    this.pendingOnConflict = onConflict ?? null;

    this.opts.onSchedule?.({});

    if (this.timeoutId) clearTimeout(this.timeoutId);

    // After debounce, schedule execution during idle so typing stays snappy
    this.timeoutId = setTimeout(() => {
      const win = typeof window !== "undefined" ? (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number }) : undefined;
      if (win && typeof win.requestIdleCallback === "function") {
        win.requestIdleCallback(() => this.execute(), { timeout: 1000 });
      } else {
        // minimal delay to yield
        setTimeout(() => this.execute(), 0);
      }
    }, this.debounceMs);
  }

  async execute() {
    // If already saving, defer; execute will be triggered when in-flight finishes
    if (this.inFlight) return;

    if (!this.pendingObj) return;

    const toSave = this.pendingObj;
    let toSaveSerialized = this.pendingSerialized;
    const onSavedForThis = this.pendingOnSaved;
    const fingerprintForThis = this.pendingFingerprint;

    // clear pending snapshot now (we captured the callback too)
    this.pendingObj = null;
    this.pendingSerialized = null;
    this.pendingOnSaved = null;
    this.pendingFingerprint = null;

    const perfKey = "AutoSave.execute";
    try {
      // mark start for whole execute
      try {
        performance.mark(`${perfKey}-start`);
      } catch {
        // ignore
      }

      // If we didn't compute a serialized snapshot earlier (large payload), perform serialization during idle time to avoid blocking input handlers
      if (!toSaveSerialized && toSave) {
        const serializeInIdle = async (obj: T) => {
          // Use worker-based serializer when available to avoid blocking main thread
          try {
            // lazy import to reduce bundle cost
            const mod = await import("@/lib/serializer-worker");
            try {
              const s = await mod.serializer.serialize(obj);
              return s;
            } catch {
              // fallback to idle stringify
            }
          } catch {
            // ignore import errors
          }

          // final fallback: stringify in idle
          return await new Promise<string>((resolve) => {
            const win = typeof window !== "undefined" ? (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number }) : undefined;
            if (win && typeof win.requestIdleCallback === "function") {
              win.requestIdleCallback(() => {
                try {
                  resolve(JSON.stringify(obj));
                } catch {
                  resolve("");
                }
              }, { timeout: 500 });
              return;
            }

            // Fallback: defer to next tick
            setTimeout(() => {
              try {
                resolve(JSON.stringify(obj));
              } catch {
                resolve("");
              }
            }, 0);
          });
        };

        try {
          // measure serialization separately
          try {
            performance.mark(`${perfKey}-serialize-start`);
          } catch {
            // ignore
          }
          toSaveSerialized = await serializeInIdle(toSave);
          try {
            performance.mark(`${perfKey}-serialize-end`);
            performance.measure(`${perfKey}-serialize`, `${perfKey}-serialize-start`, `${perfKey}-serialize-end`);
            const m = performance.getEntriesByName(`${perfKey}-serialize`)[0];
            if (m) {
              if (m.duration > 100) console.warn(`[perf] ${perfKey} serialization took ${Math.round(m.duration)}ms`);
              if (process.env.NODE_ENV === "development") console.debug(`[perf] ${perfKey} serialization ${Math.round(m.duration)}ms`);
            }
            performance.clearMarks(`${perfKey}-serialize-start`);
            performance.clearMarks(`${perfKey}-serialize-end`);
            performance.clearMeasures(`${perfKey}-serialize`);
          } catch {
            // ignore
          }
        } catch {
          toSaveSerialized = "";
        }
      }

      // If we computed a serialized snapshot (or got one earlier), use it for change-detection later
      const fingerprintToSet = fingerprintForThis ?? null;


      this.inFlight = true;
      this.opts.onExecute?.({});

      try {
        // measure handler execution
        try {
          performance.mark(`${perfKey}-handler-start`);
        } catch {
          // ignore
        }
        await this.handler(toSave); // handler receives the object payload
        try {
          performance.mark(`${perfKey}-handler-end`);
          performance.measure(`${perfKey}-handler`, `${perfKey}-handler-start`, `${perfKey}-handler-end`);
          const mh = performance.getEntriesByName(`${perfKey}-handler`)[0];
          if (mh && mh.duration > 100) console.warn(`[perf] ${perfKey} handler took ${Math.round(mh.duration)}ms`);
          performance.clearMarks(`${perfKey}-handler-start`);
          performance.clearMarks(`${perfKey}-handler-end`);
          performance.clearMeasures(`${perfKey}-handler`);
        } catch {
          // ignore
        }

        this.lastSavedSerialized = toSaveSerialized;
        // set fingerprint of last saved to avoid future no-op saves
        try { this.lastSavedFingerprint = fingerprintToSet ?? null; } catch {}
        this.opts.onSuccess?.({});
        // invoke onSaved in idle to avoid blocking UI handlers
        try {
          const runSaved = () => {
            try { onSavedForThis?.(); } catch {}
          };
          const win = typeof window !== "undefined" ? (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number }) : undefined;
          if (win && typeof win.requestIdleCallback === "function") {
            win.requestIdleCallback(runSaved, { timeout: 1000 });
          } else {
            setTimeout(runSaved, 0);
          }
        } catch {
          // ignore
        }
      } catch (err) {
      // Detect conflict payload inside error object and give caller a chance to resolve
      const conflict = (err as unknown as { conflict?: unknown }).conflict;
      if (conflict && this.pendingOnConflict) {
        try {
          const decision = await this.pendingOnConflict(conflict, toSave);
          if (decision.action === "retry") {
            // push payload back and retry immediately
            this.pendingObj = toSave;
            this.pendingSerialized = toSaveSerialized;
            this.pendingOnSaved = onSavedForThis;
            setTimeout(() => this.execute(), 0);
            return;
          }
          if (decision.action === "retryWith") {
            // use provided data and retry
            this.pendingObj = decision.data;
            this.pendingSerialized = JSON.stringify(decision.data);
            this.pendingOnSaved = onSavedForThis;
            setTimeout(() => this.execute(), 0);
            return;
          }
          if (decision.action === "abort") {
            // give up and surface the conflict via opts.onError
            this.opts.onError?.(err);
            return;
          }
        } catch {
          // if conflict handler throws, fall back to generic error handling
          this.opts.onError?.(err);
        }
      }

      // fallback generic handling: schedule retry with backoff
      this.opts.onError?.(err);
      // Simple retry placeholder: push payload back to pending for retry later
      this.pendingObj = toSave;
      this.pendingSerialized = toSaveSerialized;
      // preserve callback for retry
      this.pendingOnSaved = onSavedForThis;
      // exponential backoff could be implemented here
      setTimeout(() => this.execute(), 1000);
    } finally {
      this.inFlight = false;
      // If a new pending exists and it's different from lastSaved, schedule immediate execution
      if (this.pendingSerialized && this.pendingSerialized !== this.lastSavedSerialized) {
        // schedule next immediately (allow event loop to breathe)
        setTimeout(() => this.execute(), 0);
      }
    }
    } catch (e) {
      // outer try: report and forward
      this.opts.onError?.(e);
    }
  }

  async flush() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    await this.execute();
  }

  get isInFlight() {
    return this.inFlight;
  }

  get lastSaved() {
    return this.lastSavedSerialized;
  }

  /** Mark a snapshot as already saved (e.g., after an immediate save) */
  markSaved(serialized: string) {
    this.lastSavedSerialized = serialized;
    // clear pending if it matches
    if (this.pendingSerialized === serialized) {
      this.pendingSerialized = null;
      this.pendingObj = null;
    }
  }
}
