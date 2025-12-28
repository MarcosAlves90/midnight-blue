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
    const serialized = JSON.stringify(data);

    // If nothing changed since last successful save and there is no in-flight save, skip
    if (!this.inFlight && this.lastSavedSerialized === serialized) {
      // no-op
      return;
    }

    // coalesce: keep latest pending
    this.pendingObj = data;
    this.pendingSerialized = serialized;
    // store the callback to notify after success
    this.pendingOnSaved = onSaved ?? null;
    this.pendingOnConflict = onConflict ?? null;

    this.opts.onSchedule?.({});

    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.execute();
    }, this.debounceMs);
  }

  async execute() {
    // If already saving, defer; execute will be triggered when in-flight finishes
    if (this.inFlight) return;

    if (!this.pendingObj || !this.pendingSerialized) return;

    const toSave = this.pendingObj;
    const toSaveSerialized = this.pendingSerialized;
    const onSavedForThis = this.pendingOnSaved;

    // clear pending snapshot now (we captured the callback too)
    this.pendingObj = null;
    this.pendingSerialized = null;
    this.pendingOnSaved = null;

    this.inFlight = true;
    this.opts.onExecute?.({});

    try {
      await this.handler(toSave);
      this.lastSavedSerialized = toSaveSerialized;
      this.opts.onSuccess?.({});
      try {
        onSavedForThis?.();
      } catch {
        // ignore callback errors
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
        } catch (e) {
          // if conflict handler throws, fall back to generic error handling
          this.opts.onError?.(e);
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
