import { useState, useCallback, useEffect } from "react"
import { clampValue, STAT_CONFIG } from "./constants"

export function useEditableStatValue(
    value: number,
    onUpdate: (change: number) => void,
    disabled = false
) {
    const [inputValue, setInputValue] = useState(value.toString())

    useEffect(() => {
        setInputValue(value.toString())
    }, [value])

    const validateAndSubmit = useCallback((inputVal: string) => {
        if (inputVal === '') {
            setInputValue(value.toString())
            return
        }
        
        const newValue = parseInt(inputVal, 10)
        if (!isNaN(newValue)) {
            const clampedValue = clampValue(newValue)
            const change = clampedValue - value
            onUpdate(change)
        }
    }, [value, onUpdate])

    const handleChange = useCallback((inputVal: string) => {
        if (disabled) return
        
        if (inputVal === '' || (/^\d+$/.test(inputVal) && parseInt(inputVal, 10) <= STAT_CONFIG.INPUT_MAX_VALUE)) {
            setInputValue(inputVal)
        }
    }, [disabled])

    const handleBlur = useCallback(() => {
        if (disabled) return
        validateAndSubmit(inputValue)
    }, [inputValue, disabled, validateAndSubmit])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (disabled) return
        
        if (e.key === 'Enter') {
            validateAndSubmit(inputValue)
        } else if (e.key === 'Escape') {
            setInputValue(value.toString())
        }
    }, [inputValue, value, disabled, validateAndSubmit])

    return {
        inputValue,
        handleChange,
        handleBlur,
        handleKeyDown
    }
}
