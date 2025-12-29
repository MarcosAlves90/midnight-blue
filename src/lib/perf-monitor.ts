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
          const e = entry as PerformanceEntry & { duration?: number; name?: string; attribution?: unknown };
          const duration = e.duration ?? 0;

          // Include attribution details when available to help identify origin
          let info = `${e.name ?? "task"}`;
          try {
            // Some browsers provide attribution array with details
            const anyEntry = entry as unknown as { attribution?: unknown };
            if (anyEntry.attribution) {
              info += ` | attribution=${JSON.stringify(anyEntry.attribution)}`;
            }
          } catch {
            // ignore
          }

          if (duration > 50) {
            console.warn(`[longtask] ${Math.round(duration)}ms — ${info}`);
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
