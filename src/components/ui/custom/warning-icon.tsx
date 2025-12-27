"use client";

import * as React from "react";
import { Tip } from "@/components/ui/tip";
import { AlertTriangle, TrendingUp } from "lucide-react";

interface WarningItem {
  label: string;
  exceed?: number;
  percent?: number;
}

interface WarningIconProps {
  type: "defense-limit" | "defense-disparity" | "skill-limit" | "skill-combat";
  items?: WarningItem[];
  // Single item convenience props
  label?: string;
  total?: number;
  limit?: number;
  excess?: number;
  percent?: number;
}

export function WarningIcon({
  type,
  items,
  label = "",
  total,
  limit,
  excess = 0,
  percent = 0,
}: WarningIconProps) {
  const isDefense = type.startsWith("defense");
  const isLimit = type.includes("limit");

  // Prepare items list
  let itemList: WarningItem[] = [];
  if (items && items.length > 0) {
    itemList = items;
  } else if (label) {
    itemList = [{ label, exceed: excess, percent }];
  }
  const filtered = itemList.filter((l) => l && l.label);
  const count = filtered.length;

  // Determine title and icon
  let title = "";
  let Icon = AlertTriangle;
  let titleColor = "text-red-300";
  let fixTitle = "Como corrigir:";
  let fixText = "";

  if (isDefense) {
    if (isLimit) {
      title = "🔴 Limite de Dupla Excedido";
      Icon = AlertTriangle;
      titleColor = "text-red-300";
      fixText =
        "Reduza os investimentos em uma ou ambas as defesas desta dupla para ficar dentro do limite.";
    } else {
      title = "📈 Disparidade Detectada";
      Icon = TrendingUp;
      titleColor = "text-yellow-300";
      fixTitle = "Recomendação:";
      fixText =
        "Disparidades maiores que 50% devem ser revisadas com o Mestre antes de serem aprovadas.";
    }
  } else {
    if (isLimit) {
      title = "🔴 Limite de Perícia Excedido";
      Icon = AlertTriangle;
      titleColor = "text-red-300";
      fixText =
        "Reduza as graduações de perícia, atributo ou bônus de vantagens para ficar dentro do limite (NP + 10).";
    } else {
      title = "📈 Limite de Combate Excedido";
      Icon = TrendingUp;
      titleColor = "text-yellow-300";
      fixTitle = "Recomendação:";
      fixText =
        "Reduza o bônus de ataque ou a graduação de efeito para respeitar o limite de combate (2x NP).";
    }
  }

  const content = (
    <div className="max-w-xs text-xs space-y-1">
      <div className={`font-medium ${titleColor}`}>{title}</div>

      <div className="text-xs space-y-0.5">
        {filtered.map((item) => (
          <div key={item.label} className="text-muted-foreground">
            <strong>{item.label}:</strong>{" "}
            {isLimit ? (
              <>
                {isDefense
                  ? `Excesso +${item.exceed ?? 0} pontos`
                  : `Bônus total ${total} (máximo: ${limit})`}
              </>
            ) : (
              <>
                Diferença{" "}
                {typeof item.percent === "number" ? item.percent.toFixed(1) : 0}
                %
              </>
            )}
          </div>
        ))}
      </div>

      <div
        className={`pt-1 ${isLimit ? "text-red-200" : "text-yellow-200"} border-t ${isLimit ? "border-red-400/30" : "border-yellow-400/30"}`}
      >
        <strong>{fixTitle}</strong>
        <div className="text-xs mt-1">{fixText}</div>
      </div>
    </div>
  );

  const ariaLabel = `${title}${filtered.length > 0 ? " - " + filtered.map((l) => l.label).join(", ") : ""}`;

  return (
    <Tip content={content} side="top">
      <div
        role="img"
        aria-label={ariaLabel}
        className={`relative inline-flex items-center cursor-help ${isLimit ? "text-red-500" : "text-yellow-500"}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {count > 1 && (
          <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 inline-flex items-center justify-center rounded bg-muted-foreground/10 text-[10px] min-w-[18px] h-3 text-xs font-medium">
            {count}
          </span>
        )}
      </div>
    </Tip>
  );
}

export default WarningIcon;
