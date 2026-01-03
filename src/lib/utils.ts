import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gera um fingerprint determinístico e curto para um objeto.
 * Útil para detecção de mudanças sem o custo de comparar objetos grandes.
 */
export function getCheapFingerprint(obj: unknown): string {
  if (!obj) return "";

  const normalize = (x: unknown): unknown => {
    if (x === null || typeof x !== "object") return x;
    if (Array.isArray(x)) return x.map(normalize);
    const out: Record<string, unknown> = {};
    Object.keys(x as Record<string, unknown>)
      .sort()
      .forEach((k) => {
        out[k] = normalize((x as Record<string, unknown>)[k]);
      });
    return out;
  };

  let str: string;
  try {
    str = JSON.stringify(normalize(obj));
  } catch {
    // Fallback para casos patológicos
    if (typeof obj === "object" && obj !== null) {
      const keys = Object.keys(obj).sort();
      str = keys
        .map((k) => `${k}:${String((obj as Record<string, unknown>)[k])}`)
        .join("|");
    } else {
      str = String(obj);
    }
  }

  // FNV-1a 32-bit hash (rápido, baixa colisão para inputs pequenos)
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  const hash = (h >>> 0).toString(36);

  // Inclui o tamanho para reduzir ainda mais a chance de colisão
  return `${hash}:${str.length}`;
}
