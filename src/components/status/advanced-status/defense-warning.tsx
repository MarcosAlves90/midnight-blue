"use client";

import * as React from "react";
import { Tip } from "@/components/ui/tip";
import { AlertTriangle, TrendingUp } from "lucide-react";

interface DefenseWarningProps {
  type: "limit" | "disparity";
  // single-item convenience
  pair?: string;
  exceed?: number;
  percent?: number;
  // multiple items support
  items?: Array<{ pair: string; exceed?: number; percent?: number }>;
}

export default function DefenseWarning({
  type,
  pair,
  exceed = 0,
  percent = 0,
  items,
}: DefenseWarningProps) {
  const list = items && items.length > 0 ? items : [{ pair: pair ?? "", exceed, percent }];
  const filtered = list.filter((l) => l && l.pair);
  const count = filtered.length;

  const content = (
    <div className="max-w-xs text-xs space-y-1">
      <div className={`font-medium ${type === "limit" ? "text-red-300" : "text-yellow-300"}`}>
        {type === "limit" ? "🔴 Limite de Dupla Excedido" : "📈 Disparidade Detectada"}
      </div>

      <div className="text-xs space-y-0.5">
        {filtered.map((l) => (
          <div key={l.pair} className="text-muted-foreground">
            {type === "limit" ? (
              <>
                <strong>{l.pair}:</strong> Excesso +{l.exceed ?? 0} pontos
              </>
            ) : (
              <>
                <strong>{l.pair}:</strong> Diferença {typeof l.percent === "number" ? l.percent.toFixed(1) : 0}%
              </>
            )}
          </div>
        ))}
      </div>

      <div className={`pt-1 ${type === "limit" ? "text-red-200" : "text-yellow-200"} border-t ${type === "limit" ? "border-red-400/30" : "border-yellow-400/30"}`}>
        {type === "limit" ? (
          <strong>Como corrigir:</strong>
        ) : (
          <strong>Recomendação:</strong>
        )}
        <div className="text-xs mt-1">
          {type === "limit"
            ? "Reduza os investimentos em uma ou ambas as defesas desta dupla para ficar dentro do limite."
            : "Disparidades maiores que 50% devem ser revisadas com o Mestre antes de serem aprovadas."}
        </div>
      </div>
    </div>
  );

  const ariaDetails = filtered
    .map((l) =>
      type === "limit"
        ? `${l.pair}: excesso +${l.exceed ?? 0}`
        : `${l.pair}: diferença ${typeof l.percent === "number" ? l.percent.toFixed(1) : 0}%`,
    )
    .join("; ");

  const ariaLabel = `${type === "limit" ? "Limite de Dupla Excedido" : "Disparidade Detectada"}${ariaDetails ? ` - ${ariaDetails}` : ""}`;

  return (
    <Tip content={content} side="top">
      <div
        role="img"
        aria-label={ariaLabel}
        className={`relative inline-flex items-center cursor-help ${type === "limit" ? "text-red-500" : "text-yellow-500"}`}
      >
        {type === "limit" ? (
          <AlertTriangle className="w-3.5 h-3.5" />
        ) : (
          <TrendingUp className="w-3.5 h-3.5" />
        )}
        {count > 1 && (
          <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 inline-flex items-center justify-center rounded bg-muted-foreground/10 text-[10px] min-w-[18px] h-3 text-xs font-medium">
            {count}
          </span>
        )}
      </div>
    </Tip>
  );
}
