"use client";
import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useCharacterSheet } from "./CharacterSheetContext";
import type { CharacterDocument } from "@/lib/types/character";

interface DefensesContextType {
  defenses: NonNullable<CharacterDocument["defenses"]>;
  updateDefense: (key: keyof NonNullable<CharacterDocument["defenses"]>, value: number) => void;
}

const DefensesContext = createContext<DefensesContextType | undefined>(undefined);

export const DefensesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, updateDefenses } = useCharacterSheet();

  const defenses = useMemo(() => ({
    aparar: state?.defenses?.aparar ?? 0,
    esquiva: state?.defenses?.esquiva ?? 0,
    fortitude: state?.defenses?.fortitude ?? 0,
    resistencia: state?.defenses?.resistencia ?? 0,
    vontade: state?.defenses?.vontade ?? 0,
  }), [state?.defenses]);

  const updateDefense = useCallback((key: keyof NonNullable<CharacterDocument["defenses"]>, value: number) => {
    if (!updateDefenses) return;
    const baseDefenses = { aparar: 0, esquiva: 0, fortitude: 0, resistencia: 0, vontade: 0 } as NonNullable<CharacterDocument["defenses"]>;
    updateDefenses((prev) => ({ ...baseDefenses, ...(prev || {}), [key]: value }));
  }, [updateDefenses]);

  return (
    <DefensesContext.Provider value={{ defenses, updateDefense }}>
      {children}
    </DefensesContext.Provider>
  );
};

export function useDefenses() {
  const ctx = useContext(DefensesContext);
  if (!ctx) throw new Error("useDefenses must be used within a DefensesProvider");
  return ctx;
}
