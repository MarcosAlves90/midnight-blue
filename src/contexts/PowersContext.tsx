"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { Power } from "../components/pages/status/powers/types";
import { useCharacterSheet } from "./CharacterSheetContext";

interface PowersContextType {
  powers: Power[];
  setPowers: React.Dispatch<React.SetStateAction<Power[]>>;
  updatePowers: (action: React.SetStateAction<Power[]>) => void;
  addPower: (power: Power) => void;
  updatePower: (power: Power) => void;
  deletePower: (id: string) => void;
  isSyncing: boolean;
  dirtyFields: Set<string>;
  markFieldDirty: (field: string) => void;
}

const PowersContext = createContext<PowersContextType | undefined>(undefined);

export const PowersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state, updatePowers: updateSheet, isSyncing, dirtyFields } = useCharacterSheet();

  const powers = useMemo(() => state?.powers ?? [], [state?.powers]);

  const updatePowers = useCallback((action: React.SetStateAction<Power[]>) => {
    const next = typeof action === "function" ? action(powers) : action;
    updateSheet(next);
  }, [powers, updateSheet]);

  const addPower = useCallback((power: Power) => {
    updatePowers((prev) => [...prev, power]);
  }, [updatePowers]);

  const updatePower = useCallback((power: Power) => {
    updatePowers((prev) => prev.map((p) => (p.id === power.id ? power : p)));
  }, [updatePowers]);

  const deletePower = useCallback((id: string) => {
    updatePowers((prev) => prev.filter((p) => p.id !== id));
  }, [updatePowers]);

  const markFieldDirty = useCallback(() => {}, []);

  const value = useMemo(() => ({
    powers,
    setPowers: () => {}, // No longer used directly
    updatePowers,
    addPower,
    updatePower,
    deletePower,
    isSyncing,
    dirtyFields,
    markFieldDirty
  }), [powers, updatePowers, addPower, updatePower, deletePower, isSyncing, dirtyFields, markFieldDirty]);

  return (
    <PowersContext.Provider value={value}>
      {children}
    </PowersContext.Provider>
  );
};

export const usePowersContext = () => {
  const context = useContext(PowersContext);
  if (context === undefined) {
    throw new Error("usePowersContext must be used within a PowersProvider");
  }
  return context;
};
