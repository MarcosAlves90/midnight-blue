"use client";

import { FC, useState, useEffect, useCallback, useMemo } from "react";
import { EffectOptions } from "../types";
import { CARACTERISTICA_CATEGORIES } from "@/lib/powers/effect-constants";
import { useAttributesContext } from "@/contexts/AttributesContext";
import { useSkillsContext } from "@/contexts/SkillsContext";
import { useStatusContext } from "@/contexts/StatusContext";
import { OptionSelector } from "./shared-components";

interface CaracteristicaOptionsProps {
  options: EffectOptions;
  onChange: (opts: EffectOptions) => void;
}

export const CaracteristicaOptions: FC<CaracteristicaOptionsProps> = ({
  options,
  onChange,
}) => {
  const { attributes } = useAttributesContext();
  const { skills } = useSkillsContext();
  const { powerLevel } = useStatusContext();
  
  const [activeCategory, setActiveCategory] = useState(() => {
    const found = CARACTERISTICA_CATEGORIES.find((cat) =>
      cat.items.some((item) => item.id === options.sub),
    );
    return found?.id || CARACTERISTICA_CATEGORIES[0].id;
  });

  // Sincronizar custo apenas quando a categoria MUDA
  useEffect(() => {
    const category = CARACTERISTICA_CATEGORIES.find(
      (c) => c.id === activeCategory,
    );
    if (category) {
      // Conforme solicitado, o custo inicial é 1 PP (que equivale a 1 graduação)
      onChange({ ...options, ppCost: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  // Sincronizar categoria quando o sub muda externamente
  useEffect(() => {
    if (options.sub) {
      const cat = CARACTERISTICA_CATEGORIES.find((c) =>
        c.items.some((i) => i.id === options.sub),
      );
      if (cat && cat.id !== activeCategory) {
        setActiveCategory(cat.id);
      }
    }
  }, [options.sub, activeCategory]);

  const getTraitValue = useCallback(
    (id: string) => {
      if (!id) return 0;
      const attr = attributes.find((a) => a.id === id);
      if (attr) return attr.value;

      const skill = skills.find((s) => s.id === id);
      if (skill) {
        const baseAttr = attributes.find((a) => a.id === skill.attribute);
        return (
          (baseAttr?.value || 0) + (skill.value || 0) + (skill.others || 0)
        );
      }

      const defenseMapping: Record<string, string> = {
        APARAR: "LUT",
        ESQUIVA: "AGI",
        FORTITUDE: "VIG",
        VONTADE: "PRO",
        INICIATIVA: "AGI",
      };
      const mappedAttrId = defenseMapping[id];
      if (mappedAttrId) {
        const baseAttr = attributes.find((a) => a.id === mappedAttrId);
        return baseAttr?.value || 0;
      }
      return 0;
    },
    [attributes, skills],
  );

  const naturalValue = options.sub ? getTraitValue(options.sub) : 0;

  // Cálculo do máximo de PP baseado nas regras de NP: (NP * 2) - Valor Base
  const maxPP = useMemo(() => {
    if (!options.sub) return 10;
    const maxTotal = powerLevel * 2;
    return Math.max(1, maxTotal - naturalValue);
  }, [options.sub, powerLevel, naturalValue]);

  const ppCost = options.ppCost ?? 1;

  // Garantir que o custo atual não exceda o máximo permitido
  useEffect(() => {
    if (ppCost > maxPP) {
      onChange({ ...options, ppCost: maxPP });
    }
  }, [ppCost, maxPP, onChange, options]);
  
  // O bônus é igual ao custo de PP (1 PP = 1 Graduação)
  const bonus = ppCost;
  const finalValue = naturalValue + bonus;

  // O passo é sempre 1, pois 1 PP = 1 Graduação
  const step = 1;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {CARACTERISTICA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              if (activeCategory !== cat.id) {
                setActiveCategory(cat.id);
                onChange({ ...options, sub: "", ppCost: 1 });
              }
            }}
            className={`px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded border transition-all ${
              activeCategory === cat.id
                ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                : "bg-background/20 border-border/30 text-muted-foreground hover:border-purple-400/30"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <select
          value={options.sub || ""}
          onChange={(e) => {
            onChange({
              ...options,
              sub: e.target.value,
              ppCost: 1,
            });
          }}
          className="w-full bg-background/40 border border-border/30 rounded-md px-3 py-2 text-xs text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-purple-500/50"
        >
          <option value="" disabled>
            Selecione a característica...
          </option>
          {CARACTERISTICA_CATEGORIES.find(
            (c) => c.id === activeCategory,
          )?.items.map((item) => {
            const currentVal = getTraitValue(item.id);
            return (
              <option key={item.id} value={item.id} className="bg-card">
                {item.label} (+{currentVal})
              </option>
            );
          })}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {options.sub && (
        <div className="space-y-2 pt-1">
          <OptionSelector
            label="Custo de PP"
            value={ppCost}
            min={step}
            max={maxPP}
            step={step}
            unit=" PP"
            onChange={(val) => onChange({ ...options, ppCost: val })}
            warning={
              finalValue > powerLevel * 2
                ? `Total (+${finalValue}) excede 2x NP (${powerLevel * 2})`
                : undefined
            }
          />

          <div className="flex items-center justify-between px-1 text-[9px] text-muted-foreground uppercase tracking-wider border-t border-border/10 pt-1.5">
            <span>Bônus Atual:</span>
            <span className="text-purple-400 font-bold">+{bonus} Graduações (grad)</span>
            <span className="mx-1">|</span>
            <span>Total:</span>
            <span className="text-green-400 font-bold">+{finalValue}</span>
          </div>
        </div>
      )}
    </div>
  );
};
