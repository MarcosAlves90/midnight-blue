import { useState, useCallback, useEffect } from "react";
import { getInputLimits } from "./constants";
import type { EditableValueHook } from "./types";

export function useEditableValue(
  initialValue: number,
  onChange?: (value: number) => void,
  disabled = false,
  customLimits?: { MIN_VALUE?: number; MAX_VALUE?: number },
): EditableValueHook {
  const [value, setValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState(initialValue.toString());
  const limits = getInputLimits(customLimits);

  useEffect(() => {
    setValue(initialValue);
    setInputValue(initialValue.toString());
  }, [initialValue]);

  const validateAndSetValue = useCallback(
    (inputVal: string) => {
      if (inputVal === "") {
        setInputValue(value.toString());
        return;
      }
      const newValue = parseInt(inputVal, 10);
      if (!isNaN(newValue)) {
        const clampedValue = Math.max(
          limits.MIN_VALUE,
          Math.min(limits.MAX_VALUE, newValue),
        );
        setValue(clampedValue);
        setInputValue(clampedValue.toString());
        onChange?.(clampedValue);
      }
    },
    [value, onChange, limits],
  );

  const handleChange = useCallback(
    (inputVal: string) => {
      if (disabled) return;
      if (
        inputVal === "" ||
        (/^\d+$/.test(inputVal) && parseInt(inputVal, 10) <= limits.MAX_VALUE)
      ) {
        setInputValue(inputVal);
      }
    },
    [disabled, limits],
  );

  const handleBlur = useCallback(() => {
    if (disabled) return;
    validateAndSetValue(inputValue);
  }, [inputValue, disabled, validateAndSetValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.key === "Enter") {
        validateAndSetValue(inputValue);
      } else if (e.key === "Escape") {
        setInputValue(value.toString());
      }
    },
    [inputValue, value, disabled, validateAndSetValue],
  );

  return {
    value,
    inputValue,
    handleChange,
    handleBlur,
    handleKeyDown,
  };
}
