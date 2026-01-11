"use client";

import { memo, useState } from "react";
import { ActionType, DurationType, Effect, EffectOptions, Modifier, ModifierInstance, Power, RangeType } from "./types";
import { Plus, Search, Sparkles, Trash2, Zap, Info } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { Tip } from "@/components/ui/tip";
import EffectSpecificOptions from "./effect-specific-options";
import { EffectModifierManager } from "./effect-modifier-manager";
import { EffectSelector } from "./effect-selector";
import { calculatePowerCost } from "@/lib/powers/utils";

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
  // Arranjos
  alternatives?: Power[];
  onAddAlternative?: () => void;
  onRemoveAlternative?: (id: string) => void;
  onUpdateAlternative?: (id: string, updates: Partial<Power>) => void;
}

export const PowerBuilderStepEffects = memo(
  ({
    searchTerm,
    onSearchChange,
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
              <Tip content={<div className="max-w-xs text-xs">Poderes Alternativos compartilham a mesma "fonte" de energia. Você só pode usar um por vez, mas cada um custa apenas 1 PP extra.</div>}>
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
            {alternatives.map((alt, altIdx) => (
              <div key={alt.id} className="relative bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 transition-all hover:border-indigo-500/40">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded uppercase tracking-wider">Slot {altIdx + 1}</span>
                    <input 
                      type="text"
                      value={alt.name}
                      onChange={(e) => onUpdateAlternative?.(alt.id, { name: e.target.value })}
                      className="bg-transparent border-none text-sm font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50 rounded px-1"
                    />
                  </div>
                  <button 
                    onClick={() => onRemoveAlternative?.(alt.id)}
                    className="p-1 text-red-400/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {alt.effects.length > 0 ? (
                  <div className="space-y-2">
                    {alt.effects.map(e => (
                      <div key={e.id} className="flex items-center justify-between text-xs bg-background/40 p-2 rounded border border-indigo-500/10">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{e.name}</span>
                          <span className="opacity-50">• {e.baseCost} PP/Grad</span>
                        </div>
                        <button 
                          onClick={() => {
                             const newEffects = alt.effects.filter(ef => ef.id !== e.id);
                             onUpdateAlternative?.(alt.id, { effects: newEffects });
                          }}
                          className="text-red-400 hover:scale-110 transition-transform"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        setTargetGroup({ alternativeId: alt.id });
                        setSelectorOpen(true);
                      }}
                      className="w-full py-2 border border-dashed border-indigo-500/20 rounded text-[10px] text-indigo-400/60 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all uppercase font-bold"
                    >
                      + Ligar Efeito ao Slot {altIdx + 1}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setTargetGroup({ alternativeId: alt.id });
                      setSelectorOpen(true);
                    }}
                    className="w-full h-16 border border-dashed border-indigo-500/20 rounded-lg flex items-center justify-center gap-2 text-xs text-indigo-400/60 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all"
                  >
                    <Plus className="h-4 w-4" /> Definir Efeito do Slot
                  </button>
                )}
              </div>
            ))}

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
                    : (alternatives.find(a => a.id === (targetGroup as any).alternativeId)?.effects.map(e => e.id) || [])
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

