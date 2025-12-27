"use client";

import * as React from "react";
import { Tip } from "@/components/ui/tip";
import { AlertTriangle, TrendingUp } from "lucide-react";

interface DefenseWarningProps {
  type: "limit" | "disparity";
  pair: string;
  exceed?: number;
  percent?: number;
}

export function DefenseWarning({
  type,
  pair,
  exceed = 0,
  percent = 0,
}: DefenseWarningProps) {
  const content =
    type === "limit" ? (
      <div className="max-w-xs text-xs space-y-1">
        <div className="font-medium text-red-300">🔴 Limite de Dupla Excedido</div>
        <div className="text-red-100">Par: {pair}</div>
        <div>Excesso: +{exceed} pontos</div>
        <div className="pt-1 text-red-200 border-t border-red-400/30">
          <strong>Como corrigir:</strong> Reduza os investimentos em uma ou
          ambas as defesas desta dupla para ficar dentro do limite.
        </div>
      </div>
    ) : (
      <div className="max-w-xs text-xs space-y-1">
        <div className="font-medium text-yellow-300">📈 Disparidade Detectada</div>
        <div className="text-yellow-100">Par: {pair}</div>
        <div>Diferença: {percent.toFixed(1)}%</div>
        <div className="pt-1 text-yellow-200 border-t border-yellow-400/30">
          <strong>Recomendação:</strong> Disparidades maiores que 50% devem ser
          revisadas com o Mestre antes de serem aprovadas.
        </div>
      </div>
    );

  return (
    <Tip content={content} side="top">
      <div
        role="img"
        aria-label={type === "limit" ? "Limite excedido" : "Disparidade"}
        className={`cursor-help ${type === "limit" ? "text-red-500" : "text-yellow-500"}`}
      >
        {type === "limit" ? (
          <AlertTriangle className="w-3.5 h-3.5" />
        ) : (
          <TrendingUp className="w-3.5 h-3.5" />
        )}
      </div>
    </Tip>
  );
}

export default DefenseWarning;
