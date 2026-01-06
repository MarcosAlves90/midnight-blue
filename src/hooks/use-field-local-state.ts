import { useCallback, useEffect, useRef, useState } from "react";

export interface UseFieldLocalStateOptions {
  debounceMs?: number;
  /** Optional semantic field name for dirty tracking */
  fieldName?: string;
  /** Callback to notify that the local field became dirty */
  onDirty?: (fieldName?: string) => void;
}

/**
 * A robust hook for local input state that manages synchronization with an external value.
 * Features:
 * - Optimistic local state with debounced commits.
 * - Prevents overwrite loops by tracking 'clean' vs 'dirty' status locally.
 * - Supports manual flushing and blurring.
 */
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
  const isDirtyRef = useRef(false);
  const lastCommittedValueRef = useRef(String(externalValue ?? ""));

  // Sincroniza com valor externo apenas se NÃO estivermos editando localmente
  // ou se o valor externo mudar drasticamente (ex: troca de personagem)
  useEffect(() => {
    const ext = String(externalValue ?? "");
    if (!isDirtyRef.current || lastCommittedValueRef.current !== ext) {
      setValue(ext);
      lastCommittedValueRef.current = ext;
    }
  }, [externalValue]);

  const commit = useCallback((v: string) => {
    if (v === lastCommittedValueRef.current) return;
    
    lastCommittedValueRef.current = v;
    onCommit(v);
    isDirtyRef.current = false; // Marcar como limpo após commit inicial (o servidor confirmará depois)
  }, [onCommit]);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    commit(value);
  }, [commit, value]);

  const scheduleCommit = useCallback((v: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (debounceMs <= 0) {
      commit(v);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = undefined;
      commit(v);
    }, debounceMs) as unknown as number;
  }, [debounceMs, commit]);

  const handleChange = useCallback((payload: string | React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = typeof payload === "string" ? payload : payload.target.value ?? "";
    
    setValue(newVal);
    isDirtyRef.current = true;

    // Notify dirty state once per session
    try {
      if (fieldName && onDirty) onDirty(fieldName);
    } catch {
      // ignore
    }

    scheduleCommit(newVal);
  }, [scheduleCommit, fieldName, onDirty]);

  const handleBlur = useCallback(() => {
    flush();
  }, [flush]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { value, setValue, handleChange, handleBlur, flush };
}
