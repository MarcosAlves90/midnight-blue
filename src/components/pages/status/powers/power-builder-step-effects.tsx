"use client";

import { memo } from "react";
import { Effect, EffectOptions, Modifier, ModifierInstance } from "./types";
import { Search } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import EffectSpecificOptions from "./effect-specific-options";
import { EffectCardItem } from "./effect-card-item";
import { EffectModifierManager } from "./effect-modifier-manager";

interface PowerBuilderStepEffectsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filteredEffects: Effect[];
  selectedEffects: Effect[];
  onToggleEffect: (effect: Effect) => void;
  // effect-specific options (parte do estado do modal)
  effectOptions?: Record<string, EffectOptions>;
  onUpdateEffectOptions?: (effectId: string, opts: EffectOptions) => void;
  rank: number;
  // Modificadores
  selectedModifierInstances: ModifierInstance[];
  onAddModifier: (modifier: Modifier, effectId: string) => void;
  onRemoveModifier: (id: string) => void;
  onUpdateModifierOptions: (id: string, opts: Record<string, any>) => void;
  availableExtras: Modifier[];
  availableFlaws: Modifier[];
}

export const PowerBuilderStepEffects = memo(
  ({
    searchTerm,
    onSearchChange,
    filteredEffects,
    selectedEffects,
    onToggleEffect,
    effectOptions,
    onUpdateEffectOptions,
    rank,
    selectedModifierInstances,
    onAddModifier,
    onRemoveModifier,
    onUpdateModifierOptions,
    availableExtras,
    availableFlaws,
  }: PowerBuilderStepEffectsProps) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Selecione os Efeitos
            </h3>
            <p className="text-sm text-muted-foreground">
              Escolha um ou mais efeitos base para seu poder.
            </p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <FormInput
              id="effect-search"
              name="effect-search"
              placeholder="Buscar efeitos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 bg-background/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredEffects.map((effect) => {
            const isSelected = selectedEffects.some((e) => e.id === effect.id);
            return (
              <div key={effect.id}>
                <EffectCardItem
                  effect={effect}
                  isSelected={isSelected}
                  onToggle={() => onToggleEffect(effect)}
                />

                {/* Mostrar opções específicas quando o efeito estiver selecionado */}
                {isSelected && (
                  <div className="mt-2 space-y-2">
                    <div className="p-3 bg-background/20 border border-border/30 rounded">
                      <div className="flex flex-col gap-1.5 slice-x-4">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor={`rank-${effect.id}`}
                            className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                          >
                            Graduação
                          </label>
                          <span className="text-[10px] font-mono text-purple-400">
                            {effect.id === "ambiente"
                              ? "Efeito Especial"
                              : `${effectOptions?.[effect.id]?.rank ?? rank} x ${effect.baseCost} PP`}
                          </span>
                        </div>
                        <FormInput
                          type="number"
                          id={`rank-${effect.id}`}
                          name={`rank-${effect.id}`}
                          min={0}
                          value={
                            effectOptions?.[effect.id]?.rank === 0
                              ? ""
                              : effectOptions?.[effect.id]?.rank ?? rank
                          }
                          onChange={(e) => {
                            const val =
                              e.target.value === ""
                                ? 0
                                : parseInt(e.target.value);
                            onUpdateEffectOptions?.(effect.id, {
                              ...(effectOptions?.[effect.id] || {}),
                              rank: val,
                            });
                          }}
                          className="h-8 bg-background/50 text-sm"
                        />
                      </div>
                    </div>

                    <EffectSpecificOptions
                      effectId={effect.id}
                      options={effectOptions?.[effect.id]}
                      rank={effectOptions?.[effect.id]?.rank ?? rank}
                      onChange={(opts) =>
                        onUpdateEffectOptions &&
                        onUpdateEffectOptions(effect.id, opts)
                      }
                    />

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
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

PowerBuilderStepEffects.displayName = "PowerBuilderStepEffects";
