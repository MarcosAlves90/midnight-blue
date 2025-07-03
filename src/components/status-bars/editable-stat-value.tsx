"use client"

import { memo, useRef } from "react"
import { useEditableStatValue } from "./use-editable-stat-value"
import type { EditableStatValueProps } from "./types"

export const EditableStatValue = memo(function EditableStatValue({
    value,
    onUpdate,
    disabled = false,
    className = ""
}: Omit<EditableStatValueProps, 'maxValue'>) {
    const inputRef = useRef<HTMLInputElement>(null)
    
    const {
        inputValue,
        handleChange,
        handleBlur,
        handleKeyDown
    } = useEditableStatValue(value, onUpdate, disabled)

    return (
        <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`text-center max-w-15 text-sm font-medium px-1 py-0.5 bg-primary/10 rounded transition-colors duration-200 focus:bg-primary/15 border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            placeholder={value.toString()}
            disabled={disabled}
            aria-label={`Editar valor atual: ${value}`}
        />
    )
})
