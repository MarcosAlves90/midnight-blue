type Pending = {
  id: string;
  resolve: (s: string) => void;
  reject: (e: unknown) => void;
};

// Browser worker based serializer with fallback to requestIdleCallback + JSON.stringify
export const serializer = (function () {
  let worker: Worker | null = null;
  const pending = new Map<string, Pending>();

  function createWorker() {
    try {
      // Inline worker blob
      const code = `self.onmessage = function(e) { const { id, payload } = e.data; try { const s = JSON.stringify(payload); self.postMessage({ id, result: s }); } catch (err) { self.postMessage({ id, error: String(err) }); } }`;
      const blob = new Blob([code], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      const w = new Worker(url);
      // dev-only: log worker creation
      if (process.env.NODE_ENV === "development") {
        try {
          console.debug("[dev-perf] serializer worker created", { url });
        } catch {}
      }

      w.onmessage = (ev) => {
        const { id, result, error } = ev.data as {
          id: string;
          result?: string;
          error?: string;
        };
        const p = pending.get(id);
        if (!p) return;
        pending.delete(id);
        if (typeof result === "string") {
          if (process.env.NODE_ENV === "development") {
            try {
              console.debug("[dev-perf] serializer worker response", {
                id,
                length: result.length,
              });
            } catch {}
          }
          p.resolve(result);
        } else p.reject(new Error(error ?? "unknown"));
      };
      w.onerror = () => {
        // Reject all pending
        pending.forEach((p) => p.reject(new Error("Worker error")));
        pending.clear();
      };
      return w;
    } catch {
      return null;
    }
  }

  async function serialize(obj: unknown, timeoutMs = 2000): Promise<string> {
    // Prefer worker when available
    if (typeof window === "undefined") {
      // server-side fallback
      return JSON.stringify(obj);
    }

    if (!worker) worker = createWorker();

    if (worker) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      return new Promise<string>((resolve, reject) => {
        const t = setTimeout(() => {
          // fallback to main-thread stringify if worker times out
          try {
            const s = JSON.stringify(obj);
            pending.delete(id);
            resolve(s);
          } catch (err) {
            pending.delete(id);
            reject(err);
          }
        }, timeoutMs);

        pending.set(id, {
          id,
          resolve: (s) => {
            clearTimeout(t);
            resolve(s);
          },
          reject: (e) => {
            clearTimeout(t);
            reject(e);
          },
        });

        try {
          worker!.postMessage({ id, payload: obj });
        } catch {
          clearTimeout(t);
          pending.delete(id);
          // fallback
          try {
            resolve(JSON.stringify(obj));
          } catch {
            reject(new Error("stringify failed"));
          }
        }
      });
    }

    // worker not available -> stringify on next tick to avoid blocking immediate handler
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(JSON.stringify(obj));
        } catch (e) {
          reject(e);
        }
      }, 0);
    });
  }

  return { serialize };
})();
