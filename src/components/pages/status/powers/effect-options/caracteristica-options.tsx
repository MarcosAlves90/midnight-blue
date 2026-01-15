"use client";

import { FC, useState, useMemo, useCallback } from "react";
import { EffectOptions } from "../types";
import { CARACTERISTICA_CATEGORIES } from "@/lib/powers/effect-constants";
import { EffectOptionsTemplate, SubOption } from "./effect-options-template";

interface CaracteristicaOptionsProps {
  options: EffectOptions;
  rank: number;
  onChange: (opts: EffectOptions) => void;
}

export const CaracteristicaOptions: FC<CaracteristicaOptionsProps> = ({
  options,
  rank,
  onChange,
}) => {
  const [activeCategory, setActiveCategory] = useState(() => {
    // Tenta encontrar a categoria atual baseada nas seleções ou no sub antigo
    const found = CARACTERISTICA_CATEGORIES.find((cat) =>
      cat.items.some((item) => {
        const selections = (options.selections as Record<string, number>) || {};
        return item.id in selections || item.id === options.sub;
      }),
    );
    return found?.id || CARACTERISTICA_CATEGORIES[0].id;
  });

  const currentCategory = useMemo(
    () => CARACTERISTICA_CATEGORIES.find((c) => c.id === activeCategory),
    [activeCategory],
  );

  const handleCategoryChange = useCallback(
    (catId: string) => {
      const nextCat = CARACTERISTICA_CATEGORIES.find((c) => c.id === catId);
      if (nextCat) {
        setActiveCategory(catId);
        // Ao mudar categoria, resetamos as seleções para manter o ppCost coerente
        onChange({
          ...options,
          sub: undefined,
          ppCost: nextCat.cost,
          selections: {},
        });
      }
    },
    [options, onChange],
  );

  const subOptions: SubOption[] = useMemo(() => {
    return (currentCategory?.items || []).map((item) => ({
      id: item.id,
      label: item.label,
      tip: `Aumento de ${currentCategory?.label}: ${item.label}`,
      maxRank: 20,
    }));
  }, [currentCategory]);

  const config = useMemo(
    () => ({
      title: `Distribuição: ${currentCategory?.label || ""}`,
      unitLabels: {
        singular: "Bônus",
        plural: "Bônus",
      },
      color: "amber",
      completeLabel: "Ajustado",
    }),
    [currentCategory],
  );

  return (
    <div className="space-y-4">
      {/* Seletor de Categoria Otimizado */}
      <div className="flex flex-wrap gap-1 p-1 bg-background/20 rounded-lg border border-border/40">
        {CARACTERISTICA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`flex-1 px-2 py-1.5 text-[9px] font-black uppercase tracking-tighter rounded transition-all ${
              activeCategory === cat.id
                ? "bg-amber-500 text-white shadow-sm"
                : "text-muted-foreground/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <EffectOptionsTemplate
        options={options}
        rank={rank}
        onChange={onChange}
        subOptions={subOptions}
        config={config}
      />
    </div>
  );
};

