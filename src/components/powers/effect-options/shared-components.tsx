"use client";

import { FC } from "react";

interface SelectorProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  unit?: string;
  warning?: string;
}

export const OptionSelector: FC<SelectorProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
  warning,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
          {label}:
        </span>
        <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded whitespace-nowrap">
          {value}{unit}
        </span>
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            e.stopPropagation();
            onChange(parseFloat(e.target.value));
          }}
          className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-500 min-w-0"
        />
      </div>
      {warning && (
        <p className="text-[9px] text-amber-400/80 italic leading-tight">
          * {warning}
        </p>
      )}
    </div>
  );
};
