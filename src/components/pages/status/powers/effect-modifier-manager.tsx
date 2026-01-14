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
        specific: filtered.filter(
          (m) => m.appliesTo && m.appliesTo.includes(effectId),
        ),
        normal: filtered.filter(
          (m) => !m.appliesTo || !m.appliesTo.includes(effectId),
        ),
      };
    }, [activeTab, availableExtras, availableFlaws, search, effectId]);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Modificadores do Efeito
          </h5>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`p-1 transition-colors ${
              isAdding
                ? "bg-blue-500 text-white"
                : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
            }`}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {isAdding && (
          <div className="p-2 bg-background/40 border border-blue-500/20 space-y-2 animate-in fade-in slide-in-from-top-1">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("extra")}
                className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-tighter transition-colors ${
                  activeTab === "extra"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-muted/20 text-muted-foreground border border-transparent"
                }`}
              >
                Extras
              </button>
              <button
                onClick={() => setActiveTab("falha")}
                className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-tighter transition-colors ${
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
                className="w-full pl-7 pr-2 py-1 bg-background/50 border border-border/30 text-xs focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {specific.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[9px] text-blue-400 font-bold uppercase tracking-tighter px-1">
                    Específicos do Efeito
                  </p>
                  <div className="space-y-1">
                    {specific.map((m) => (
                      <Tip
                        key={m.id}
                        content={
                          <div className="max-w-xs text-[10px]">
                            {m.description}
                          </div>
                        }
                        side="right"
                      >
                        <button
                          onClick={() => {
                            onAddModifier(m, effectId);
                            setSearch("");
                          }}
                          className="w-full text-left p-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium group-hover:text-blue-300 cursor-help underline decoration-dotted underline-offset-2">
                              {m.name}
                            </span>
                            <div className="flex flex-col items-end">
                              <span
                                className={`text-[9px] font-mono leading-none ${activeTab === "extra" ? "text-green-400" : "text-red-400"}`}
                              >
                                {m.costPerRank > 0 ? "+" : ""}
                                {m.costPerRank}
                              </span>
                              <span className="text-[7px] font-bold opacity-50 text-white">
                                {m.isFlat ? "PF" : "PP"}
                              </span>
                            </div>
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
                        content={
                          <div className="max-w-xs text-[10px]">
                            {m.description}
                          </div>
                        }
                        side="right"
                      >
                        <button
                          onClick={() => {
                            onAddModifier(m, effectId);
                            setSearch("");
                          }}
                          className="w-full text-left p-1.5 bg-muted/20 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium group-hover:text-blue-300 cursor-help underline decoration-dotted underline-offset-2">
                              {m.name}
                            </span>
                            <div className="flex flex-col items-end">
                              <span
                                className={`text-[9px] font-mono leading-none ${activeTab === "extra" ? "text-green-400" : "text-red-400"}`}
                              >
                                {m.costPerRank > 0 ? "+" : ""}
                                {m.costPerRank}
                              </span>
                              <span className="text-[7px] font-bold opacity-50 text-white">
                                {m.isFlat ? "PF" : "PP"}
                              </span>
                            </div>
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
        <div className="grid grid-cols-1 gap-1.5">
          {effectModifiers.map((inst) => {
            const isExtra = inst.modifier.type === "extra";
            return (
              <div
                key={inst.id}
                className={`flex items-center justify-between gap-3 p-2-lg border transition-all hover:bg-white/[0.02] ${
                  isExtra
                    ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                    : "border-rose-500/20 bg-rose-500/[0.03]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-1 h-4-full shadow-[0_0_8px] ${isExtra ? "bg-emerald-500 shadow-emerald-500/50" : "bg-rose-500 shadow-rose-500/50"}`}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-tight truncate text-zinc-200">
                      {inst.modifier.name}
                    </span>
                    <span className="text-[8px] text-zinc-500 font-medium truncate uppercase">
                      {inst.modifier.isFlat ? "PF (Ponto Fixo)" : "PP (Por Graduação)"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-mono font-black ${isExtra ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {inst.modifier.costPerRank > 0 ? "+" : ""}
                    {inst.modifier.costPerRank}
                  </span>
                  <div className="w-px h-4 bg-white/5" />
                  <button
                    onClick={() => onRemoveModifier(inst.id)}
                    className="p-1 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
          {effectModifiers.length === 0 && !isAdding && (
            <div className="flex flex-col items-center justify-center py-6 px-4 bg-white/[0.02] border border-dashed border-white/5 opacity-40">
              <Plus className="h-4 w-4 mb-2 text-zinc-500" />
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                Ajuste o efeito com modificadores
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

EffectModifierManager.displayName = "EffectModifierManager";
