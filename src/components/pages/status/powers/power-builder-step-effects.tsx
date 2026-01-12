"use client";

import { memo, useState } from "react";
import { Effect, EffectOptions, Modifier, ModifierInstance, Power } from "./types";
import { Plus, Sparkles, Trash2, Zap, Info } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { Tip } from "@/components/ui/tip";
import EffectSpecificOptions from "./effect-specific-options";
import { EffectModifierManager } from "./effect-modifier-manager";
import { EffectSelector } from "./effect-selector";
import { calculatePowerCost } from "@/lib/powers/utils";

interface PowerBuilderStepEffectsProps {
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
  onUpdateModifierOptions: (id: string, opts: Record<string, unknown>) => void;
  availableExtras: Modifier[];
  availableFlaws: Modifier[];
  // Arranjos
  alternatives?: Power[];
  onAddAlternative?: () => void;
  onRemoveAlternative?: (id: string) => void;
  onUpdateAlternative?: (id: string, updates: Partial<Power>) => void;
}

export const PowerBuilderStepEffects = memo(
  ({
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
    alternatives = [],
    onAddAlternative,
    onRemoveAlternative,
    onUpdateAlternative,
  }: PowerBuilderStepEffectsProps) => {
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [targetGroup, setTargetGroup] = useState<"primary" | { alternativeId: string }>("primary");
    const [expandedAltId, setExpandedAltId] = useState<string | null>(null);
    const [expandedAltEffectId, setExpandedAltEffectId] = useState<string | null>(null);

    const primaryCost = calculatePowerCost(selectedEffects, selectedModifierInstances, effectOptions || {}, rank);

    const handleAddEffect = (effect: Effect) => {
      if (targetGroup === "primary") {
        onToggleEffect(effect);
      } else {
        // Encontrar o alternativo e adicionar o efeito a ele
        const alt = alternatives.find(a => a.id === targetGroup.alternativeId);
        if (alt && onUpdateAlternative) {
          const newEffects = [...alt.effects, effect];
          onUpdateAlternative(alt.id, { effects: newEffects });
        }
      }
      setSelectorOpen(false);
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header da Seção */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-400" />
              Desenho do Poder
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Defina os efeitos base e crie variações (Arranjos) para maior versatilidade.
            </p>
          </div>
        </div>

        {/* Poder Principal (Slot Ativo) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400/80">Poder Principal (Ligado)</h4>
            {selectedEffects.length > 0 && (
              <button 
                onClick={() => {
                  setTargetGroup("primary");
                  setSelectorOpen(true);
                }}
                className="text-[10px] font-bold uppercase text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
              >
                <Plus className="h-3 w-3" /> Adicionar Efeito Ligado
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {selectedEffects.length > 0 ? (
              selectedEffects.map((effect) => (
                <div 
                  key={effect.id} 
                  className="bg-muted/10 border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all duration-300 group shadow-lg shadow-purple-900/5"
                >
                  {/* Card Header */}
                  <div className="p-4 bg-purple-500/5 border-b border-purple-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                         <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm group-hover:text-purple-300 transition-colors">{effect.name}</h4>
                        <p className="text-[10px] text-muted-foreground">{effect.category} • {effect.baseCost} PP/Grad</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-purple-400 font-bold">
                          {calculatePowerCost([effect], selectedModifierInstances, effectOptions || {}, effectOptions?.[effect.id]?.rank ?? rank)} PP
                        </span>
                      </div>
                      <button 
                        onClick={() => onToggleEffect(effect)}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400/50 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Configurações Internas */}
                  <div className="p-4 space-y-4 bg-background/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Graduação</label>
                          <span className="text-[10px] font-mono text-purple-400/60">
                            {effectOptions?.[effect.id]?.rank ?? rank} Ranks
                          </span>
                        </div>
                        <FormInput
                          type="number"
                          id={`rank-${effect.id}`}
                          name={`rank-${effect.id}`}
                          min={0}
                          value={effectOptions?.[effect.id]?.rank === 0 ? "" : effectOptions?.[effect.id]?.rank ?? rank}
                          onChange={(e) => {
                            const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                            onUpdateEffectOptions?.(effect.id, {
                              ...(effectOptions?.[effect.id] || {}),
                              rank: val,
                            });
                          }}
                          className="h-9 bg-background/50 border-purple-500/20 text-sm focus:border-purple-500/50"
                        />
                      </div>
                    </div>

                    <EffectSpecificOptions
                      effectId={effect.id}
                      options={effectOptions?.[effect.id]}
                      rank={effectOptions?.[effect.id]?.rank ?? rank}
                      onChange={(opts) => onUpdateEffectOptions && onUpdateEffectOptions(effect.id, opts)}
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
                </div>
              ))
            ) : (
              <button 
                onClick={() => {
                  setTargetGroup("primary");
                  setSelectorOpen(true);
                }}
                className="w-full h-48 border-2 border-dashed border-purple-500/20 rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group"
              >
                <div className="p-4 rounded-full bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                  <Plus className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm group-hover:text-purple-300">Comece seu Poder</p>
                  <p className="text-xs">Clique para adicionar o primeiro efeito</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Seção de Arranjos (Poderes Alternativos) */}
        <div className="space-y-4 pt-6 mt-6 border-t border-border/50">
           <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Poderes Alternativos (Arranjo)</h4>
              <Tip content={<div className="max-w-xs text-xs">Poderes Alternativos compartilham a mesma &quot;fonte&quot; de energia. Você só pode usar um por vez, mas cada um custa apenas 1 PP extra.</div>}>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              </Tip>
            </div>
            <button 
              onClick={onAddAlternative}
              className="text-[10px] font-bold uppercase text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
            >
              <Plus className="h-3 w-3" /> Novo Poder Alternativo
            </button>
          </div>

          <div className="space-y-4">
            {alternatives.map((alt, altIdx) => {
              const altCost = calculatePowerCost(alt.effects, alt.modifiers || [], alt.effectOptions || {}, alt.rank || 1);
              const isOverCost = altCost > primaryCost;

              return (
              <div key={alt.id} className={`relative border rounded-xl overflow-hidden transition-all duration-300 ${
                expandedAltId === alt.id 
                  ? "bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-900/10" 
                  : "bg-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/40"
              }`}>
                {/* Header do Alternativo */}
                <div 
                  onClick={() => setExpandedAltId(expandedAltId === alt.id ? null : alt.id)}
                  className="p-4 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded uppercase tracking-wider">Slot {altIdx + 1}</span>
                    <input 
                      type="text"
                      value={alt.name}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onUpdateAlternative?.(alt.id, { name: e.target.value })}
                      className="bg-transparent border-none text-sm font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50 rounded px-1"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-mono font-bold ${isOverCost ? "text-red-400" : "text-indigo-400"}`}>
                        {altCost} / {primaryCost} PP
                      </span>
                      {isOverCost && (
                         <span className="text-[8px] text-red-400 uppercase font-black animate-pulse">Custo Excedido</span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveAlternative?.(alt.id);
                      }}
                      className="p-1 text-red-400/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Conteúdo Expansível do Alternativo */}
                {(expandedAltId === alt.id || alt.effects.length === 0) && (
                  <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    {alt.effects.length > 0 ? (
                      <div className="space-y-3">
                        {alt.effects.map(eff => {
                          const isEffectExpanded = expandedAltEffectId === `${alt.id}-${eff.id}`;
                          
                          return (
                          <div key={eff.id} className={`border rounded-lg overflow-hidden transition-all ${
                            isEffectExpanded ? "border-indigo-500/40 bg-background/40" : "border-indigo-500/10 bg-background/20"
                          }`}>
                            <div 
                              onClick={() => setExpandedAltEffectId(isEffectExpanded ? null : `${alt.id}-${eff.id}`)}
                              className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-indigo-500/10 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${isEffectExpanded ? "text-indigo-300" : "text-foreground"}`}>{eff.name}</span>
                                <span className="text-[10px] opacity-40">• {eff.baseCost} PP/Grad</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-indigo-400/60 mr-2">
                                  {alt.effectOptions?.[eff.id]?.rank ?? alt.rank} Ranks
                                </span>
                                <button 
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    const newEffects = alt.effects.filter(ef => ef.id !== eff.id);
                                    onUpdateAlternative?.(alt.id, { effects: newEffects });
                                  }}
                                  className="text-red-400/30 hover:text-red-400 hover:scale-110 transition-all p-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>

                            {/* Detalhes do Efeito no Alternativo */}
                            {isEffectExpanded && (
                              <div className="p-4 border-t border-indigo-500/10 space-y-4 bg-indigo-500/5 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Graduação</label>
                                    <FormInput
                                      type="number"
                                      min={0}
                                      value={alt.effectOptions?.[eff.id]?.rank === 0 ? "" : (alt.effectOptions?.[eff.id]?.rank ?? alt.rank)}
                                      onChange={(ev) => {
                                        const val = ev.target.value === "" ? 0 : parseInt(ev.target.value);
                                        const newOpts = { ...(alt.effectOptions || {}) };
                                        newOpts[eff.id] = { ...(newOpts[eff.id] || {}), rank: val };
                                        onUpdateAlternative?.(alt.id, { effectOptions: newOpts });
                                      }}
                                      className="h-8 bg-background/50 border-indigo-500/20 text-xs"
                                    />
                                  </div>
                                </div>

                                <EffectSpecificOptions
                                  effectId={eff.id}
                                  options={alt.effectOptions?.[eff.id]}
                                  rank={alt.effectOptions?.[eff.id]?.rank ?? alt.rank}
                                  onChange={(opts) => {
                                    const newOpts = { ...(alt.effectOptions || {}) };
                                    newOpts[eff.id] = opts;
                                    onUpdateAlternative?.(alt.id, { effectOptions: newOpts });
                                  }}
                                />

                                <EffectModifierManager
                                  effectId={eff.id}
                                  selectedModifierInstances={alt.modifiers || []}
                                  onAddModifier={(mod, eid) => {
                                    const newMod: ModifierInstance = { 
                                      id: crypto.randomUUID(), 
                                      modifierId: mod.id, 
                                      modifier: mod, 
                                      appliesTo: [eid] 
                                    };
                                    onUpdateAlternative?.(alt.id, { modifiers: [...(alt.modifiers || []), newMod] });
                                  }}
                                  onRemoveModifier={(mid) => {
                                    onUpdateAlternative?.(alt.id, { modifiers: (alt.modifiers || []).filter(m => m.id !== mid) });
                                  }}
                                  onUpdateModifierOptions={(mid, opts) => {
                                    const newMods = (alt.modifiers || []).map(m => m.id === mid ? { ...m, options: opts } : m);
                                    onUpdateAlternative?.(alt.id, { modifiers: newMods });
                                  }}
                                  availableExtras={availableExtras}
                                  availableFlaws={availableFlaws}
                                />
                              </div>
                            )}
                          </div>
                          );
                        })}
                        <button 
                          onClick={() => {
                            setTargetGroup({ alternativeId: alt.id });
                            setSelectorOpen(true);
                          }}
                          className="w-full py-2 border border-dashed border-indigo-500/20 rounded text-[10px] text-indigo-400/60 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all uppercase font-bold"
                        >
                          + Ligar Novo Efeito ao Slot {altIdx + 1}
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setTargetGroup({ alternativeId: alt.id });
                          setSelectorOpen(true);
                        }}
                        className="w-full h-16 border border-dashed border-indigo-500/20 rounded-lg flex items-center justify-center gap-2 text-xs text-indigo-400/60 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all font-medium"
                      >
                        <Plus className="h-4 w-4" /> Definir Primeiro Efeito do Slot
                      </button>
                    )}
                  </div>
                )}
              </div>
              );
            })}

            {alternatives.length === 0 && (
              <p className="text-center text-[10px] text-muted-foreground italic py-4 bg-muted/5 rounded-xl border border-dashed border-border/20">
                Nenhum poder alternativo definido para este arranjo.
              </p>
            )}
          </div>
        </div>

        {/* Modal de Seleção de Efeitos */}
        {selectorOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg h-[80vh]">
              <EffectSelector 
                onClose={() => setSelectorOpen(false)}
                onSelect={handleAddEffect}
                excludeIds={
                  targetGroup === "primary" 
                    ? selectedEffects.map(e => e.id) 
                    : (alternatives.find(a => a.id === (targetGroup as { alternativeId: string }).alternativeId)?.effects.map(e => e.id) || [])
                }
              />
            </div>
          </div>
        )}
      </div>
    );
  },
);

PowerBuilderStepEffects.displayName = "PowerBuilderStepEffects";

