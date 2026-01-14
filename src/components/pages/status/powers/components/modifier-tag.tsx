"use client";

import { memo } from "react";
import { ModifierInstance } from "../types";
import { Tip } from "@/components/ui/tip";

interface ModifierTagProps {
  modifierInstance: ModifierInstance;
  compact?: boolean;
}

export const ModifierTag = memo(
  ({ modifierInstance, compact }: ModifierTagProps) => {
    const { modifier } = modifierInstance;
    const isExtra = modifier.type === "extra";

    return (
      <Tip
        content={
          <div className="max-w-xs space-y-1">
            <p className="font-bold text-xs">{modifier.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {modifier.description}
            </p>
          </div>
        }
      >
        <div
          className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border
        ${
          isExtra
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
        }
        ${compact ? "px-1.5 py-0" : ""}
      `}
        >
          {modifier.name}
          <span className="opacity-60 font-mono">
            {modifier.costPerRank > 0 ? "+" : ""}
            {modifier.costPerRank}
            {modifier.isFlat ? " PF" : " PP"}
          </span>
        </div>
      </Tip>
    );
  },
);

ModifierTag.displayName = "ModifierTag";
