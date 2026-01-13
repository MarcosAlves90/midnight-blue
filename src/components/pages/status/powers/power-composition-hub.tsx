"use client";

import { memo, useState, useMemo } from "react";
import {
  Plus,
  Maximize2,
} from "lucide-react";
import { HubGlobalConfig } from "./components/hub-global-config";
import { HubEffectItem } from "./components/hub-effect-item";
import { HubAlternativeSlot } from "./components/hub-alternative-slot";
import { PowerSummaryHeader } from "./components/summary-header";
import {
  ActionType,
  DurationType,
  Effect,
  EffectOptions,
  Modifier,
  ModifierInstance,
  Power,
  RangeType,
} from "./types";
import { EffectSelector } from "./effect-selector";
import { calculatePowerCost } from "@/lib/powers/utils";
import { Button } from "@/components/ui/button";
import { useCustomDescriptors } from "@/contexts/CustomDescriptorsContext";

interface PowerCompositionHubProps {
  name: string;
  onNameChange: (val: string) => void;
  selectedEffects: Effect[];
  onToggleEffect: (effect: Effect) => void;
  effectOptions: Record<string, EffectOptions>;
  onUpdateEffectOptions: (id: string, opts: EffectOptions) => void;
  rank: number;
  selectedModifierInstances: ModifierInstance[];
  onAddModifier: (m: Modifier, effectId: string) => void;
  onRemoveModifier: (id: string) => void;
  onUpdateModifierOptions: (id: string, opts: Record<string, unknown>) => void;
  availableExtras: Modifier[];
  availableFlaws: Modifier[];
  // Novos props para consolidar tudo
  selectedDescriptors: string[];
  onToggleDescriptor: (d: string) => void;
  notes: string;
  onNotesChange: (n: string) => void;
  customAction: ActionType | null;
  onActionChange: (a: ActionType | null) => void;
  customRange: RangeType | null;
  onRangeChange: (r: RangeType | null) => void;
  customDuration: DurationType | null;
  onDurationChange: (d: DurationType | null) => void;
  defaultAction: ActionType;
  defaultRange: RangeType;
  defaultDuration: DurationType;
  // Arranjos
  alternatives: Power[];
  onAddAlternative: () => void;
  onRemoveAlternative: (id: string) => void;
  onUpdateAlternative: (id: string, updates: Partial<Power>) => void;
}

export const PowerCompositionHub = memo(
  ({
    name,
    onNameChange,
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
    selectedDescriptors,
    onToggleDescriptor,
    notes,
    onNotesChange,
    customAction,
    onActionChange,
    customRange,
    onRangeChange,
    customDuration,
    onDurationChange,
    defaultAction,
    defaultRange,
    defaultDuration,
    alternatives,
    onAddAlternative,
    onRemoveAlternative,
    onUpdateAlternative,
  }: PowerCompositionHubProps) => {
    const [expandedIds, setExpandedIds] = useState<string[]>(["global-config"]);
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [targetGroup, setTargetGroup] = useState<
      "primary" | { alternativeId: string }
    >("primary");
    const { customDescriptors } = useCustomDescriptors();

    const toggleExpand = (id: string) =>
      setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );

    const totalCost = useMemo(() => {
      const base = calculatePowerCost(
        selectedEffects,
        selectedModifierInstances,
        effectOptions,
        rank,
      );
      return base + (alternatives?.length || 0);
    }, [
      selectedEffects,
      selectedModifierInstances,
      effectOptions,
      rank,
      alternatives,
    ]);

    const handleEffectSelect = (effect: Effect) => {
      if (targetGroup === "primary") {
        onToggleEffect(effect);
      } else {
        const alt = alternatives.find(
          (a) => a.id === targetGroup.alternativeId,
        );
        if (alt) {
          onUpdateAlternative(alt.id, { effects: [...alt.effects, effect] });
        }
      }
      setSelectorOpen(false);
    };

    return (
      <div className="flex flex-col h-full text-zinc-100 selection:bg-blue-500/30">
        <PowerSummaryHeader
          name={name}
          onNameChange={onNameChange}
          totalCost={totalCost}
          rank={rank}
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {/* Bloco 0: Parâmetros Globais e Descritores */}
          <section className="space-y-3">
            <HubGlobalConfig
              expanded={expandedIds.includes("global-config")}
              onToggle={() => toggleExpand("global-config")}
              selectedDescriptors={selectedDescriptors}
              onToggleDescriptor={onToggleDescriptor}
              notes={notes}
              onNotesChange={onNotesChange}
              customAction={customAction}
              onActionChange={onActionChange}
              customRange={customRange}
              onRangeChange={onRangeChange}
              customDuration={customDuration}
              onDurationChange={onDurationChange}
              defaultAction={defaultAction}
              defaultRange={defaultRange}
              defaultDuration={defaultDuration}
              customDescriptors={customDescriptors}
            />
          </section>

          {/* Seção de Efeitos */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500/70">
                  Arquitetura de Efeitos
                </h4>
                <p className="text-[10px] text-zinc-500 font-medium">
                  Combine efeitos bases para criar poderes complexos.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectorOpen(true)}
                className="h-8 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 text-[10px] rounded-none font-bold uppercase tracking-wider gap-2"
              >
                <Plus className="h-3 w-3" /> Inserir Componente
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {selectedEffects.length === 0 ? (
                <div
                  onClick={() => setSelectorOpen(true)}
                  className="group border border-dashed border-white/5 p-8 flex flex-col items-center justify-center gap-4 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer"
                >
                  <div className="rounded-full text-zinc-600 group-hover:scale-110 group-hover:text-blue-500 transition-all">
                    <Maximize2 className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-zinc-400">
                      Nenhum componente selecionado
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">
                      Clique para abrir o catálogo e começar a construção.
                    </p>
                  </div>
                </div>
              ) : (
                selectedEffects.map((effect) => (
                  <HubEffectItem
                    key={effect.id}
                    effect={effect}
                    isExpanded={expandedIds.includes(effect.id)}
                    onToggle={() => toggleExpand(effect.id)}
                    rank={rank}
                    effectOptions={effectOptions}
                    selectedModifierInstances={selectedModifierInstances}
                    onToggleEffect={onToggleEffect}
                    onUpdateEffectOptions={onUpdateEffectOptions}
                    onAddModifier={onAddModifier}
                    onRemoveModifier={onRemoveModifier}
                    onUpdateModifierOptions={onUpdateModifierOptions}
                    availableExtras={availableExtras}
                    availableFlaws={availableFlaws}
                  />
                ))
              )}
            </div>
          </section>

          {/* Bloco 3: Arranjos Alternativos */}
          <section className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500/70">
                  Arranjos Alternativos
                </h4>
                <p className="text-[10px] text-zinc-500 font-medium">
                  Slots para variações do mesmo poder (Custo fixo: 1 PP/slot).
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddAlternative}
                className="h-8 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 rounded-none text-[10px] font-bold uppercase tracking-wider gap-2"
              >
                <Plus className="h-3 w-3" /> Novo Slot Alt
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {alternatives.map((alt, idx) => (
                <HubAlternativeSlot
                  key={alt.id}
                  alt={alt}
                  index={idx}
                  isExpanded={expandedIds.includes(alt.id)}
                  onToggle={() => toggleExpand(alt.id)}
                  totalCost={totalCost}
                  onRemoveAlternative={onRemoveAlternative}
                  onUpdateAlternative={onUpdateAlternative}
                  onOpenSelector={() => {
                    setTargetGroup({ alternativeId: alt.id });
                    setSelectorOpen(true);
                  }}
                />
              ))}
            </div>
          </section>

        </div>

        {/* Catálogo de Efeitos (Modal) */}
        {selectorOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg h-[80vh]">
              <EffectSelector
                onClose={() => setSelectorOpen(false)}
                onSelect={handleEffectSelect}
                excludeIds={
                  targetGroup === "primary"
                    ? selectedEffects.map((e) => e.id)
                    : alternatives
                        .find((a) => a.id === targetGroup.alternativeId)
                        ?.effects.map((e) => e.id) || []
                }
              />
            </div>
          </div>
        )}
      </div>
    );
  },
);

PowerCompositionHub.displayName = "PowerCompositionHub";
