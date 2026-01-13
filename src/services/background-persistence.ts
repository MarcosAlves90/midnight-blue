/**
 * BackgroundPersistence
 * - Filas por entidade (characterId)
 * - Concurrency limit por fila
 * - Retries exponenciais com jitter
 * - Prioridade (0 = alta, larger = lower priority)
 * - flush / flushAll para aguardar conclusão
 */

type TaskFn<T> = () => Promise<T>;

export interface EnqueueOptions {
  priority?: number; // lower = higher priority
  maxRetries?: number;
  initialBackoffMs?: number;
  // predicate to decide whether to retry after an error. By default, retries on network-like errors
  shouldRetry?: (err: unknown) => boolean;
  // optional meta used for beacon fallback (best-effort)
  beacon?: { url: string; payload: Record<string, unknown> } | null;
}

interface QueueTask<T = unknown> {
  id: string;
  fn: TaskFn<T>;
  priority: number;
  attempt: number;
  maxRetries: number;
  initialBackoffMs: number;
  shouldRetry: (err: unknown) => boolean;
  beacon?: EnqueueOptions["beacon"];
  // coalescing key to dedupe similar tasks on the same queue
  coalesceKey?: string | null;
  // multiple waiters can attach to the same task if coalesced
  waiters: Array<{
    resolve: (v: T | PromiseLike<T>) => void;
    reject: (err: unknown) => void;
  }>;
}

export class BackgroundPersistence {
  private queues = new Map<string, QueueTask[]>();
  private activeCounts = new Map<string, number>();
  private concurrencyPerQueue: number;

  constructor(concurrencyPerQueue = 2) {
    this.concurrencyPerQueue = concurrencyPerQueue;
  }

  enqueue<T = unknown>(
    key: string,
    fn: TaskFn<T>,
    opts?: EnqueueOptions & { coalesceKey?: string | null },
  ): Promise<T> {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const priority = opts?.priority ?? 10;
    const maxRetries = opts?.maxRetries ?? 3;
    const initialBackoffMs = opts?.initialBackoffMs ?? 500;
    const shouldRetry = opts?.shouldRetry ?? (() => true);
    const coalesceKey = opts?.coalesceKey ?? null;

    const queue = this.queues.get(key) ?? [];

    // If coalesceKey provided, try to find an existing queued task and attach as waiter, updating fn
    if (coalesceKey) {
      const existing = queue.find(
        (t) => (t.coalesceKey || null) === coalesceKey,
      ) as QueueTask<T> | undefined;
      if (existing) {
        // attach waiter to existing task and replace the function with the latest
        return new Promise<T>((resolve, reject) => {
          existing.waiters.push({ resolve, reject });
          // replace fn so the executing one will use latest
          existing.fn = fn;
          // update priority if higher
          if (priority < existing.priority) existing.priority = priority;
        });
      }
    }

    const taskPromise = new Promise<T>((resolve, reject) => {
      const task: QueueTask<T> = {
        id,
        fn,
        priority,
        attempt: 0,
        maxRetries,
        initialBackoffMs,
        shouldRetry,
        beacon: opts?.beacon ?? null,
        coalesceKey,
        waiters: [{ resolve, reject }],
      };

      // insert respecting priority (simple stable insertion)
      let inserted = false;
      for (let i = 0; i < queue.length; i++) {
        if (priority < queue[i].priority) {
          // Cast to QueueTask<unknown> to avoid generic variance issues when storing heterogeneous tasks.
          queue.splice(i, 0, task as unknown as QueueTask<unknown>);
          inserted = true;
          break;
        }
      }
      if (!inserted) queue.push(task as unknown as QueueTask<unknown>);

      this.queues.set(key, queue);
      // ensure processing starts
      this.processQueue(key).catch(() => {
        // swallow — individual task promises will get rejected
      });
    });

    return taskPromise;
  }

  private async processQueue(key: string) {
    const queue = this.queues.get(key);
    if (!queue || queue.length === 0) return;

    const active = this.activeCounts.get(key) ?? 0;
    if (active >= this.concurrencyPerQueue) return;

    const task = queue.shift()!;
    this.activeCounts.set(key, active + 1);

    // Schedule execution for next event loop tick (non-blocking)
    setTimeout(async () => {
      try {
        await this.runWithRetries(task);
      } finally {
        // decrement active count
        this.activeCounts.set(key, (this.activeCounts.get(key) ?? 1) - 1);
        // if there are more tasks, schedule next
        if ((this.queues.get(key) ?? []).length > 0) {
          // allow event loop to breathe
          setTimeout(() => this.processQueue(key), 0);
        }
      }
    }, 0);
  }

  private async runWithRetries<T>(task: QueueTask<T>) {
    while (true) {
      try {
        task.attempt++;
        const res = await task.fn();

        // Resolve all waiters immediately via microtask
        for (const w of task.waiters) {
          try {
            w.resolve(res as T);
          } catch {
            /* ignore */
          }
        }
        return;
      } catch (err) {
        // If not retryable, reject immediately
        try {
          const should = task.shouldRetry(err);
          if (!should) {
            // reject all waiters immediately
            for (const w of task.waiters) {
              try {
                w.reject(err);
              } catch {}
            }
            return;
          }
        } catch {
          // if the predicate throws, don't retry
          for (const w of task.waiters) {
            try {
              w.reject(err);
            } catch {}
          }
          return;
        }

        if (task.attempt > task.maxRetries) {
          for (const w of task.waiters) {
            try {
              w.reject(err);
            } catch {}
          }
          return;
        }

        // exponential backoff with jitter
        const backoff = Math.round(
          task.initialBackoffMs * Math.pow(2, task.attempt - 1),
        );
        const jitter = Math.round(Math.random() * Math.min(500, backoff));
        const delay = backoff + jitter;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  async flush(key: string, timeoutMs = 2000): Promise<void> {
    const start = Date.now();
    // Wait until queue empty and activeCount 0 or timeout
    while (true) {
      const q = this.queues.get(key) ?? [];
      const active = this.activeCounts.get(key) ?? 0;
      if (q.length === 0 && active === 0) return;
      if (Date.now() - start > timeoutMs) return;
      // yield
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  async flushAll(timeoutMs = 3000): Promise<void> {
    const keys = Array.from(this.queues.keys());
    const promises = keys.map((k) => this.flush(k, timeoutMs));
    await Promise.all(promises);
  }
}

// export a singleton for app-wide use
export const backgroundPersistence = new BackgroundPersistence(2);
