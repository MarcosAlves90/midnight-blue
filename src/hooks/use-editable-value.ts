import { useState, useCallback, useEffect, useRef } from "react";
import { getInputLimits } from "@/components/pages/status/attributes-grid/constants";
import type { EditableValueHook } from "@/components/pages/status/attributes-grid/types";

export function useEditableValue(
  initialValue: number,
  onChange?: (value: number) => void,
  disabled = false,
  customLimits?: { MIN_VALUE?: number; MAX_VALUE?: number },
  onDirty?: () => void,
  debounceMs = 500,
): EditableValueHook {
  const [value, setValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState(initialValue.toString());
  const limits = getInputLimits(customLimits);

  const isDirtyRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEmittedValueRef = useRef(initialValue);

  // Sincroniza com valor externoapenas se não houver edição local ativa
  useEffect(() => {
    if (!isDirtyRef.current || initialValue !== lastEmittedValueRef.current) {
      setValue(initialValue);
      setInputValue(initialValue.toString());
      lastEmittedValueRef.current = initialValue;
    }
  }, [initialValue]);

  const validateAndEmit = useCallback(
    (inputVal: string, isForce = false) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (inputVal === "") {
        if (isForce) {
          setInputValue(value.toString());
          isDirtyRef.current = false;
        }
        return;
      }

      const newValue = parseInt(inputVal, 10);
      if (!isNaN(newValue)) {
        const clampedValue = Math.max(
          limits.MIN_VALUE,
          Math.min(limits.MAX_VALUE, newValue),
        );

        setValue(clampedValue);
        setInputValue(inputVal); // Mantém o que o usuário digitou (ex: "05") até o blur

        if (clampedValue !== lastEmittedValueRef.current || isForce) {
          lastEmittedValueRef.current = clampedValue;
          onChange?.(clampedValue);
        }

        if (isForce) {
          setInputValue(clampedValue.toString());
          isDirtyRef.current = false;
        }
      }
    },
    [value, onChange, limits],
  );

  const handleChange = useCallback(
    (inputVal: string) => {
      if (disabled) return;

      // Permitir apenas números ou vazio
      if (inputVal === "" || /^\d+$/.test(inputVal)) {
        setInputValue(inputVal);
        isDirtyRef.current = true;
        onDirty?.();

        // Debounce para salvar automaticamente enquanto digita
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          validateAndEmit(inputVal);
        }, debounceMs);
      }
    },
    [disabled, onDirty, validateAndEmit, debounceMs],
  );

  const handleBlur = useCallback(() => {
    if (disabled) return;
    validateAndEmit(inputValue, true);
  }, [inputValue, disabled, validateAndEmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.key === "Enter") {
        validateAndEmit(inputValue, true);
        (e.target as HTMLInputElement).blur();
      } else if (e.key === "Escape") {
        setInputValue(value.toString());
        isDirtyRef.current = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        (e.target as HTMLInputElement).blur();
      }
    },
    [inputValue, value, disabled, validateAndEmit],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    value,
    inputValue,
    handleChange,
    handleBlur,
    handleKeyDown,
  };
}
