"use client";

import { FC, useMemo, useCallback } from "react";
import { Tip } from "@/components/ui/tip";
import { EffectOptions } from "../types";
import { Check, Info } from "lucide-react";

export interface SubOption {
  id: string;
  label: string;
  tip: string;
  maxRank: number;
}

interface EffectOptionsTemplateProps {
  options: EffectOptions;
  rank: number;
  onChange: (opts: EffectOptions) => void;
  subOptions: SubOption[];
  config: {
    title: string;
    unitLabels: {
      singular: string;
      plural: string;
    };
    color: string; // e.g., "purple", "blue", "green"
    completeLabel: string;
  };
}

export const EffectOptionsTemplate: FC<EffectOptionsTemplateProps> = ({
  options,
  rank,
  onChange,
  subOptions,
  config,
}) => {
  const selections = useMemo(
    () => (options.selections as Record<string, number>) || {},
    [options.selections],
  );

  const totalSelectedRanks = useMemo(
    () => Object.values(selections).reduce((sum, r) => sum + r, 0),
    [selections],
  );

  const remainingRanks = rank - totalSelectedRanks;

  const updateSelection = useCallback(
    (subId: string, value: number) => {
      const newSelections = { ...selections };
      if (value <= 0) {
        delete newSelections[subId];
      } else {
        newSelections[subId] = value;
      }
      onChange({ ...options, selections: newSelections });
    },
    [selections, options, onChange],
  );

  const colorMaps: Record<string, any> = {
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/40",
      text: "text-purple-400",
      textMuted: "text-purple-400/30",
      textActive: "text-purple-200",
      btnActive: "bg-purple-500 text-white",
      btnGhost: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20",
      progress: "bg-purple-500/5",
      icon: "text-purple-400",
      textHover: "hover:text-purple-400",
      shadow: "shadow-[0_0_8px_-4px_rgba(168,85,247,0.4)]",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/40",
      text: "text-blue-400",
      textMuted: "text-blue-400/30",
      textActive: "text-blue-200",
      btnActive: "bg-blue-500 text-white",
      btnGhost: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
      progress: "bg-blue-500/5",
      icon: "text-blue-400",
      textHover: "hover:text-blue-400",
      shadow: "shadow-[0_0_8px_-4px_rgba(59,130,246,0.4)]",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
      text: "text-emerald-400",
      textMuted: "text-emerald-400/30",
      textActive: "text-emerald-200",
      btnActive: "bg-emerald-500 text-white",
      btnGhost: "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
      progress: "bg-emerald-500/5",
      icon: "text-emerald-400",
      textHover: "hover:text-emerald-400",
      shadow: "shadow-[0_0_8px_-4px_rgba(16,185,129,0.4)]",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/40",
      text: "text-amber-400",
      textMuted: "text-amber-400/30",
      textActive: "text-amber-200",
      btnActive: "bg-amber-500 text-white",
      btnGhost: "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
      progress: "bg-amber-500/5",
      icon: "text-amber-400",
      textHover: "hover:text-amber-400",
      shadow: "shadow-[0_0_8px_-4px_rgba(245,158,11,0.4)]",
    },
  };

  const theme = colorMaps[config.color] || colorMaps.purple;

  return (
    <div className="space-y-4">
      {/* Header de Distribuição Otimizado */}
      <div className="relative overflow-hidden bg-background/40 border border-border/40 rounded-lg p-3 group/header">
        {/* Progressão de Fundo */}
        <div
          className={`absolute inset-y-0 left-0 transition-all duration-500 ease-out ${theme.progress}`}
          style={{
            width: `${Math.min(100, (totalSelectedRanks / rank) * 100)}%`,
          }}
        />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/80">
              {config.title}
            </h4>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-xl font-mono font-bold leading-none ${
                  remainingRanks < 0
                    ? "text-red-400"
                    : remainingRanks === 0
                      ? "text-green-400"
                      : theme.text
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
                {totalSelectedRanks === 1
                  ? config.unitLabels.singular
                  : config.unitLabels.plural}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {remainingRanks > 0 ? (
              <div className="px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 whitespace-nowrap backdrop-blur-sm">
                <span className="text-[9px] text-amber-400 font-bold flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
                  {remainingRanks} {remainingRanks === 1 ? config.unitLabels.singular : config.unitLabels.plural} LIVRES
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
                  {config.completeLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {subOptions.map((s) => {
          const currentVal = selections[s.id] || 0;
          const isActive = currentVal > 0;

          return (
            <div
              key={s.id}
              className={`relative group flex flex-col p-2 rounded-md border transition-all ${
                isActive
                  ? `${theme.bg} ${theme.border} ${theme.shadow}`
                  : "bg-background/20 border-border/30 hover:border-border/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-semibold truncate pr-4 ${
                    isActive ? theme.textActive : "text-muted-foreground"
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
                  <Info className={`h-3 w-3 text-muted-foreground/50 cursor-help ${theme.textHover}`} />
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
                            ? theme.btnActive
                            : level <= currentVal + remainingRanks
                              ? theme.btnGhost
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
                  className={`w-full h-5 text-[9px] font-bold rounded uppercase tracking-tighter transition-colors ${
                    isActive
                      ? theme.btnActive
                      : remainingRanks > 0
                        ? theme.btnGhost
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

