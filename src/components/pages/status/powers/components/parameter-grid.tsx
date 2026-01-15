"use client";

import { memo } from "react";
import { ACTION_LABELS, RANGE_LABELS, DURATION_LABELS } from "@/lib/powers";
import { ActionType, RangeType, DurationType } from "../types";

interface ParameterGridProps {
  action: ActionType;
  range: RangeType;
  duration: DurationType;
  className?: string;
}

const ParameterItem = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-zinc-950/20 px-1.5 py-1 border border-white/[0.03] flex items-center justify-between gap-2 overflow-hidden">
    <p className="text-[7px] text-zinc-600 uppercase tracking-widest font-black leading-none shrink-0">
      {label}:
    </p>
    <p className="text-[9px] font-bold text-blue-400 uppercase leading-none truncate">
      {value}
    </p>
  </div>
);

export const ParameterGrid = memo(({ action, range, duration, className = "grid grid-cols-3 gap-0.5" }: ParameterGridProps) => {
  return (
    <div className={className}>
      <ParameterItem label="Ação" value={ACTION_LABELS[action]} />
      <ParameterItem label="Alcance" value={RANGE_LABELS[range]} />
      <ParameterItem label="Duração" value={DURATION_LABELS[duration]} />
    </div>
  );
});

ParameterGrid.displayName = "ParameterGrid";
