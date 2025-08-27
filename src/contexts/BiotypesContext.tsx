"use client"
import React, { createContext, useContext, useState, useEffect } from "react";
import { Attribute } from "../components/attributes-grid/types";
import { INITIAL_BIOTYPES } from "../components/attributes-grid/constants";

interface BiotypesContextType {
  biotypes: Attribute[];
  setBiotypes: React.Dispatch<React.SetStateAction<Attribute[]>>;
  resetBiotypes: () => void;
}

const BiotypesContext = createContext<BiotypesContextType | undefined>(undefined);

const STORAGE_KEY = "midnight-biotypes";

export const BiotypesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [biotypes, setBiotypes] = useState<Attribute[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_BIOTYPES;
    }
    return INITIAL_BIOTYPES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(biotypes));
  }, [biotypes]);

  const resetBiotypes = () => setBiotypes(INITIAL_BIOTYPES);

  return (
    <BiotypesContext.Provider value={{ biotypes, setBiotypes, resetBiotypes }}>
      {children}
    </BiotypesContext.Provider>
  );
};

export function useBiotypesContext() {
  const context = useContext(BiotypesContext);
  if (!context) throw new Error("useBiotypesContext deve ser usado dentro de BiotypesProvider");
  return context;
} 