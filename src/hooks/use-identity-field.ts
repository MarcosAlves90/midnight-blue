import { useEffect, useState, useCallback } from "react";
import { useIdentityActions } from "@/contexts/IdentityContext";

// Hook to subscribe to a single identity field, avoiding re-renders when unrelated fields change.
export function useIdentityField<K extends keyof import("@/contexts/IdentityContext").IdentityData>(field: K) {
  const actions = useIdentityActions();

  // read initial value directly from actions.getField (which reads current ref)
  const getCurrent = useCallback(() => actions.getField(field), [actions, field]);

  const [value, setValue] = useState(() => getCurrent());

  useEffect(() => {
    // sync once in case initial value changed before mount
    setValue(getCurrent());
    // Subscribe to field updates
    const unsub = actions.subscribeToField(String(field), () => {
      setValue(getCurrent());
    });
    return unsub;
  }, [actions, field, getCurrent]);

  return value;
}
