"use client";

import { memo, useMemo, useCallback } from "react";
import { 
  ArrowRight, 
  Trash2, 
  AlertTriangle 
} from "lucide-react";
import { HubCollapsibleSection } from "./hub-collapsible-section";
import { Button } from "@/components/ui/button";
import { Effect, EffectOptions, Modifier, ModifierInstance, Power } from "../types";
import { HubEffectItem } from "./hub-effect-item";
import { calculatePowerCost } from "@/lib/powers/utils";
import { usePowerBuilderContext } from "../context/PowerBuilderContext";

interface HubAlternativeSlotProps {
  alt: Power;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  basePowerLimit: number;
  onOpenSelector: () => void;
  expandedIds: string[];
  onToggleExpand: (id: string) => void;
}

export const HubAlternativeSlot = memo(({
  alt,
  index,
  isExpanded,
  onToggle,
  basePowerLimit,
  onOpenSelector,
  expandedIds,
  onToggleExpand,
}: HubAlternativeSlotProps) => {
  const { 
    onUpdateAlternative, 
    onRemoveAlternative,
  } = usePowerBuilderContext();

  const internalCost = useMemo(() => calculatePowerCost(
    alt.effects,
    alt.modifiers || [],
    alt.effectOptions || {},
    alt.rank
  ), [alt.effects, alt.modifiers, alt.effectOptions, alt.rank]);

  const isOverLimit = internalCost > basePowerLimit;

  const handleUpdateEffectOptions = useCallback((effectId: string, opts: EffectOptions) => {
    onUpdateAlternative(alt.id, {
      effectOptions: {
        ...(alt.effectOptions || {}),
        [effectId]: opts,
      },
    });
  }, [alt.id, alt.effectOptions, onUpdateAlternative]);

  const handleAddModifier = useCallback((m: Modifier, effectId: string) => {
    const newModifierInstance: ModifierInstance = {
      id: Math.random().toString(36).substr(2, 9),
      modifierId: m.id,
      modifier: m,
      appliesTo: [effectId],
    };
    onUpdateAlternative(alt.id, {
      modifiers: [...(alt.modifiers || []), newModifierInstance],
    });
  }, [alt.id, alt.modifiers, onUpdateAlternative]);

  const handleRemoveModifier = useCallback((id: string) => {
    onUpdateAlternative(alt.id, {
      modifiers: (alt.modifiers || []).filter((m) => m.id !== id),
    });
  }, [alt.id, alt.modifiers, onUpdateAlternative]);

  const handleUpdateModifierOptions = useCallback((id: string, opts: Record<string, unknown>) => {
    onUpdateAlternative(alt.id, {
      modifiers: (alt.modifiers || []).map((m) =>
        m.id === id ? { ...m, options: { ...(m.options || {}), ...opts } } : m
      ),
    });
  }, [alt.id, alt.modifiers, onUpdateAlternative]);

  const handleRemoveEffect = useCallback((effect: Effect) => {
    onUpdateAlternative(alt.id, {
      effects: alt.effects.filter((e) => e.id !== effect.id),
    });
  }, [alt.id, alt.effects, onUpdateAlternative]);

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
            {alt.effects.length} efeito(s) • Custo Interno Máx: {basePowerLimit} PP
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
          onClick={(e) => {
            e.stopPropagation();
            onRemoveAlternative(alt.id);
          }}
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
              overrideHandlers={{
                rank: alt.rank,
                effectOptions: alt.effectOptions || {},
                selectedModifierInstances: alt.modifiers || [],
                onToggleEffect: handleRemoveEffect,
                onUpdateEffectOptions: handleUpdateEffectOptions,
                onAddModifier: handleAddModifier,
                onRemoveModifier: handleRemoveModifier,
                onUpdateModifierOptions: handleUpdateModifierOptions,
              }}
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
