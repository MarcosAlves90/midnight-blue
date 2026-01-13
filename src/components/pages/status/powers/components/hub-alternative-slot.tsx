"use client";

import { memo } from "react";
import { 
  ArrowRight, 
  Trash2, 
  Sparkles, 
  X 
} from "lucide-react";
import { HubCollapsibleSection } from "./hub-collapsible-section";
import { Button } from "@/components/ui/button";
import { Power } from "../types";

interface HubAlternativeSlotProps {
  alt: Power;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  totalCost: number;
  onRemoveAlternative: (id: string) => void;
  onUpdateAlternative: (id: string, updates: Partial<Power>) => void;
  onOpenSelector: () => void;
}

export const HubAlternativeSlot = memo(({
  alt,
  index,
  isExpanded,
  onToggle,
  totalCost,
  onRemoveAlternative,
  onUpdateAlternative,
  onOpenSelector
}: HubAlternativeSlotProps) => {
  return (
    <HubCollapsibleSection
      id={alt.id}
      isOpen={isExpanded}
      onToggle={onToggle}
      variant="emerald"
      icon={<ArrowRight className="h-4 w-4" />}
      title={`Slot Alternativo ${index + 1}`}
      subtitle={
        <span className="text-[10px] text-emerald-400/60 font-medium">
          {alt.effects.length} efeito(s) • Custo Interno Máx: {totalCost} PP
        </span>
      }
      actions={
        <button
          onClick={() => onRemoveAlternative(alt.id)}
          className="p-2 text-zinc-600 hover:text-rose-400 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      }
    >
      <div className="p-6 pt-0 border-t border-white/5 space-y-4 bg-black/20">
        <div className="mt-4 space-y-3">
          {alt.effects.map((eff) => (
            <div
              key={eff.id}
              className="flex items-center justify-between p-3 bg-white/5 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                <span className="text-xs font-bold uppercase">
                  {eff.name}
                </span>
              </div>
              <button
                onClick={() => {
                  const newEffects = alt.effects.filter(
                    (e) => e.id !== eff.id,
                  );
                  onUpdateAlternative(alt.id, {
                    effects: newEffects,
                  });
                }}
                className="text-white/20 hover:text-rose-400 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <Button
            variant="ghost"
            onClick={onOpenSelector}
            className="w-full h-10 border border-dashed border-emerald-500/20 text-emerald-400/60 hover:text-emerald-400 text-[10px] font-bold uppercase"
          >
            + Adicionar Efeito ao Slot
          </Button>
        </div>
      </div>
    </HubCollapsibleSection>
  );
});

HubAlternativeSlot.displayName = "HubAlternativeSlot";
