"use client";

import { FC } from "react";
import { Tip } from "@/components/ui/tip";
import { EffectOptions } from "../types";
import { MOVIMENTO_SUBS } from "@/lib/powers/effect-constants";
import { Check, Info } from "lucide-react";

interface MovimentoOptionsProps {
  options: EffectOptions;
  rank: number;
  onChange: (opts: EffectOptions) => void;
}

export const MovimentoOptions: FC<MovimentoOptionsProps> = ({
  options,
  rank,
  onChange,
}) => {
  const selections = (options.selections as Record<string, number>) || {};
  const totalSelectedRanks = Object.values(selections).reduce(
    (sum, r) => sum + r,
    0,
  );
  const remainingRanks = rank - totalSelectedRanks;

  const updateSelection = (subId: string, value: number) => {
    const newSelections = { ...selections };
    if (value <= 0) {
      delete newSelections[subId];
    } else {
      newSelections[subId] = value;
    }
    onChange({ ...options, selections: newSelections });
  };

  return (
    <div className="space-y-4">
      {/* Header de Distribuição Otimizado */}
      <div className="relative overflow-hidden bg-background/40 border border-border/40 rounded-lg p-3 group/header">
        {/* Progresso de Fundo (Simbolismo Visual) */}
        <div
          className="absolute inset-y-0 left-0 bg-purple-500/5 transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(100, (totalSelectedRanks / rank) * 100)}%`,
          }}
        />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/80">
              Distribuição
            </h4>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-xl font-mono font-bold leading-none ${
                  remainingRanks < 0
                    ? "text-red-400"
                    : remainingRanks === 0
                      ? "text-green-400"
                      : "text-purple-400"
                }`}
              >
                {totalSelectedRanks}
              </span>
              <span className="text-xs text-muted-foreground/60 font-medium">
                /
              </span>
              <span className="text-sm font-mono text-muted-foreground font-bold">
                {rank}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium ml-1">
                Graduações
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {remainingRanks > 0 ? (
              <div className="px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 whitespace-nowrap backdrop-blur-sm">
                <span className="text-[9px] text-amber-400 font-bold flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
                  {remainingRanks} {remainingRanks === 1 ? "LIVRE" : "LIVRES"}
                </span>
              </div>
            ) : remainingRanks < 0 ? (
              <div className="px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20 whitespace-nowrap backdrop-blur-sm">
                <span className="text-[9px] text-red-400 font-bold">
                  EXCEDIDO ({Math.abs(remainingRanks)})
                </span>
              </div>
            ) : (
              <div className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 whitespace-nowrap backdrop-blur-sm">
                <span className="text-[9px] text-green-400 font-bold flex items-center gap-1 italic uppercase tracking-wider">
                  <Check className="h-2.5 w-2.5" />
                  Completo
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {MOVIMENTO_SUBS.map((s) => {
          const currentVal = selections[s.id] || 0;
          const isActive = currentVal > 0;

          return (
            <div
              key={s.id}
              className={`relative group flex flex-col p-2 rounded-md border transition-all ${
                isActive
                  ? "bg-purple-500/10 border-purple-500/40 shadow-[0_0_8px_-4px_rgba(168,85,247,0.4)]"
                  : "bg-background/20 border-border/30 hover:border-purple-500/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-semibold truncate pr-4 ${
                    isActive ? "text-purple-200" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
                <Tip
                  content={
                    <div className="max-w-xs text-[10px] leading-relaxed">
                      {s.tip}
                    </div>
                  }
                  side="top"
                >
                  <Info className="h-3 w-3 text-muted-foreground/50 hover:text-purple-400 cursor-help" />
                </Tip>
              </div>

              {s.maxRank > 1 ? (
                <div className="flex gap-1">
                  {[...Array(s.maxRank)].map((_, i) => {
                    const level = i + 1;
                    const isSelected = currentVal >= level;
                    const canSelect =
                      remainingRanks >= level - currentVal || isSelected;

                    return (
                      <button
                        key={level}
                        disabled={!canSelect && !isSelected}
                        onClick={() =>
                          updateSelection(
                            s.id,
                            currentVal === level ? level - 1 : level,
                          )
                        }
                        className={`flex-1 h-5 text-[10px] font-bold rounded transition-colors ${
                          isSelected
                            ? "bg-purple-500 text-white"
                            : level <= currentVal + remainingRanks
                              ? "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                              : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed"
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <button
                  onClick={() => updateSelection(s.id, isActive ? 0 : 1)}
                  disabled={!isActive && remainingRanks <= 0}
                  className={`w-full h-5 text-[9px] font-bold rounded uppercase tracking-tighter ${
                    isActive
                      ? "bg-purple-500 text-white"
                      : remainingRanks > 0
                        ? "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                        : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed"
                  }`}
                >
                  {isActive ? "Ativo" : "Selecionar"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
