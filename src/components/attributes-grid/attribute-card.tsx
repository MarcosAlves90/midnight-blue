"use client"

import { memo, useMemo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
// import { AttributeCardProps } from "./types" // Removido para evitar conflito
import { useEditableValue } from "./use-editable-value"
import { getColorClasses } from "../../lib/colors"
import { DiceIcon } from "../dice-icon"
import { rollDice } from "../../lib/dice-system"

export interface AttributeFieldConfig {
    key: string;
    label: string;
    type: 'number' | 'text';
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
    onValueChange?: (value: number) => void;
    onBonusChange?: (bonus: number) => void;
    disabled?: boolean;
    editable?: boolean;
    fields?: AttributeFieldConfig[];
    inputLimits?: { MIN_VALUE?: number; MAX_VALUE?: number };
}

export const AttributeCard = memo(function AttributeCard({
    id,
    name,
    abbreviation,
    color,
    value = 0,
    bonus = 0,
    type,
    onValueChange,
    onBonusChange,
    disabled = false,
    editable = true,
    fields,
    inputLimits,
}: AttributeCardProps) {
    const baseValueState = useEditableValue(value, onValueChange, disabled || !editable, inputLimits)
    const bonusValueState = useEditableValue(bonus ?? 0, onBonusChange, disabled || !editable, inputLimits)
    
    const colorClasses = useMemo(() => getColorClasses(color), [color])
    
    const total = useMemo(() =>
        type === "attribute"
            ? baseValueState.value + bonusValueState.value
            : baseValueState.value,
        [baseValueState.value, bonusValueState.value, type]
    )

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleRollDice = () => {
        if (type !== "attribute") return;
        // Rola d20 + modificador da habilidade
        rollDice({ count: 1, faces: 20, modifiers: [baseValueState.value], notify: true, color });
    }

    // Renderização dinâmica dos campos, se fornecidos
    const renderFields = () => {
        if (!fields) return null;
        return fields.map((field: AttributeFieldConfig) => {
            if (field.type === 'number') {
                const valueState = field.key === 'bonus' ? bonusValueState : baseValueState;
                return (
                    <input
                        key={field.key}
                        value={valueState.inputValue}
                        onChange={(e) => valueState.handleChange(e.target.value)}
                        onBlur={valueState.handleBlur}
                        onKeyDown={valueState.handleKeyDown}
                        placeholder={field.placeholder || valueState.value.toString()}
                        aria-label={field.label}
                        disabled={disabled || !editable || field.editable === false}
                        className={field.className || 'w-full text-center text-sm font-medium px-1 py-0.5 bg-primary/10 rounded transition-colors duration-200 focus:bg-primary/15 border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed'}
                    />
                )
            }
            // Outros tipos podem ser adicionados aqui
            return null;
        })
    }

    return (
        <div 
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`bg-muted/50 rounded-b p-2 space-y-2 border-t-2 ${colorClasses.border} ${
                isDragging ? "opacity-50" : ""
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""} relative`}
        >
            {editable && !disabled && (
                <div 
                    {...listeners}
                    className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1 hover:bg-muted/80 rounded transition-colors"
                >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
            )}
            
            {/* Botão de rolagem de dados só para atributos */}
            {type === "attribute" && !disabled && (
                <button 
                    onClick={handleRollDice}
                    className="absolute top-2 cursor-pointer right-2 p-1 hover:bg-muted/80 rounded transition-colors"
                    disabled={disabled}
                    aria-label={`Rolar dado para ${name}`}
                >
                    <DiceIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
            )}

            <div className="text-center">
                <h3 className="text-sm font-medium text-center">{name}</h3>
                <p className="text-xs text-muted-foreground">{abbreviation}</p>
            </div>

            <div className="text-center">
                <div className="text-2xl font-bold">{total}</div>
            </div>
            {/* Renderização dinâmica dos campos, se fornecidos */}
            {fields ? (
                <div>{renderFields()}</div>
            ) : (
                <div className="flex flex-row gap-2 w-full">
                    <input
                        value={baseValueState.inputValue}
                        onChange={(e) => baseValueState.handleChange(e.target.value)}
                        onBlur={baseValueState.handleBlur}
                        onKeyDown={baseValueState.handleKeyDown}
                        placeholder={baseValueState.value.toString()}
                        aria-label={`${name} valor base`}
                        disabled={disabled || !editable}
                        className="w-full text-center text-sm font-medium px-1 py-0.5 bg-primary/10 rounded transition-colors duration-200 focus:bg-primary/15 border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {type === "attribute" && (
                        <input
                            value={bonusValueState.inputValue}
                            onChange={(e) => bonusValueState.handleChange(e.target.value)}
                            onBlur={bonusValueState.handleBlur}
                            onKeyDown={bonusValueState.handleKeyDown}
                            placeholder={bonusValueState.value.toString()}
                            aria-label={`${name} valor bônus`}
                            disabled={disabled || !editable}
                            className={`w-full text-center text-sm font-medium px-1 py-0.5 ${colorClasses.bg} rounded transition-colors duration-200 ${colorClasses.focusBg} border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                        />
                    )}
                </div>
            )}
        </div>
    )
})

export default AttributeCard
