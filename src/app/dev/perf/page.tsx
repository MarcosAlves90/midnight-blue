"use client";
import React, { useEffect, useState } from "react";
import { AutoSaveService } from "@/services/auto-save";

export default function DevPerfPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [perfStats, setPerfStats] = useState<Array<{ key: string; count: number; avg: number; median: number; max: number }>>([]);

  useEffect(() => {
    // Only run in dev
    if (process.env.NODE_ENV !== "development") return;

    const svc = new AutoSaveService(async () => {
      // mock network delay
      await new Promise((r) => setTimeout(r, 40));
    }, { debounceMs: 100 });

    const run = async () => {
      const iterations = 20;
      // small payloads bench
      for (let i = 0; i < iterations; i++) {
        const mark = `dev-bench-${i}`;
        try { performance.mark(`${mark}-start`); } catch {}
        svc.schedule({ identity: { name: `name-${i}`, counter: i } });
        // simulate rapid typing
        await new Promise((r) => setTimeout(r, 30));
        try { performance.mark(`${mark}-end`); performance.measure(mark, `${mark}-start`, `${mark}-end`); const m = performance.getEntriesByName(mark)[0]; setLogs((l) => [...l, `${mark} interval ${Math.round(m?.duration ?? 0)}ms`]); performance.clearMarks(`${mark}-start`); performance.clearMarks(`${mark}-end`); performance.clearMeasures(mark); } catch {}
      }

      // heavy payload test to force serializer
      try { setLogs((l) => [...l, "running heavy payload bench..."]); } catch {}
      for (let i = 0; i < 4; i++) {
        const large = "x".repeat(200000); // 200KB string
        const mark = `dev-heavy-${i}`;
        try { performance.mark(`${mark}-start`); } catch {}
        svc.schedule({ identity: { large }, meta: { heavy: true } });
        await new Promise((r) => setTimeout(r, 100));
        try { performance.mark(`${mark}-end`); performance.measure(mark, `${mark}-start`, `${mark}-end`); const m = performance.getEntriesByName(mark)[0]; setLogs((l) => [...l, `${mark} interval ${Math.round(m?.duration ?? 0)}ms`]); performance.clearMarks(`${mark}-start`); performance.clearMarks(`${mark}-end`); performance.clearMeasures(mark); } catch {}
      }

      // wait for flush
      await svc.flush();

      // gather performance measures
      try {
        const measures = performance.getEntriesByType("measure") as PerformanceMeasure[];
        // group by simple keys
        const groups: Record<string, number[]> = {};
        for (const m of measures) {
          const name = m.name;
          let key = "other";
          if (name.includes("AutoSave.execute")) key = "AutoSave";
          else if (name.includes("BackgroundPersistence.task")) key = "BackgroundPersistence";
          else if (name.includes("CharacterService.updateCharacter")) key = "CharacterService.updateCharacter";
          else if (name.includes("FirebaseRepo.patchCharacter")) key = "FirebaseRepo.patchCharacter";
          else if (name.includes("serialize")) key = "serialization";
          else if (name.includes("captureElementAsPng")) key = "captureElementAsPng";

          groups[key] = groups[key] || [];
          groups[key].push(Math.round(m.duration));
        }

        // compute stats
        const stats: Array<{ key: string; count: number; avg: number; median: number; max: number }> = [];
        for (const k of Object.keys(groups)) {
          const arr = groups[k];
          arr.sort((a, b) => a - b);
          const sum = arr.reduce((s, v) => s + v, 0);
          const avg = Math.round(sum / arr.length);
          const median = arr.length % 2 === 1 ? arr[(arr.length - 1) / 2] : Math.round((arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2);
          const max = arr[arr.length - 1];
          stats.push({ key: k, count: arr.length, avg, median, max });
        }

        try { setLogs((l) => [...l, "bench done"]); } catch {}
        try { setPerfStats(stats); } catch {}
      } catch {
        try { setLogs((l) => [...l, "bench done (no perf measures)"]); } catch {}
      }
    };

    run().catch((e) => setLogs((l) => [...l, String(e)]));

    return () => {
      // noop
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium mb-4">Dev Perf Bench</h2>

      <div className="space-y-2">
        {logs.map((s, i) => (
          <div key={i} className="text-sm font-mono">{s}</div>
        ))}
      </div>

      {perfStats.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Aggregated perf stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {perfStats.map((s) => (
              <div key={s.key} className="p-3 border rounded">
                <div className="text-xs font-medium">{s.key}</div>
                <div className="text-sm font-mono">count: {s.count}</div>
                <div className="text-sm font-mono">avg: {s.avg} ms</div>
                <div className="text-sm font-mono">median: {s.median} ms</div>
                <div className="text-sm font-mono">max: {s.max} ms</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">Open console to see [perf] logs from AutoSave / serializer.</p>
    </div>
  );
}
