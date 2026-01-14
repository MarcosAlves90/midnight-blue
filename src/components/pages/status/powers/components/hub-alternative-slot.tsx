"use client";

import { memo } from "react";
import { 
  ArrowRight, 
  Trash2, 
  Sparkles, 
  X,
  AlertTriangle 
} from "lucide-react";
import { HubCollapsibleSection } from "./hub-collapsible-section";
import { Button } from "@/components/ui/button";
import { Effect, EffectOptions, Modifier, ModifierInstance, Power } from "../types";
import { HubEffectItem } from "./hub-effect-item";
import { calculatePowerCost } from "@/lib/powers/utils";

interface HubAlternativeSlotProps {
  alt: Power;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  totalCost: number;
  onRemoveAlternative: (id: string) => void;
  onUpdateAlternative: (id: string, updates: Partial<Power>) => void;
  onOpenSelector: () => void;
  availableExtras: Modifier[];
  availableFlaws: Modifier[];
  expandedIds: string[];
  onToggleExpand: (id: string) => void;
}

export const HubAlternativeSlot = memo(({
  alt,
  index,
  isExpanded,
  onToggle,
  totalCost,
  onRemoveAlternative,
  onUpdateAlternative,
  onOpenSelector,
  availableExtras,
  availableFlaws,
  expandedIds,
  onToggleExpand,
}: HubAlternativeSlotProps) => {
  const internalCost = calculatePowerCost(
    alt.effects,
    alt.modifiers || [],
    alt.effectOptions || {},
    alt.rank
  );

  const isOverLimit = internalCost > totalCost;

  const handleUpdateEffectOptions = (effectId: string, opts: EffectOptions) => {
    onUpdateAlternative(alt.id, {
      effectOptions: {
        ...(alt.effectOptions || {}),
        [effectId]: opts,
      },
    });
  };

  const handleAddModifier = (m: Modifier, effectId: string) => {
    const newModifierInstance: ModifierInstance = {
      id: Math.random().toString(36).substr(2, 9),
      modifierId: m.id,
      modifier: m,
      appliesTo: [effectId],
    };
    onUpdateAlternative(alt.id, {
      modifiers: [...(alt.modifiers || []), newModifierInstance],
    });
  };

  const handleRemoveModifier = (id: string) => {
    onUpdateAlternative(alt.id, {
      modifiers: (alt.modifiers || []).filter((m) => m.id !== id),
    });
  };

  const handleUpdateModifierOptions = (id: string, opts: Record<string, unknown>) => {
    onUpdateAlternative(alt.id, {
      modifiers: (alt.modifiers || []).map((m) =>
        m.id === id ? { ...m, options: { ...(m.options || {}), ...opts } } : m
      ),
    });
  };

  const handleRemoveEffect = (effect: Effect) => {
    onUpdateAlternative(alt.id, {
      effects: alt.effects.filter((e) => e.id !== effect.id),
    });
  };

  return (
    <HubCollapsibleSection
      id={alt.id}
      isOpen={isExpanded}
      onToggle={onToggle}
      variant="emerald"
      icon={<ArrowRight className="h-4 w-4" />}
      title={`Slot Alternativo ${index + 1}`}
      subtitle={
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-emerald-400/60 font-medium">
            {alt.effects.length} efeito(s) • Custo Interno Máx: {totalCost} PP
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-bold uppercase tracking-tighter ${isOverLimit ? "text-rose-400" : "text-emerald-400"}`}>
              Custo Atual: {internalCost} PP
            </span>
            {isOverLimit && (
              <span className="flex items-center gap-1 text-[8px] text-rose-400 font-bold uppercase animate-pulse">
                <AlertTriangle className="h-2.5 w-2.5" /> Excede Limite
              </span>
            )}
          </div>
        </div>
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
            <HubEffectItem
              key={eff.id}
              effect={eff}
              isExpanded={expandedIds.includes(`${alt.id}-${eff.id}`)}
              onToggle={() => onToggleExpand(`${alt.id}-${eff.id}`)}
              rank={alt.rank}
              effectOptions={alt.effectOptions || {}}
              selectedModifierInstances={alt.modifiers || []}
              onToggleEffect={handleRemoveEffect}
              onUpdateEffectOptions={handleUpdateEffectOptions}
              onAddModifier={handleAddModifier}
              onRemoveModifier={handleRemoveModifier}
              onUpdateModifierOptions={handleUpdateModifierOptions}
              availableExtras={availableExtras}
              availableFlaws={availableFlaws}
            />
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
