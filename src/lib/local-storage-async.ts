type IdleHandle = number | ReturnType<typeof setTimeout>;

const pending = new Map<string, { serialized: string; handle: IdleHandle }>();

function scheduleIdle(fn: () => void) {
  const win = typeof window !== "undefined" ? (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number; }) : undefined;
  if (win && typeof win.requestIdleCallback === "function") {
    return win.requestIdleCallback(fn, { timeout: 2000 });
  }
  return setTimeout(fn, 0);
}

export function setItemAsync(key: string, value: unknown) {
  try {
    // Try to offload serialization to the serializer worker when available
    // Do not block the main thread with JSON.stringify for large payloads
    const existing = pending.get(key);
    if (existing) {
      // If a serialization is already pending, replace it by queuing a new one
      // We'll update serialized when the new serialization resolves
      (async () => {
        try {
          const mod = await import("@/lib/serializer-worker");
          const s = await mod.serializer.serialize(value);
          existing.serialized = s;
        } catch {
          // fallback to deferred stringify
          setTimeout(() => {
            try {
              existing.serialized = JSON.stringify(value);
            } catch {
              existing.serialized = "";
            }
          }, 0);
        }
      })();
      return;
    }

    // Create a new pending slot and start async serialization
    const slot = { serialized: "", handle: undefined as IdleHandle | undefined };
    pending.set(key, slot);

    // Start serialization asynchronously
    (async () => {
      try {
        const mod = await import("@/lib/serializer-worker");
        const s = await mod.serializer.serialize(value);
        slot.serialized = s;
      } catch {
        // fallback to deferred main-thread stringify
        setTimeout(() => {
          try {
            slot.serialized = JSON.stringify(value);
          } catch {
            slot.serialized = "";
          }
        }, 0);
      }

      // After serialization completes, schedule an idle write (coalescing maintained)
      if (slot.handle) return; // write already scheduled
      slot.handle = scheduleIdle(() => {
        try {
          const p = pending.get(key);
          if (!p || p.serialized === undefined) return;
          // Only write if we have a serialized string
          try {
            localStorage.setItem(key, p.serialized);
          } catch {
            // ignore storage errors
          }
        } finally {
          pending.delete(key);
        }
      });
    })();
  } catch {
    // ignore
  }
}

export function setStringItemAsync(key: string, value: string) {
  try {
    // Coalesce multiple writes to same key
    const existing = pending.get(key);
    if (existing) {
      existing.serialized = value;
      return;
    }

    const handle = scheduleIdle(() => {
      try {
        const p = pending.get(key);
        if (!p) return;
        localStorage.setItem(key, p.serialized);
      } catch {
        // ignore
      } finally {
        pending.delete(key);
      }
    });

    pending.set(key, { serialized: value, handle });
  } catch {
    // ignore
  }
}

export function removeItemAsync(key: string) {
  try {
    const existing = pending.get(key);
    if (existing) pending.delete(key);
    // schedule removal in idle
    scheduleIdle(() => {
      try { localStorage.removeItem(key); } catch {}
    });
  } catch {
    // ignore
  }
}
