"use client";

import { memo } from "react";
import { Effect } from "./types";
import { Tip } from "@/components/ui/tip";

const TipContent = memo(({ content }: { content: string }) => (
  <div className="max-w-xs text-xs">{content}</div>
));
TipContent.displayName = "TipContent";

interface EffectCardItemProps {
  effect: Effect;
  isSelected: boolean;
  onToggle: () => void;
}

export const EffectCardItem = memo(
  ({ effect, isSelected, onToggle }: EffectCardItemProps) => (
    <button
      onClick={onToggle}
      className={`block w-full p-3 text-left rounded-lg border transition-all group relative overflow-hidden ${
        isSelected
          ? "border-purple-500 bg-purple-500/10"
          : "border-border/50 hover:border-purple-500/30 hover:bg-muted/30"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <Tip content={<TipContent content={effect.description} />} side="right">
          <span className="font-medium text-foreground group-hover:text-purple-400 transition-colors cursor-help underline decoration-dotted underline-offset-2">
            {effect.name}
          </span>
        </Tip>
        <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
          {effect.id === "ambiente"
            ? "1 - 2 PP/grad"
            : effect.id === "caracteristica-aumentada"
              ? "Variável"
              : `${effect.baseCost} PP/grad`}
        </span>
      </div>
    </button>
  )
);
EffectCardItem.displayName = "EffectCardItem";
