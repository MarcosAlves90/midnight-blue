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
  <div className="bg-black/20 p-2 ring-1 ring-white/5 flex items-center">
    <p className="text-[9px] text-zinc-500 uppercase tracking-[0.1em] font-black w-15">
      {label}
    </p>
    <p className="text-[9px] font-bold text-zinc-200 uppercase">
      {value}
    </p>
  </div>
);

export const ParameterGrid = memo(({ action, range, duration, className = "grid grid-cols-3 gap-2" }: ParameterGridProps) => {
  return (
    <div className={className}>
      <ParameterItem label="Ação" value={ACTION_LABELS[action]} />
      <ParameterItem label="Alcance" value={RANGE_LABELS[range]} />
      <ParameterItem label="Duração" value={DURATION_LABELS[duration]} />
    </div>
  );
});

ParameterGrid.displayName = "ParameterGrid";
