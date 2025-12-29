export function markStart(key: string) {
  try {
    performance.mark(`${key}-start`);
  } catch {
    // ignore
  }
}

export function markEnd(key: string) {
  try {
    performance.mark(`${key}-end`);
  } catch {
    // ignore
  }
}

export function measureAndWarn(key: string, thresholdMs = 100) {
  try {
    const measureName = `${key}-measure`;
    performance.measure(measureName, `${key}-start`, `${key}-end`);
    const entries = performance.getEntriesByName(measureName);
    const duration = entries.length ? entries[0].duration : 0;
    if (duration > thresholdMs) {
      // friendly warning with relevant context
      console.warn(`[perf] ${key} took ${Math.round(duration)}ms`);
    }
    // cleanup marks/measures to avoid memory growth in long-running sessions
    try {
      performance.clearMarks(`${key}-start`);
      performance.clearMarks(`${key}-end`);
      performance.clearMeasures(measureName);
    } catch {
      // ignore
    }
    return duration;
  } catch {
    return 0;
  }
}

export function runInIdle(fn: () => void, timeout = 500) {
  try {
    const win = typeof window !== "undefined" ? (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number }) : undefined;
    if (win && typeof win.requestIdleCallback === "function") {
      win.requestIdleCallback(fn, { timeout });
      return;
    }
  } catch {
    // ignore
  }
  // fallback
  setTimeout(fn, 0);
}
