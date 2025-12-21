"use client";

import { FC } from "react";
import { Tip } from "@/components/ui/tip";
import { EffectOptions } from "../types";
import { AMBIENTE_SUBS } from "@/lib/powers/effect-constants";
import { OptionSelector } from "./shared-components";

interface AmbienteOptionsProps {
  options: EffectOptions;
  rank: number;
  onChange: (opts: EffectOptions) => void;
}

export const AmbienteOptions: FC<AmbienteOptionsProps> = ({
  options,
  rank,
  onChange,
}) => {
  const selectedSub = options.sub || "";
  const ppCost = options.ppCost ?? 1;

  const getTipContent = (subId: string) => {
    const sub = AMBIENTE_SUBS.find((s) => s.id === subId);
    if (!sub) return null;

    let text = sub.tip || "";
    text = text
      .replace("{r}", rank.toString())
      .replace("{pp}", ppCost.toString());

    if (subId === "calor-frio") {
      text = text.replace(
        "{pp_text}",
        ppCost === 1 ? "calor/frio moderado" : "calor/frio intenso",
      );
    } else if (subId === "impedir-movimento") {
      text = text.replace("{val}", (rank * ppCost).toString());
    } else if (subId === "luz") {
      text = text.replace(
        "{pp_text}",
        ppCost === 1
          ? "luz suficiente para reduzir camuflagem parcial"
          : "luz intensa que pode eliminar camuflagem",
      );
    } else if (subId === "visibilidade") {
      const perGrad = ppCost === 1 ? -2 : -5;
      text = text
        .replace("{perGrad}", perGrad.toString())
        .replace("{total}", (perGrad * rank).toString());
    }

    return <div>{text}</div>;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {AMBIENTE_SUBS.map((s) => (
          <button
            key={s.id}
            onClick={(e) => {
              e.stopPropagation();
              onChange({ ...options, sub: s.id });
            }}
            className={`group p-2 text-left rounded border transition-colors cursor-help ${
              selectedSub === s.id
                ? "border-purple-500 bg-purple-500/10"
                : "border-border/40 hover:border-purple-400/30 hover:bg-muted/10"
            }`}
          >
            <Tip
              side="right"
              content={
                <div className="max-w-xs text-xs">{getTipContent(s.id)}</div>
              }
            >
              <div className="text-sm font-medium underline decoration-dotted underline-offset-2">
                {s.label}
              </div>
            </Tip>
          </button>
        ))}
      </div>

      <div className="pt-2 border-t border-border/20">
        <OptionSelector
          label="Custo de PP"
          value={ppCost}
          min={1}
          max={2}
          step={1}
          unit=" PP"
          onChange={(val) => onChange({ ...options, ppCost: val })}
        />
      </div>
    </div>
  );
};
