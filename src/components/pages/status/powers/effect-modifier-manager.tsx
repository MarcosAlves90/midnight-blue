"use client";

import { FC, memo, useState, useMemo } from "react";
import { Modifier, ModifierInstance } from "./types";
import { Tip } from "@/components/ui/tip";
import { Plus, Trash2, Search } from "lucide-react";

interface EffectModifierManagerProps {
  effectId: string;
  selectedModifierInstances: ModifierInstance[];
  onAddModifier: (modifier: Modifier, effectId: string) => void;
  onRemoveModifier: (id: string) => void;
  onUpdateModifierOptions: (id: string, opts: Record<string, unknown>) => void;
  availableExtras: Modifier[];
  availableFlaws: Modifier[];
}

export const EffectModifierManager: FC<EffectModifierManagerProps> = memo(
  ({
    effectId,
    selectedModifierInstances,
    onAddModifier,
    onRemoveModifier,
    availableExtras,
    availableFlaws,
  }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"extra" | "falha">("extra");

    const effectModifiers = useMemo(() => {
      return selectedModifierInstances.filter((inst) => {
        const targets = inst.appliesTo || inst.modifier.appliesTo;
        if (!targets || targets.length === 0) return false; // Modificadores gerais ficam no Step 3
        return targets.includes(effectId);
      });
    }, [selectedModifierInstances, effectId]);

    const { specific, normal } = useMemo(() => {
      const list = activeTab === "extra" ? availableExtras : availableFlaws;
      const filtered = list.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.description.toLowerCase().includes(search.toLowerCase()),
      );

      return {
        specific: filtered.filter((m) => m.appliesTo && m.appliesTo.includes(effectId)),
        normal: filtered.filter((m) => !m.appliesTo || !m.appliesTo.includes(effectId)),
      };
    }, [activeTab, availableExtras, availableFlaws, search, effectId]);

    return (
      <div className="mt-3 space-y-2 border-t border-border/20 pt-3">
        <div className="flex items-center justify-between px-1">
          <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Modificadores do Efeito
          </h5>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`p-1 rounded transition-colors ${
              isAdding
                ? "bg-purple-500 text-white"
                : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
            }`}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {isAdding && (
          <div className="p-2 bg-background/40 border border-purple-500/20 rounded-md space-y-2 animate-in fade-in slide-in-from-top-1">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("extra")}
                className={`flex-1 py-1 text-[9px] font-bold rounded uppercase tracking-tighter transition-colors ${
                  activeTab === "extra"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-muted/20 text-muted-foreground border border-transparent"
                }`}
              >
                Extras
              </button>
              <button
                onClick={() => setActiveTab("falha")}
                className={`flex-1 py-1 text-[9px] font-bold rounded uppercase tracking-tighter transition-colors ${
                  activeTab === "falha"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-muted/20 text-muted-foreground border border-transparent"
                }`}
              >
                Falhas
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1.5 h-3 w-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 bg-background/50 border border-border/30 rounded text-xs focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {specific.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[9px] text-purple-400 font-bold uppercase tracking-tighter px-1">
                    Específicos do Efeito
                  </p>
                  <div className="space-y-1">
                    {specific.map((m) => (
                      <Tip
                        key={m.id}
                        content={<div className="max-w-xs text-[10px]">{m.description}</div>}
                        side="right"
                      >
                        <button
                          onClick={() => {
                            onAddModifier(m, effectId);
                            setSearch("");
                          }}
                          className="w-full text-left p-1.5 rounded bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium group-hover:text-purple-300 cursor-help underline decoration-dotted underline-offset-2">
                              {m.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono ${activeTab === "extra" ? "text-green-400" : "text-red-400"}`}
                            >
                              {m.costPerRank > 0 ? "+" : ""}
                              {m.costPerRank}
                            </span>
                          </div>
                        </button>
                      </Tip>
                    ))}
                  </div>
                </div>
              )}

              {normal.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter px-1 pt-1">
                    Modificadores Comuns
                  </p>
                  <div className="space-y-1">
                    {normal.map((m) => (
                      <Tip
                        key={m.id}
                        content={<div className="max-w-xs text-[10px]">{m.description}</div>}
                        side="right"
                      >
                        <button
                          onClick={() => {
                            onAddModifier(m, effectId);
                            setSearch("");
                          }}
                          className="w-full text-left p-1.5 rounded bg-muted/20 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium group-hover:text-purple-300 cursor-help underline decoration-dotted underline-offset-2">
                              {m.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono ${activeTab === "extra" ? "text-green-400" : "text-red-400"}`}
                            >
                              {m.costPerRank > 0 ? "+" : ""}
                              {m.costPerRank}
                            </span>
                          </div>
                        </button>
                      </Tip>
                    ))}
                  </div>
                </div>
              )}

              {specific.length === 0 && normal.length === 0 && (
                <div className="text-center py-4 text-[10px] text-muted-foreground">
                  Nenhum modificador encontrado
                </div>
              )}
            </div>
          </div>
        )}

        {/* List of active modifiers */}
        <div className="space-y-1.5">
          {effectModifiers.map((inst) => {
            const isExtra = inst.modifier.type === "extra";
            return (
              <div
                key={inst.id}
                className={`flex items-center justify-between gap-2 p-1.5 rounded border ${
                    isExtra ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-1 h-3 rounded-full ${isExtra ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <Tip
                    content={
                      <div className="max-w-xs text-[10px]">
                        {inst.modifier.description}
                      </div>
                    }
                  >
                    <span className="text-[11px] font-medium truncate cursor-help hover:text-purple-300 underline decoration-dotted underline-offset-2">
                      {inst.modifier.name}
                    </span>
                  </Tip>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold ${isExtra ? 'text-green-400' : 'text-red-400'}`}>
                    {inst.modifier.costPerRank > 0 ? "+" : ""}{inst.modifier.costPerRank}
                  </span>
                  <button
                    onClick={() => onRemoveModifier(inst.id)}
                    className="p-1 hover:bg-red-500/20 rounded text-red-400/50 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
          {effectModifiers.length === 0 && !isAdding && (
            <p className="text-[10px] text-muted-foreground italic text-center py-2 px-4 bg-muted/5 rounded border border-dashed border-border/20">
              Nenhum modificador específico
            </p>
          )}
        </div>
      </div>
    );
  },
);

EffectModifierManager.displayName = "EffectModifierManager";
