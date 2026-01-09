"use client";
import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useCharacterSheet } from "./CharacterSheetContext";

interface StatusContextType {
  powerLevel: number;
  setPowerLevel: (level: number) => void;
  updatePowerLevel: (level: number) => void;
  extraPoints: number;
  setExtraPoints: (points: number) => void;
  updateExtraPoints: (points: number) => void;
  isSyncing: boolean;
  dirtyFields: Set<string>;
  markFieldDirty: (field: string) => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state, updateStatus: updateSheet, isSyncing, dirtyFields, markFieldDirty: markSheetDirty } = useCharacterSheet();

  const powerLevel = state?.status?.powerLevel ?? 10;
  const extraPoints = state?.status?.extraPoints ?? 0;

  const updatePowerLevel = useCallback((level: number) => {
    updateSheet({ powerLevel: level });
  }, [updateSheet]);

  const updateExtraPoints = useCallback((points: number) => {
    updateSheet({ extraPoints: points });
  }, [updateSheet]);

  const markFieldDirty = useCallback((field: string = "status") => {
    markSheetDirty(field as any);
  }, [markSheetDirty]);

  const value = useMemo(() => ({
    powerLevel,
    setPowerLevel: () => {},
    updatePowerLevel,
    extraPoints,
    setExtraPoints: () => {},
    updateExtraPoints,
    isSyncing,
    dirtyFields,
    markFieldDirty
  }), [powerLevel, updatePowerLevel, extraPoints, updateExtraPoints, isSyncing, dirtyFields, markFieldDirty]);

  return (
    <StatusContext.Provider value={value}>
      {children}
    </StatusContext.Provider>
  );
};

export function useStatusContext() {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error("useStatusContext must be used within a StatusProvider");
  }
  return context;
}
