"use client";

import { memo, useState, useMemo } from "react";
import { Effect, EffectCategory } from "./types";
import { EFFECTS } from "@/lib/powers";
import { Search, X, Plus } from "lucide-react";

interface EffectSelectorProps {
  onSelect: (effect: Effect) => void;
  onClose: () => void;
  excludeIds?: string[];
}

export const EffectSelector = memo(
  ({ onSelect, onClose, excludeIds = [] }: EffectSelectorProps) => {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<
      EffectCategory | "todos"
    >("todos");

    const filtered = useMemo(() => {
      return EFFECTS.filter((e) => {
        if (excludeIds.includes(e.id)) return false;
        const matchesSearch =
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          selectedCategory === "todos" || e.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
    }, [search, selectedCategory, excludeIds]);

    const categories: { id: EffectCategory | "todos"; label: string }[] = [
      { id: "todos", label: "Todos" },
      { id: "ataque", label: "Ataque" },
      { id: "controle", label: "Controle" },
      { id: "defesa", label: "Defesa" },
      { id: "movimento", label: "Movimento" },
      { id: "sensorial", label: "Sensorial" },
      { id: "geral", label: "Geral" },
    ];

    return (
      <div className="flex flex-col h-full bg-background border border-purple-500/20 rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400">
              Selecionar Efeito
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Escolha um efeito base para adicionar ao seu poder
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${
                  selectedCategory === cat.id
                    ? "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/20"
                    : "bg-muted/50 text-muted-foreground border-transparent hover:border-purple-500/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-muted/30 border border-border/50 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {filtered.map((effect) => (
              <button
                key={effect.id}
                onClick={() => onSelect(effect)}
                className="w-full p-3 text-left bg-muted/20 hover:bg-purple-500/5 border border-border/30 hover:border-purple-500/30 rounded-lg group transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground group-hover:text-purple-400 transition-colors">
                        {effect.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase font-bold">
                        {effect.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {effect.description}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="text-[10px] font-mono font-bold text-purple-400 whitespace-nowrap">
                      {effect.baseCost} PP/Grad
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-purple-400 font-bold uppercase tracking-tighter">
                        Adicionar
                      </span>
                      <Plus className="h-3 w-3 text-purple-400" />
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="p-4 rounded-full bg-muted/20">
                  <Search className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nenhum efeito encontrado
                  </p>
                  <p className="text-xs text-muted-foreground/50">
                    Tente ajustar sua busca ou categoria
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

EffectSelector.displayName = "EffectSelector";
