"use client"

import { memo, useMemo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { AttributeCardProps } from "./types"
import { useEditableValue } from "./use-editable-value"
import { getColorClasses } from "./utils"
import { DiceIcon } from "./dice-icon"

export const AttributeCard = memo(function AttributeCard({
    id,
    name,
    abbreviation,
    color,
    value = 0,
    bonus = 0,
    onValueChange,
    onBonusChange,
    disabled = false,
    editable = true
}: AttributeCardProps) {
    const baseValueState = useEditableValue(value, onValueChange, disabled || !editable)
    const bonusValueState = useEditableValue(bonus, onBonusChange, disabled || !editable)
    
    const colorClasses = useMemo(() => getColorClasses(color), [color])
    
    const total = useMemo(() => 
        baseValueState.value + bonusValueState.value, 
        [baseValueState.value, bonusValueState.value]
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
        // TODO: Implementar sistema de rolagem
        console.log(`Rolling dice for ${name} with total: ${total}`)
    }

    return (
        <div 
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`bg-muted/50 rounded p-2 space-y-2 border-t-4 ${colorClasses.border} ${
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
            
            {!disabled && (
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

            <div className="grid grid-cols-2 gap-2">
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
            </div>
        </div>
    )
})

export default AttributeCard
