import { toPng } from "html-to-image";
import { runInIdle } from "./perf-utils";

export async function captureElementAsPng(
  element: HTMLElement,
  options?: Record<string, unknown>,
) {
  return new Promise<string>((resolve, reject) => {
    // Run the expensive toPng in idle to avoid interfering with immediate UI responsiveness
    runInIdle(async () => {
      const perfKey = "captureElementAsPng";
      try {
        performance.mark(`${perfKey}-start`);
      } catch {
        // ignore
      }

      try {
        const dataUrl = await toPng(
          element,
          options as Record<string, unknown>,
        );
        try {
          performance.mark(`${perfKey}-end`);
          performance.measure(perfKey, `${perfKey}-start`, `${perfKey}-end`);
          const m = performance.getEntriesByName(perfKey)[0];
          if (m && m.duration > 200)
            console.warn(`[perf] ${perfKey} took ${Math.round(m.duration)}ms`);
          performance.clearMarks(`${perfKey}-start`);
          performance.clearMarks(`${perfKey}-end`);
          performance.clearMeasures(perfKey);
        } catch {
          // ignore
        }

        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
}
