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
    const serialized = JSON.stringify(value);
    // Coalesce multiple writes to same key
    const existing = pending.get(key);
    if (existing) {
      existing.serialized = serialized;
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

    pending.set(key, { serialized, handle });
  } catch {
    // ignore serialization errors
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
