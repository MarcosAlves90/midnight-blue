"use client";

import { memo, useMemo } from "react";
// import { AttributeCardProps } from "./types" // Removido para evitar conflito
import { useEditableValue } from "./use-editable-value";
import { getColorClasses } from "../../../../lib/colors";
import { DiceIcon } from "../../../ui/icons/dice-icon";
import { rollDice } from "../../../../lib/dice-system";
import { Tip } from "@/components/ui/tip";
import { useAttributesContext } from "@/contexts/AttributesContext";

export interface AttributeFieldConfig {
  key: string;
  label: string;
  type: "number" | "text";
  editable?: boolean;
  placeholder?: string;
  className?: string;
}

export interface AttributeCardProps {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  value: number;
  bonus?: number;
  type: "attribute";
  description?: string;
  onValueChange?: (value: number) => void;
  onBonusChange?: (bonus: number) => void;
  disabled?: boolean;
  editable?: boolean;
  fields?: AttributeFieldConfig[];
  inputLimits?: { MIN_VALUE?: number; MAX_VALUE?: number };
}

export const AttributeCard = memo(function AttributeCard({
  name,
  abbreviation,
  color,
  value = 0,
  bonus = 0,
  type,
  description,
  onValueChange,
  onBonusChange,
  disabled = false,
  editable = true,
  fields,
  inputLimits,
}: AttributeCardProps) {
  const { markFieldDirty } = useAttributesContext();

  const baseValueState = useEditableValue(
    value,
    onValueChange,
    disabled || !editable,
    inputLimits,
    () => markFieldDirty("attributes")
  );
  const bonusValueState = useEditableValue(
    bonus ?? 0,
    onBonusChange,
    disabled || !editable,
    inputLimits,
    () => markFieldDirty("attributes")
  );

  const colorClasses = useMemo(() => getColorClasses(color), [color]);

  const total = useMemo(
    () =>
      type === "attribute"
        ? baseValueState.value + bonusValueState.value
        : baseValueState.value,
    [baseValueState.value, bonusValueState.value, type],
  );

  const handleRollDice = () => {
    if (type !== "attribute") return;
    // Rola d20 + modificador da habilidade
    rollDice({
      count: 1,
      faces: 20,
      modifiers: [baseValueState.value],
      notify: true,
      color,
    });
  };

  // Renderização dinâmica dos campos, se fornecidos
  const renderFields = () => {
    if (!fields) return null;
    return fields.map((field: AttributeFieldConfig) => {
      if (field.type === "number") {
        const valueState =
          field.key === "bonus" ? bonusValueState : baseValueState;
        return (
          <input
            key={field.key}
            id={field.key}
            name={field.key}
            value={valueState.inputValue}
            onChange={(e) => valueState.handleChange(e.target.value)}
            onBlur={valueState.handleBlur}
            onKeyDown={valueState.handleKeyDown}
            placeholder={field.placeholder || valueState.value.toString()}
            aria-label={field.label}
            disabled={disabled || !editable || field.editable === false}
            className={
              field.className ||
              "w-full text-center text-sm font-medium px-1 py-0.5 bg-primary/10 rounded transition-colors duration-200 focus:bg-primary/15 border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            }
          />
        );
      }
      // Outros tipos podem ser adicionados aqui
      return null;
    });
  };

  return (
    <div
      className={`bg-muted/50 p-2 border-l-2 ${colorClasses.border} ${disabled ? "opacity-50 cursor-not-allowed" : ""} relative flex items-center justify-between gap-2`}
    >
      <div className="flex items-center gap-2">
        <div className="flex flex-col min-w-[3rem]">
          {description ? (
            <Tip
              content={<div className="max-w-xs text-xs">{description}</div>}
              side="top"
              align="start"
            >
              <h3 className="text-sm font-bold leading-none cursor-help decoration-dotted underline underline-offset-2 w-fit">
                {name}
              </h3>
            </Tip>
          ) : (
            <h3 className="text-sm font-bold leading-none">{name}</h3>
          )}
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
            {abbreviation}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xl font-bold min-w-[1.5rem] text-center">
          {total}
        </div>

        {/* Renderização dinâmica dos campos, se fornecidos */}
        {fields ? (
          <div>{renderFields()}</div>
        ) : (
          <div className="flex flex-col gap-1">
            <input              id={`${abbreviation}-base`}
              name={`${abbreviation}-base`}              value={baseValueState.inputValue}
              onChange={(e) => baseValueState.handleChange(e.target.value)}
              onBlur={baseValueState.handleBlur}
              onKeyDown={baseValueState.handleKeyDown}
              placeholder={baseValueState.value.toString()}
              aria-label={`${name} valor base`}
              disabled={disabled || !editable}
              className="w-8 text-center text-[10px] font-medium h-4 bg-primary/10 rounded transition-colors duration-200 focus:bg-primary/15 border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed p-0"
            />
            {type === "attribute" && (
              <input
                id={`${abbreviation}-bonus`}
                name={`${abbreviation}-bonus`}
                value={bonusValueState.inputValue}
                onChange={(e) => bonusValueState.handleChange(e.target.value)}
                onBlur={bonusValueState.handleBlur}
                onKeyDown={bonusValueState.handleKeyDown}
                placeholder={bonusValueState.value.toString()}
                aria-label={`${name} valor bônus`}
                disabled={disabled || !editable}
                className={`w-8 text-center text-[10px] font-medium h-4 ${colorClasses.bg} rounded transition-colors duration-200 ${colorClasses.focusBg} border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed p-0`}
              />
            )}
          </div>
        )}

        {/* Botão de rolagem de dados só para atributos */}
        {type === "attribute" && !disabled && (
          <button
            onClick={handleRollDice}
            className="cursor-pointer p-1.5 hover:bg-muted/80 rounded transition-colors"
            disabled={disabled}
            aria-label={`Rolar dado para ${name}`}
          >
            <DiceIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
    </div>
  );
});

export default AttributeCard;
