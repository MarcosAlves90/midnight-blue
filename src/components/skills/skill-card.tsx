"use client"

import React, { useMemo } from "react"
import { Input } from "@/components/ui/input"
import { getColorClasses } from "@/lib/colors"
import { useAttributesContext } from "@/contexts/AttributesContext"
import { rollDice } from "@/lib/dice-system"
import { DiceIcon } from "@/components/dice-icon"
import { useEditableValue } from "../attributes-grid/use-editable-value"
import type { Skill } from "./types"

interface SkillCardProps extends Skill {
    value?: number
    // onChange reports which field changed: 'value' or 'others' and its new numeric value
    onChange?: (id: string, field: 'value' | 'others', value: number) => void
    disabled?: boolean
}

export function SkillCard({ id, name, attribute, abbreviation, value = 0, others = 0, onChange, disabled = false }: SkillCardProps) {
    const valueState = useEditableValue(value, (v) => onChange?.(id, 'value', v), disabled)
    const othersState = useEditableValue(others ?? 0, (v) => onChange?.(id, 'others', v), disabled)

    const { attributes } = useAttributesContext()

    // Try to find the attribute object and use its color if available
    const attributeColor = attributes.find(a => a.id === attribute)?.color ?? 'gray'
    const colorClasses = useMemo(() => getColorClasses(attributeColor), [attributeColor])

    // Role de perícia: d20 + graduações + modificador de habilidade + outros
    const handleRollSkill = () => {
        const attributeObj = attributes.find(a => a.id === attribute)
        const attrValue = attributeObj?.value ?? 0

        const modifiers = [attrValue, valueState.value]
        if (othersState.value !== 0) modifiers.push(othersState.value)

        rollDice({ count: 1, faces: 20, modifiers, notify: true, color: attributeColor })
    }

    return (
        <tr className={`bg-muted/50 border-t-2 ${colorClasses.border}`}>
            <td className="px-4 py-2 align-top">
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <button
                        onClick={handleRollSkill}
                        aria-label={`Rolar perícia ${name}`}
                        className="p-1 hover:bg-muted/80 rounded transition-colors cursor-pointer"
                    >
                        <DiceIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    <div className="text-sm font-medium">{name}</div>
                    <span className="truncate">{abbreviation ?? id}</span>
                </div>
            </td>

            <td className="px-4 py-2 align-top text-xs text-muted-foreground">{attribute}</td>

            <td className="px-2 py-1 align-top text-center">
                <Input
                    value={valueState.inputValue}
                    onChange={(e) => valueState.handleChange(e.target.value)}
                    onBlur={valueState.handleBlur}
                    onKeyDown={valueState.handleKeyDown}
                    aria-label={`${name} valor`}
                    disabled={disabled}
                    className="w-16 mx-auto text-center text-sm font-medium px-1 py-0.5 bg-primary/10 rounded transition-colors duration-200 focus:bg-primary/15 border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </td>

            <td className="px-2 py-1 align-top text-center">
                <Input
                    value={othersState.inputValue}
                    onChange={(e) => othersState.handleChange(e.target.value)}
                    onBlur={othersState.handleBlur}
                    onKeyDown={othersState.handleKeyDown}
                    aria-label={`${name} outros`}
                    disabled={disabled}
                    className={`w-16 mx-auto text-center text-sm font-medium px-1 py-0.5 ${colorClasses.bg} rounded transition-colors duration-200 ${colorClasses.focusBg} border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                />
            </td>
        </tr>
    )
}

export default SkillCard
