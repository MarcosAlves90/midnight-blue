"use client";

import { FC, useEffect } from "react";
import { Tip } from "@/components/ui/tip";
import { EffectOptions } from "../types";
import { COMPREENDER_SUBS } from "@/lib/powers/effect-constants";
import { OptionSelector } from "./shared-components";

interface CompreenderOptionsProps {
  options: EffectOptions;
  rank: number;
  onChange: (opts: EffectOptions) => void;
  onRankChange?: (rank: number) => void;
}

export const CompreenderOptions: FC<CompreenderOptionsProps> = ({
  options,
  rank,
  onChange,
  onRankChange,
}) => {
  const selectedSub = options.sub || "";

  const getMaxRankForSub = (subId: string) => {
    if (subId === "idiomas") return 4;
    return 2;
  };

  const maxRecommended = selectedSub ? getMaxRankForSub(selectedSub) : 2;
  const isOverLimit = rank > maxRecommended;

  // Sincronizar metadados quando o subtipo muda
  useEffect(() => {
    if (selectedSub) {
      const maxR = getMaxRankForSub(selectedSub);
      if (options.maxRank !== maxR) {
        onChange({ ...options, maxRank: maxR });
      }
    }
  }, [selectedSub, onChange, options]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {COMPREENDER_SUBS.map((s) => (
          <button
            key={s.id}
            onClick={(e) => {
              e.stopPropagation();
              onChange({
                ...options,
                sub: s.id,
              });
            }}
            className={`group p-2 text-left rounded border transition-colors ${
              selectedSub === s.id
                ? "border-purple-500 bg-purple-500/10"
                : "border-border/40 hover:border-purple-400/30 hover:bg-muted/10"
            }`}
          >
            <Tip
              side="right"
              content={
                <div className="max-w-xs text-xs whitespace-pre-line">
                  {s.tip}
                </div>
              }
            >
              <div className="text-sm font-medium underline decoration-dotted underline-offset-2">
                {s.label}
              </div>
            </Tip>
          </button>
        ))}
      </div>

      {selectedSub && (
        <div className="pt-2 border-t border-border/20">
          <OptionSelector
            label="Graduação"
            value={rank}
            min={1}
            max={20}
            step={1}
            unit=" G"
            onChange={(val) => onRankChange?.(val)}
            warning={
              isOverLimit
                ? `A graduação recomendada para ${
                    COMPREENDER_SUBS.find((s) => s.id === selectedSub)?.label
                  } é até ${maxRecommended}.`
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
};
