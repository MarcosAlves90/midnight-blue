"use client"

import { useState, useEffect, useRef } from "react"

interface EditableStatValueProps {
    value: number
    maxValue: number
    onUpdate: (newValue: number) => void
    disabled?: boolean
    className?: string
}

export const EditableStatValue = ({
    value,
    maxValue: _maxValue, // eslint-disable-line @typescript-eslint/no-unused-vars
    onUpdate,
    disabled = false,
    className = ""
}: EditableStatValueProps) => {
    const [inputValue, setInputValue] = useState(value.toString())
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setInputValue(value.toString())
    }, [value])

    const handleSubmit = () => {
        const newValue = parseInt(inputValue, 10)
        
        if (!isNaN(newValue)) {
            // Garantir que o valor não seja negativo e não ultrapasse 9999
            const clampedValue = Math.max(0, Math.min(9999, newValue))
            onUpdate(clampedValue - value) // Enviar a diferença, não o valor absoluto
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (inputValue === '') {
                setInputValue(value.toString())
            } else {
                handleSubmit()
            }
        } else if (e.key === 'Escape') {
            setInputValue(value.toString())
        }
    }

    const handleBlur = () => {
        if (inputValue === '') {
            setInputValue(value.toString())
        } else {
            handleSubmit()
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value
        
        // Permitir apenas números e garantir que não ultrapasse 9999
        if (inputVal === '' || (/^\d+$/.test(inputVal) && parseInt(inputVal, 10) <= 9999)) {
            setInputValue(inputVal)
        }
    }

    return (
        <input
            ref={inputRef}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={`text-center max-w-15 text-sm font-medium px-1 py-0.5 bg-primary/10 rounded transition-colors duration-200 focus:bg-primary/15 border-0 outline-none ${className}`}
            placeholder={value.toString()}
            disabled={disabled}
        />
    )
}
