"use client";

import { memo } from "react";
import { Effect, EffectOptions } from "./types";
import { Search } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import EffectSpecificOptions from "./effect-specific-options";
import { EffectCardItem } from "./effect-card-item";

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
                  <div className="mt-2">
                    <EffectSpecificOptions
                      effectId={effect.id}
                      options={effectOptions?.[effect.id]}
                      rank={rank}
                      onChange={(opts) =>
                        onUpdateEffectOptions &&
                        onUpdateEffectOptions(effect.id, opts)
                      }
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
