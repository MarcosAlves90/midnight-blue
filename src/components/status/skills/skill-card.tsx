"use client";

import React, { useMemo } from "react";
import { FormInput } from "@/components/ui/form-input";
import { Tip } from "@/components/ui/tip";
import { getColorClasses } from "@/lib/colors";
import { useAttributesContext } from "@/contexts/AttributesContext";
import { rollDice } from "@/lib/dice-system";
import { DiceIcon } from "@/components/dice-icon";
import { useEditableValue } from "../attributes-grid/use-editable-value";
import type { Skill } from "./types";

interface SkillCardProps extends Skill {
  value?: number;
  // onChange reports which field changed: 'value' or 'others' and its new numeric value
  onChange?: (id: string, field: "value" | "others", value: number) => void;
  disabled?: boolean;
}

export function SkillCard({
  id,
  name,
  attribute,
  value = 0,
  others = 0,
  description,
  onChange,
  disabled = false,
}: SkillCardProps) {
  const valueState = useEditableValue(
    value,
    (v) => onChange?.(id, "value", v),
    disabled,
  );
  const othersState = useEditableValue(
    others ?? 0,
    (v) => onChange?.(id, "others", v),
    disabled,
  );

  const { attributes } = useAttributesContext();

  // Try to find the attribute object and use its color if available
  const attributeColor =
    attributes.find((a) => a.id === attribute)?.color ?? "gray";
  const colorClasses = useMemo(
    () => getColorClasses(attributeColor),
    [attributeColor],
  );

  // Role de perícia: d20 + graduações + modificador de habilidade + outros
  const handleRollSkill = () => {
    const attributeObj = attributes.find((a) => a.id === attribute);
    const attrValue = attributeObj?.value ?? 0;

    const modifiers = [attrValue, valueState.value];
    if (othersState.value !== 0) modifiers.push(othersState.value);

    rollDice({
      count: 1,
      faces: 20,
      modifiers,
      notify: true,
      color: attributeColor,
    });
  };

  return (
    <tr
      className={`group hover:bg-muted/50 transition-colors border-b border-muted/20 last:border-0`}
    >
      <td
        className={`px-2 py-1 align-middle border-l-2 ${colorClasses.border}`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handleRollSkill}
            aria-label={`Rolar perícia ${name}`}
            className="p-0.5 hover:bg-muted/80 rounded transition-colors cursor-pointer"
          >
            <DiceIcon className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
          </button>
          <div className="flex flex-col items-start">
            {description ? (
              <Tip
                content={<div className="max-w-xs text-xs">{description}</div>}
                side="top"
                align="start"
              >
                <span className="text-xs font-medium leading-none cursor-help decoration-dotted underline underline-offset-2">
                  {name}
                </span>
              </Tip>
            ) : (
              <span className="text-xs font-medium leading-none">{name}</span>
            )}
            <span className="text-[9px] text-muted-foreground sm:hidden mt-0.5 font-mono">
              {attribute}
            </span>
          </div>
        </div>
      </td>

      <td className="hidden sm:table-cell px-2 py-1 align-middle text-[10px] text-muted-foreground font-mono">
        {attribute}
      </td>

      <td className="px-1 py-1 align-middle text-center">
        <FormInput
          value={valueState.inputValue}
          onChange={(e) => valueState.handleChange(e.target.value)}
          onBlur={valueState.handleBlur}
          onKeyDown={valueState.handleKeyDown}
          aria-label={`${name} valor`}
          disabled={disabled}
          className="w-8 h-5 mx-auto text-center text-[10px] font-medium px-0 bg-primary/10 rounded focus:bg-primary/15 border-0 outline-none p-0"
        />
      </td>

      <td className="px-1 py-1 align-middle text-center">
        <FormInput
          value={othersState.inputValue}
          onChange={(e) => othersState.handleChange(e.target.value)}
          onBlur={othersState.handleBlur}
          onKeyDown={othersState.handleKeyDown}
          aria-label={`${name} outros`}
          disabled={disabled}
          className={`w-8 h-5 mx-auto text-center text-[10px] font-medium px-0 ${colorClasses.bg} rounded ${colorClasses.focusBg} border-0 outline-none p-0`}
        />
      </td>
    </tr>
  );
}

export default SkillCard;
