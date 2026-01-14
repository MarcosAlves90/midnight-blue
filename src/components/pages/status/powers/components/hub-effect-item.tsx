"use client";

import { memo, useMemo } from "react";
import { 
  Layers, 
  Trash2, 
} from "lucide-react";
import { HubCollapsibleSection } from "./hub-collapsible-section";
import { ModifierTag } from "./modifier-tag";
import { QuickEffectOptions } from "./quick-options";
import { EffectModifierManager } from "../effect-modifier-manager";
import { Effect, EffectOptions, Modifier, ModifierInstance } from "../types";
import { calculatePowerCost } from "@/lib/powers/utils";
import { usePowerBuilderContext } from "../context/PowerBuilderContext";

interface HubEffectItemProps {
  effect: Effect;
  isExpanded: boolean;
  onToggle: () => void;
  // Permite sobrescrever dados quando dentro de um slot alternativo
  overrideHandlers?: {
    rank: number;
    effectOptions: Record<string, EffectOptions>;
    selectedModifierInstances: ModifierInstance[];
    onToggleEffect: (effect: Effect) => void;
    onUpdateEffectOptions: (id: string, opts: EffectOptions) => void;
    onAddModifier: (m: Modifier, effectId: string) => void;
    onRemoveModifier: (id: string) => void;
    onUpdateModifierOptions: (id: string, opts: Record<string, unknown>) => void;
  };
}

export const HubEffectItem = memo(({
  effect,
  isExpanded,
  onToggle,
  overrideHandlers,
}: HubEffectItemProps) => {
  const context = usePowerBuilderContext();
  
  // Resolve handlers (prioridade para override se existir)
  const handlers = overrideHandlers || context;
  const {
    rank,
    effectOptions,
    selectedModifierInstances,
    onToggleEffect,
    onUpdateEffectOptions,
    onAddModifier,
    onRemoveModifier,
    onUpdateModifierOptions,
  } = handlers;
  
  const { availableExtras, availableFlaws } = context;

  const modifiers = useMemo(() => 
    selectedModifierInstances.filter((m) => m.appliesTo?.includes(effect.id)),
    [selectedModifierInstances, effect.id]
  );
  
  const currentEffectCost = useMemo(() => calculatePowerCost(
    [effect],
    selectedModifierInstances,
    effectOptions,
    effectOptions[effect.id]?.rank ?? rank,
  ), [effect, selectedModifierInstances, effectOptions, rank]);

  const displayName = effectOptions[effect.id]?.customName || effect.name;

  return (
    <HubCollapsibleSection
      id={effect.id}
      isOpen={isExpanded}
      onToggle={onToggle}
      variant={isExpanded ? "blue" : "default"}
      icon={<Layers className="h-4 w-4" />}
      title={
        <div className="flex items-center gap-2">
          <span>{displayName}</span>
          {effectOptions[effect.id]?.customName && (
            <span className="text-[10px] text-zinc-500 font-medium italic">
              ({effect.name})
            </span>
          )}
          <span className="text-[9px] font-bold text-zinc-600 px-1.5 py-0.5 bg-white/5 rounded lowercase">
            {effect.category}
          </span>
        </div>
      }
      subtitle={
        <div className="flex gap-1.5 flex-wrap mt-0.5">
          {modifiers.length > 0 ? (
            modifiers
              .slice(0, 3)
              .map((m) => (
                <ModifierTag
                  key={m.id}
                  modifierInstance={m}
                  compact
                />
              ))
          ) : (
            <span className="text-[9px] text-zinc-600 font-medium italic">
              Sem modificadores aplicados
            </span>
          )}
          {modifiers.length > 3 && (
            <span className="text-[9px] text-zinc-600 font-bold">
              +{modifiers.length - 3}
            </span>
          )}
        </div>
      }
      actions={
        <div className="flex items-center gap-6">
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span className="text-sm font-black text-blue-400">
                {currentEffectCost}
              </span>
              <span className="text-[9px] text-blue-400/50 font-bold uppercase">
                PP
              </span>
            </div>
            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-tighter">
              Rank {effectOptions[effect.id]?.rank ?? rank}
            </span>
          </div>

          <div className="h-8 w-px bg-white/5" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleEffect(effect);
            }}
            className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="p-2 border-t border-white/5 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <QuickEffectOptions
              effect={effect}
              options={effectOptions[effect.id] || {}}
              rank={rank}
              onUpdate={(opts) =>
                onUpdateEffectOptions(effect.id, opts)
              }
            />
          </div>

          <div className="space-y-4">
            <EffectModifierManager
              effectId={effect.id}
              selectedModifierInstances={selectedModifierInstances}
              onAddModifier={onAddModifier}
              onRemoveModifier={onRemoveModifier}
              onUpdateModifierOptions={onUpdateModifierOptions}
              availableExtras={availableExtras}
              availableFlaws={availableFlaws}
            />
          </div>
        </div>
      </div>
    </HubCollapsibleSection>
  );
});

HubEffectItem.displayName = "HubEffectItem";
