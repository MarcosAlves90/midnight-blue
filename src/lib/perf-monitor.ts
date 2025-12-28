export function startDevLongTaskMonitor() {
  try {
    const win = typeof window !== "undefined" ? window : undefined;
    if (!win || typeof (win as unknown as { PerformanceObserver?: typeof PerformanceObserver }).PerformanceObserver === "undefined") return;

    // Long Task API is not available in all browsers — guard gracefully
    const PO = (win as unknown as { PerformanceObserver: typeof PerformanceObserver }).PerformanceObserver;
    const obs = new PO((list: PerformanceObserverEntryList) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        try {
          const e = entry as PerformanceEntry & { duration?: number; name?: string };
          const duration = e.duration ?? 0;
          if (duration > 50) {
            console.warn(`[longtask] ${Math.round(duration)}ms — ${e.name ?? "task"}`);
          }
        } catch {
          // ignore
        }
      }
    });

    obs.observe({ entryTypes: ["longtask"] });
    // keep reference on window for possible teardown in future
    const globalWin = window as unknown as { __perfLongTaskObserver?: PerformanceObserver };
    globalWin.__perfLongTaskObserver = obs;
  } catch {
    // ignore
  }
}
