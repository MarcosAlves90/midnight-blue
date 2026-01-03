"use client";
import React, { createContext, useContext, useCallback, useMemo } from "react";
import { Attribute } from "../components/pages/status/attributes-grid/types";
import { INITIAL_ATTRIBUTES } from "../components/pages/status/attributes-grid/constants";
import { useCharacterSheet } from "./CharacterSheetContext";

interface AttributesContextType {
  attributes: Attribute[];
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
  updateAttributes: (action: React.SetStateAction<Attribute[]>) => void;
  resetAttributes: () => void;
  isSyncing: boolean;
  dirtyFields: Set<string>;
  markFieldDirty: (field: string) => void;
}

const AttributesContext = createContext<AttributesContextType | undefined>(
  undefined,
);

export const AttributesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state, updateAttributes: updateSheet, isSyncing, dirtyFields } = useCharacterSheet();

  const attributes = state?.attributes ?? INITIAL_ATTRIBUTES;

  const updateAttributes = useCallback((action: React.SetStateAction<Attribute[]>) => {
    const next = typeof action === "function" ? action(attributes) : action;
    updateSheet(next);
  }, [attributes, updateSheet]);

  const resetAttributes = useCallback(() => {
    updateSheet(INITIAL_ATTRIBUTES);
  }, [updateSheet]);

  const markFieldDirty = useCallback(() => {}, []);

  const value = useMemo(() => ({
    attributes,
    setAttributes: () => {}, // No longer used directly
    updateAttributes,
    resetAttributes,
    isSyncing,
    dirtyFields,
    markFieldDirty
  }), [attributes, updateAttributes, resetAttributes, isSyncing, dirtyFields]);

  return (
    <AttributesContext.Provider value={value}>
      {children}
    </AttributesContext.Provider>
  );
};

export function useAttributesContext() {
  const context = useContext(AttributesContext);
  if (!context)
    throw new Error(
      "useAttributesContext deve ser usado dentro de AttributesProvider",
    );
  return context;
}
