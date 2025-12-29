"use client";

/**
 * AutoSaveService — redesigned for lightweight, non-blocking scheduling
 * - schedule(): returns immediately (< 1ms), never blocks
 * - execute(): async work happens in background via setTimeout
 * - No requestIdleCallback or await in sync paths
 */

export type AutoSaveHandler<T> = (data: T) => Promise<unknown>;

export interface AutoSaveOptions {
  debounceMs?: number;
  onSuccess?: (result?: unknown) => void;
  onError?: (err: unknown) => void;
}

export class AutoSaveService<T extends Record<string, unknown> = Record<string, unknown>> {
  private handler: AutoSaveHandler<T>;
  private debounceMs: number;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private executionTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private inFlight = false;
  private pendingObj: T | null = null;
  private opts: AutoSaveOptions;

  constructor(handler: AutoSaveHandler<T>, opts?: AutoSaveOptions) {
    this.handler = handler;
    this.debounceMs = opts?.debounceMs ?? 3000;
    this.opts = opts ?? {};
  }

  /**
   * Schedule a save — returns immediately, never blocks
   * Only stores the pending object; actual execution happens later in background
   */
  schedule(data: T) {
    // Avoid any heavy work here — just store reference
    this.pendingObj = data;

    // Clear previous debounce timeout
    if (this.timeoutId) clearTimeout(this.timeoutId);

    // Schedule execution after debounce delay (simple setTimeout)
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      void this.executeInBackground();
    }, this.debounceMs);
  }

  /**
   * Internal: execute save in background (non-blocking)
   * Runs async work without awaiting in sync context
   */
  private executeInBackground() {
    // If already executing or nothing to save, skip
    if (this.inFlight || !this.pendingObj) return;

    const toSave = this.pendingObj;
    this.pendingObj = null;
    this.inFlight = true;

    // Run the actual handler asynchronously (fire and forget)
    // Schedule on next event loop tick to be non-blocking
    this.executionTimeoutId = setTimeout(async () => {
      try {
        const result = await this.handler(toSave);
        this.opts.onSuccess?.(result);
      } catch (err) {
        this.opts.onError?.(err);
      } finally {
        this.inFlight = false;

        // If new pending data arrived, execute again
        if (this.pendingObj) {
          void this.executeInBackground();
        }
      }
    }, 0);
  }

  /**
   * Force flush pending saves (best effort)
   */
  async flush() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.executionTimeoutId) {
      clearTimeout(this.executionTimeoutId);
      this.executionTimeoutId = null;
    }

    // Execute once more if pending
    if (this.pendingObj) {
      const toSave = this.pendingObj;
      this.pendingObj = null;
      this.inFlight = true;
      try {
        const result = await this.handler(toSave);
        this.opts.onSuccess?.(result);
      } catch (err) {
        this.opts.onError?.(err);
      } finally {
        this.inFlight = false;
      }
    }
  }

  get isInFlight() {
    return this.inFlight;
  }
}
