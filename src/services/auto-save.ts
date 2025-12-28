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
  private lastSavedSerialized: string | null = null;
  private opts: AutoSaveOptions;

  constructor(handler: AutoSaveHandler<T>, opts?: AutoSaveOptions) {
    this.handler = handler;
    this.debounceMs = opts?.debounceMs ?? 3000;
    this.opts = opts ?? {};
  }

  schedule(data: T) {
    const serialized = JSON.stringify(data);

    // If nothing changed since last successful save and there is no in-flight save, skip
    if (!this.inFlight && this.lastSavedSerialized === serialized) {
      // no-op
      return;
    }

    // coalesce: keep latest pending
    this.pendingObj = data;
    this.pendingSerialized = serialized;

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

    // clear pending snapshot now
    this.pendingObj = null;
    this.pendingSerialized = null;

    this.inFlight = true;
    this.opts.onExecute?.({});

    try {
      await this.handler(toSave);
      this.lastSavedSerialized = toSaveSerialized;
      this.opts.onSuccess?.({});
    } catch (err) {
      this.opts.onError?.(err);
      // Simple retry placeholder: push payload back to pending for retry later
      this.pendingObj = toSave;
      this.pendingSerialized = toSaveSerialized;
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
