"use client";

import { FC, useState, useEffect, useCallback, useMemo } from "react";
import { EffectOptions } from "../types";
import { CARACTERISTICA_CATEGORIES } from "@/lib/powers/effect-constants";
import { useAttributesContext } from "@/contexts/AttributesContext";
import { useSkillsContext } from "@/contexts/SkillsContext";
import { useStatusContext } from "@/contexts/StatusContext";
import { OptionSelector } from "./shared-components";

// TODO: corrigir limites de caracteristicas

interface CaracteristicaOptionsProps {
  options: EffectOptions;
  rank: number;
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

  const currentCategory = useMemo(
    () => CARACTERISTICA_CATEGORIES.find((c) => c.id === activeCategory),
    [activeCategory],
  );
  const costPerBonus = currentCategory?.cost || 1;

  // Sincronizar custo apenas quando a categoria MUDA
  useEffect(() => {
    if (currentCategory) {
      const initialStep = currentCategory.cost >= 1 ? currentCategory.cost : 1;
      onChange({ ...options, ppCost: initialStep });
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

  // Cálculo do máximo de bônus permitido (NP * 2)
  const maxBonus = useMemo(() => {
    if (!options.sub) return 20;
    const maxTotal = powerLevel * 2;
    return Math.max(0, maxTotal - naturalValue);
  }, [options.sub, powerLevel, naturalValue]);

  // O passo do slider depende do custo
  // Se custo > 1 (ex: 2), o passo é o próprio custo para garantir bônus inteiros
  // Se custo < 1 (ex: 0.5), o passo é 1 PP (que dá 2 bônus)
  const step = costPerBonus >= 1 ? costPerBonus : 1;

  // Cálculo do máximo de PP baseado no bônus máximo e no passo
  const maxPP = useMemo(() => {
    const rawMaxPP = maxBonus * costPerBonus;
    if (costPerBonus >= 1) {
      // Se o custo é >= 1, o maxPP deve ser múltiplo do custo para não exceder o bônus
      return Math.max(step, Math.floor(rawMaxPP / step) * step);
    }
    // Se o custo é < 1, 1 PP dá múltiplos bônus.
    return Math.max(step, Math.floor(rawMaxPP));
  }, [maxBonus, costPerBonus, step]);

  const ppCost = options.ppCost ?? step;

  // Garantir que o custo atual não exceda o máximo permitido e respeite o step
  useEffect(() => {
    if (ppCost > maxPP) {
      onChange({ ...options, ppCost: maxPP });
    } else if (ppCost % step !== 0) {
      onChange({ ...options, ppCost: Math.floor(ppCost / step) * step });
    }
  }, [ppCost, maxPP, step, onChange, options]);

  // O bônus é calculado a partir do custo de PP
  const bonus = Math.floor(ppCost / costPerBonus);
  const finalValue = naturalValue + bonus;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {CARACTERISTICA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              if (activeCategory !== cat.id) {
                setActiveCategory(cat.id);
                const initialStep = cat.cost >= 1 ? cat.cost : 1;
                onChange({ ...options, sub: "", ppCost: initialStep });
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
          id="characteristic-select"
          name="characteristic-select"
          value={options.sub || ""}
          onChange={(e) => {
            onChange({
              ...options,
              sub: e.target.value,
              ppCost: step,
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
            <div className="flex gap-2">
              <span>
                Bônus:{" "}
                <span className="text-purple-400 font-bold">+{bonus} grad</span>
              </span>
              <span className="text-muted-foreground/50">
                ({costPerBonus} PP/grad)
              </span>
            </div>
            <span>
              Total:{" "}
              <span className="text-green-400 font-bold">+{finalValue}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
