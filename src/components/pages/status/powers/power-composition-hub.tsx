"use client";

import { memo, useState, useMemo } from "react";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Layers,
  Settings2,
  Trash2,
  ArrowRight,
  Sparkles,
  Info,
  Maximize2,
  Tag,
  BookOpen,
  Sliders,
  X,
  Zap,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ModifierTag } from "./components/modifier-tag";
import { QuickEffectOptions } from "./components/quick-options";
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
import { EffectModifierManager } from "./effect-modifier-manager";
import { calculatePowerCost } from "@/lib/powers/utils";
import { Button } from "@/components/ui/button";
import { ACTION_LABELS, DURATION_LABELS, RANGE_LABELS } from "@/lib/powers";
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
            <Collapsible
              open={expandedIds.includes("global-config")}
              onOpenChange={() => toggleExpand("global-config")}
              className="border border-blue-500/20 bg-blue-500/5 overflow-hidden"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-blue-500/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400">
                    <Sliders className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black uppercase tracking-widest text-white">
                      Configurações Base
                    </h4>
                    <div className="flex gap-2 mt-1">
                      {selectedDescriptors.map((d) => (
                        <span
                          key={d}
                          className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded-full text-zinc-400 font-bold"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {expandedIds.includes("global-config") ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0 border-t border-white/5 space-y-6 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  {/* Ação */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Zap className="h-3 w-3" /> Ação
                    </label>
                    <select
                      value={customAction || "default"}
                      onChange={(e) =>
                        onActionChange(
                          e.target.value === "default"
                            ? null
                            : (e.target.value as ActionType),
                        )
                      }
                      className="w-full bg-black/40 border border-white/10 p-2 text-xs"
                    >
                      <option value="default">
                        Padrão ({ACTION_LABELS[defaultAction]})
                      </option>
                      {Object.entries(ACTION_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Alcance */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" /> Alcance
                    </label>
                    <select
                      value={customRange || "default"}
                      onChange={(e) =>
                        onRangeChange(
                          e.target.value === "default"
                            ? null
                            : (e.target.value as RangeType),
                        )
                      }
                      className="w-full bg-black/40 border border-white/10 p-2 text-xs"
                    >
                      <option value="default">
                        Padrão ({RANGE_LABELS[defaultRange]})
                      </option>
                      {Object.entries(RANGE_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Duração */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Settings2 className="h-3 w-3" /> Duração
                    </label>
                    <select
                      value={customDuration || "default"}
                      onChange={(e) =>
                        onDurationChange(
                          e.target.value === "default"
                            ? null
                            : (e.target.value as DurationType),
                        )
                      }
                      className="w-full bg-black/40 border border-white/10 p-2 text-xs"
                    >
                      <option value="default">
                        Padrão ({DURATION_LABELS[defaultDuration]})
                      </option>
                      {Object.entries(DURATION_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Descritores */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Tag className="h-3 w-3" /> Descritores Narrativos
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {customDescriptors.map((d) => (
                      <button
                        key={d}
                        onClick={() => onToggleDescriptor(d)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                          selectedDescriptors.includes(d)
                            ? "bg-blue-500/20 border-blue-500 text-blue-300"
                            : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/30"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notas */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="h-3 w-3" /> Notas de Execução
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Instruções adicionais ou flavor text..."
                    className="w-full bg-black/40 border border-white/10 p-3 text-xs min-h-[80px] resize-none"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
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
                selectedEffects.map((effect) => {
                  const isExpanded = expandedIds.includes(effect.id);
                  const modifiers = selectedModifierInstances.filter((m) =>
                    m.appliesTo?.includes(effect.id),
                  );
                  const currentEffectCost = calculatePowerCost(
                    [effect],
                    selectedModifierInstances,
                    effectOptions,
                    effectOptions[effect.id]?.rank ?? rank,
                  );

                  return (
                    <Collapsible
                      key={effect.id}
                      open={isExpanded}
                      onOpenChange={() => toggleExpand(effect.id)}
                      className={`
                      group border overflow-hidden transition-all duration-300
                      ${
                        isExpanded
                          ? "border-blue-500/40 bg-blue-500/[0.03] shadow-lg shadow-blue-500/5"
                          : "border-white/5 bg-zinc-900/40 hover:border-white/10 hover:bg-zinc-900/60"
                      }
                    `}
                    >
                      {/* Compact Trigger Header */}
                      <div className="flex items-center gap-4 p-4 cursor-pointer select-none">
                        <CollapsibleTrigger asChild>
                          <div className="flex-1 flex items-center gap-4">
                            <div
                              className={`
                            p-2.5 transition-all
                            ${isExpanded ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-zinc-800 text-zinc-400 group-hover:text-zinc-200"}
                          `}
                            >
                              <Layers className="h-4 w-4" />
                            </div>

                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black uppercase tracking-tight truncate">
                                  {effect.name}
                                </span>
                                <span className="text-[9px] font-bold text-zinc-600 px-1.5 py-0.5 bg-white/5 rounded lowercase">
                                  {effect.category}
                                </span>
                              </div>

                              <div className="flex gap-1.5 flex-wrap">
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
                            </div>
                          </div>
                        </CollapsibleTrigger>

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

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleEffect(effect);
                              }}
                              className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <CollapsibleTrigger asChild>
                              <button className="p-2 text-zinc-600 hover:text-white transition-all">
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                            </CollapsibleTrigger>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Editor Content */}
                      <CollapsibleContent className="animate-in slide-in-from-top-2 duration-300">
                        <div className="p-6 pt-2 border-t border-white/5 space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Configurações de Efeito */}
                            <div className="space-y-4">
                              <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Settings2 className="h-3 w-3" /> Parâmetros do
                                Componente
                              </h5>
                              <QuickEffectOptions
                                effect={effect}
                                options={effectOptions[effect.id] || {}}
                                rank={rank}
                                onUpdate={(opts) =>
                                  onUpdateEffectOptions(effect.id, opts)
                                }
                              />
                            </div>

                            {/* Gestor de Modificadores */}
                            <div className="space-y-4">
                              <EffectModifierManager
                                effectId={effect.id}
                                selectedModifierInstances={
                                  selectedModifierInstances
                                }
                                onAddModifier={onAddModifier}
                                onRemoveModifier={onRemoveModifier}
                                onUpdateModifierOptions={
                                  onUpdateModifierOptions
                                }
                                availableExtras={availableExtras}
                                availableFlaws={availableFlaws}
                              />
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })
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
                className="h-8 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider gap-2"
              >
                <Plus className="h-3 w-3" /> Novo Slot Alt
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {alternatives.map((alt, idx) => (
                <Collapsible
                  key={alt.id}
                  open={expandedIds.includes(alt.id)}
                  onOpenChange={() => toggleExpand(alt.id)}
                  className="group border border-emerald-500/20 bg-emerald-500/[0.02] rounded-xl overflow-hidden"
                >
                  <div className="flex items-center gap-4 p-4 cursor-pointer">
                    <CollapsibleTrigger asChild>
                      <div className="flex-1 flex items-center gap-4">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">
                            Slot Alternativo {idx + 1}
                          </span>
                          <span className="text-[10px] text-emerald-400/60 font-medium">
                            {alt.effects.length} efeito(s) • Custo Interno Máx:{" "}
                            {totalCost} PP
                          </span>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRemoveAlternative(alt.id)}
                        className="p-2 text-zinc-600 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <CollapsibleTrigger>
                        {expandedIds.includes(alt.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <CollapsibleContent className="p-6 pt-0 border-t border-white/5 space-y-4 bg-black/20">
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
                        onClick={() => {
                          setTargetGroup({ alternativeId: alt.id });
                          setSelectorOpen(true);
                        }}
                        className="w-full h-10 border border-dashed border-emerald-500/20 text-emerald-400/60 hover:text-emerald-400 text-[10px] font-bold uppercase"
                      >
                        + Adicionar Efeito ao Slot
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </section>

          {/* Informações de Suporte */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
            <div className="p-4 bg-zinc-900/30 border border-white/5 rounded-xl space-y-2">
              <Info className="h-4 w-4 text-blue-400" />
              <h6 className="text-[10px] font-bold uppercase tracking-widest">
                Dica de Construção
              </h6>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Combine efeitos de &quot;Ataque&quot; com modificadores de
                &quot;Área&quot; para criar habilidades massivas. Lembre-se que
                o custo final é arredondado para cima.
              </p>
            </div>
            <div className="p-4 bg-zinc-900/30 border border-white/5 rounded-xl space-y-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h6 className="text-[10px] font-bold uppercase tracking-widest">
                Arranjos Alternativos
              </h6>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Use arranjos (Alt) para ganhar versatilidade sem aumentar
                drasticamente o custo do personagem.
              </p>
            </div>
            <div className="p-4 bg-zinc-900/30 border border-white/5 rounded-xl space-y-2">
              <ArrowRight className="h-4 w-4 text-blue-400" />
              <h6 className="text-[10px] font-bold uppercase tracking-widest">
                Fluxo de Jogo
              </h6>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Os descritores definem como o poder interage com o mundo (ex:
                Fogo, Mágico, Tecnológico).
              </p>
            </div>
          </div>
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
