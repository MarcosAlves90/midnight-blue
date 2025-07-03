import { useState, useCallback, useEffect } from "react";

export function useEditableValue(
    initialValue: number, 
    onChange?: (value: number) => void,
    disabled = false
) {
    const [value, setValue] = useState(initialValue);
    const [inputValue, setInputValue] = useState(initialValue.toString());

    useEffect(() => {
        setValue(initialValue);
        setInputValue(initialValue.toString());
    }, [initialValue]);

    const handleChange = useCallback((inputVal: string) => {
        if (disabled) return;
        if (inputVal === '' || (/^\d+$/.test(inputVal) && parseInt(inputVal, 10) <= 9999)) {
            setInputValue(inputVal);
        }
    }, [disabled]);

    const handleBlur = useCallback(() => {
        if (disabled) return;
        if (inputValue === '') {
            setInputValue(value.toString());
        } else {
            const newValue = parseInt(inputValue, 10);
            if (!isNaN(newValue)) {
                const clampedValue = Math.max(0, Math.min(9999, newValue));
                setValue(clampedValue);
                setInputValue(clampedValue.toString());
                onChange?.(clampedValue);
            }
        }
    }, [inputValue, value, onChange, disabled]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;
        if (e.key === 'Enter') {
            if (inputValue === '') {
                setInputValue(value.toString());
            } else {
                const newValue = parseInt(inputValue, 10);
                if (!isNaN(newValue)) {
                    const clampedValue = Math.max(0, Math.min(9999, newValue));
                    setValue(clampedValue);
                    setInputValue(clampedValue.toString());
                    onChange?.(clampedValue);
                }
            }
        } else if (e.key === 'Escape') {
            setInputValue(value.toString());
        }
    }, [inputValue, value, onChange, disabled]);

    return {
        value,
        inputValue,
        handleChange,
        handleBlur,
        handleKeyDown
    };
}
