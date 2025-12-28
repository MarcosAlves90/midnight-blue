import { useCallback, useEffect, useRef, useState } from "react";

export interface UseFieldLocalStateOptions {
  debounceMs?: number;
  /** Optional semantic field name for dirty tracking */
  fieldName?: string;
  /** Callback to notify that the local field became dirty */
  onDirty?: (fieldName?: string) => void;
}

export function useFieldLocalState(
  externalValue: string | undefined,
  onCommit: (value: string) => void,
  options?: UseFieldLocalStateOptions,
) {
  const debounceMs = options?.debounceMs ?? 300;
  const fieldName = options?.fieldName;
  const onDirty = options?.onDirty;
  const [value, setValue] = useState(String(externalValue ?? ""));
  const timeoutRef = useRef<number | undefined>(undefined);

  // Sync when external value changes (e.g., selected different character)
  useEffect(() => {
    setValue(String(externalValue ?? ""));
  }, [externalValue]);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    // commit current value
    onCommit(value);
  }, [onCommit, value]);

  const scheduleCommit = useCallback((v: string) => {
    if (!debounceMs) {
      onCommit(v);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = undefined;
      onCommit(v);
    }, debounceMs) as unknown as number;
  }, [debounceMs, onCommit]);

  const handleChange = useCallback((payload: string | React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = typeof payload === "string" ? payload : payload.target.value ?? "";
    setValue(newVal);
    // notify dirty state if requested
    try {
      if (fieldName && onDirty) onDirty(fieldName);
    } catch {
      // ignore onDirty errors
    }
    scheduleCommit(newVal);
  }, [scheduleCommit, fieldName, onDirty]);

  const handleBlur = useCallback(() => {
    // flush pending and commit the latest local value
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    onCommit(value);
  }, [onCommit, value]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { value, setValue, handleChange, handleBlur, flush };
}
