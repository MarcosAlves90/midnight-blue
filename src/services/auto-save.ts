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
    // Merge new data with existing pending data to avoid losing updates
    if (!this.pendingObj) {
      this.pendingObj = { ...data };
    } else {
      // Deep merge for identity and status, shallow for others
      const merged = { ...this.pendingObj };
      
      Object.keys(data).forEach((key) => {
        const val = data[key];
        const existing = merged[key];
        
        if (
          (key === "identity" || key === "status") && 
          typeof val === "object" && val !== null &&
          typeof existing === "object" && existing !== null
        ) {
          merged[key as keyof T] = { 
            ...(existing as Record<string, unknown>), 
            ...(val as Record<string, unknown>) 
          } as T[keyof T];
        } else {
          merged[key as keyof T] = val as T[keyof T];
        }
      });
      
      this.pendingObj = merged;
    }

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
  private async executeInBackground() {
    // If already executing or nothing to save, skip
    if (this.inFlight || !this.pendingObj) return;

    const toSave = { ...this.pendingObj };
    this.pendingObj = null;
    this.inFlight = true;

    try {
      // Pequeno atraso para garantir que não estamos bloqueando a thread principal de UI
      await new Promise(resolve => setTimeout(resolve, 0));
      const result = await this.handler(toSave);
      this.opts.onSuccess?.(result);
    } catch (err) {
      // Se falhar, tentamos reintegrar o que não foi salvo ao pendingObj
      // para que a próxima tentativa inclua esses dados.
      this.mergePending(toSave);
      this.opts.onError?.(err);
    } finally {
      this.inFlight = false;

      // If new pending data arrived during save, schedule another one
      if (this.pendingObj && !this.timeoutId) {
        this.timeoutId = setTimeout(() => {
          this.timeoutId = null;
          void this.executeInBackground();
        }, this.debounceMs);
      }
    }
  }

  private mergePending(data: T) {
    if (!this.pendingObj) {
      this.pendingObj = { ...data };
      return;
    }
    
    const merged = { ...data };
    Object.keys(this.pendingObj).forEach((key) => {
      const val = this.pendingObj![key];
      const existing = merged[key];
      
      if (
        (key === "identity" || key === "status") && 
        typeof val === "object" && val !== null &&
        typeof existing === "object" && existing !== null
      ) {
        merged[key as keyof T] = { 
          ...(existing as Record<string, unknown>), 
          ...(val as Record<string, unknown>) 
        } as T[keyof T];
      } else {
        merged[key as keyof T] = val as T[keyof T];
      }
    });
    this.pendingObj = merged;
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
