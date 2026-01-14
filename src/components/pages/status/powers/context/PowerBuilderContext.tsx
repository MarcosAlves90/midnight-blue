"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { Modifier, ModifierInstance, Effect, EffectOptions, Power } from "../types";

interface PowerBuilderContextValue {
  // Configs
  availableExtras: Modifier[];
  availableFlaws: Modifier[];
  rank: number;
  effectOptions: Record<string, EffectOptions>;
  selectedModifierInstances: ModifierInstance[];
  
  // Handlers
  onToggleEffect: (effect: Effect) => void;
  onUpdateEffectOptions: (id: string, opts: EffectOptions) => void;
  onAddModifier: (m: Modifier, effectId: string) => void;
  onRemoveModifier: (id: string) => void;
  onUpdateModifierOptions: (id: string, opts: Record<string, unknown>) => void;
  
  // Alternatives Handlers
  onUpdateAlternative: (id: string, updates: Partial<Power>) => void;
  onRemoveAlternative: (id: string) => void;
}

const PowerBuilderContext = createContext<PowerBuilderContextValue | null>(null);

export function usePowerBuilderContext() {
  const context = useContext(PowerBuilderContext);
  if (!context) {
    throw new Error("usePowerBuilderContext must be used within a PowerBuilderProvider");
  }
  return context;
}

interface PowerBuilderProviderProps extends PowerBuilderContextValue {
  children: ReactNode;
}

export function PowerBuilderProvider({ children, ...props }: PowerBuilderProviderProps) {
  const {
    availableExtras,
    availableFlaws,
    rank,
    effectOptions,
    selectedModifierInstances,
    onToggleEffect,
    onUpdateEffectOptions,
    onAddModifier,
    onRemoveModifier,
    onUpdateModifierOptions,
    onUpdateAlternative,
    onRemoveAlternative
  } = props;

  // Estabiliza o valor do contexto para evitar re-renders desnecessários de todos os consumidores
  const value = useMemo(() => ({
    availableExtras,
    availableFlaws,
    rank,
    effectOptions,
    selectedModifierInstances,
    onToggleEffect,
    onUpdateEffectOptions,
    onAddModifier,
    onRemoveModifier,
    onUpdateModifierOptions,
    onUpdateAlternative,
    onRemoveAlternative
  }), [
    availableExtras,
    availableFlaws,
    rank,
    effectOptions,
    selectedModifierInstances,
    onToggleEffect,
    onUpdateEffectOptions,
    onAddModifier,
    onRemoveModifier,
    onUpdateModifierOptions,
    onUpdateAlternative,
    onRemoveAlternative
  ]);

  return (
    <PowerBuilderContext.Provider value={value}>
      {children}
    </PowerBuilderContext.Provider>
  );
}
