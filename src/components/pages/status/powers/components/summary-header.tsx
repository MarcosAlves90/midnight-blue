"use client";

import { memo } from "react";
import { Zap, Info } from "lucide-react";
import { Tip } from "@/components/ui/tip";

interface PowerSummaryHeaderProps {
  name: string;
  onNameChange: (name: string) => void;
  totalCost: number;
  rank: number;
}

export const PowerSummaryHeader = memo(
  ({ name, onNameChange, totalCost, rank }: PowerSummaryHeaderProps) => {
    return (
      <div className="flex flex-col gap-4 pb-4 border-b border-white/5 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/10">
              <Zap className="h-5 w-5 fill-blue-400/20" />
            </div>
            <div className="flex-1 space-y-1">
              <input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Nome do Poder..."
                className="w-full bg-transparent border-none p-0 text-xl font-black text-white placeholder:text-white/20 focus:outline-none focus:ring-0 uppercase tracking-tighter"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-black/40 border border-white/10 flex flex-col items-end">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
                Custo Total
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-blue-400 leading-none">
                  {totalCost}
                </span>
                <span className="text-[10px] font-bold text-blue-400/60 uppercase">
                  PP
                </span>
              </div>
            </div>

            <Tip content="Custo base baseado na maior graduação entre os efeitos.">
              <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 flex flex-col items-end cursor-help">
                <span className="text-[9px] font-bold text-blue-400/80 uppercase tracking-tighter">
                  Rank Global
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-white leading-none">
                    {rank}
                  </span>
                  <Info className="h-3 w-3 text-blue-400/40" />
                </div>
              </div>
            </Tip>
          </div>
        </div>
      </div>
    );
  },
);

PowerSummaryHeader.displayName = "PowerSummaryHeader";
