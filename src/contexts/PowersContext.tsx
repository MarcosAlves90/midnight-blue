"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Power } from "../components/pages/status/powers/types";
import { useAuth } from "./AuthContext";
import { useCharacter } from "./CharacterContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";

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

const STORAGE_KEY = "midnight-powers";

export const PowersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [powers, setPowers] = useState<Power[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());

  const { user } = useAuth();
  const { selectedCharacter } = useCharacter();
  const { scheduleAutoSave, setOnSaveSuccess } = useCharacterPersistence(
    user?.uid ?? null,
    selectedCharacter?.id
  );

  // Setup save success callback
  useEffect(() => {
    setOnSaveSuccess((fields) => {
      if (fields.includes("powers")) {
        setIsSyncing(false);
        setDirtyFields((prev) => {
          const next = new Set(prev);
          next.delete("powers");
          return next;
        });
      }
    });
    return () => setOnSaveSuccess(null);
  }, [setOnSaveSuccess]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPowers(parsed);
        }
      }
    } catch {
      // ignore errors
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      import("@/lib/local-storage-async").then((m) => m.setItemAsync(STORAGE_KEY, powers)).catch(() => {});
    } catch {
      // ignore errors
    }
  }, [powers]);

  const updatePowers = useCallback((action: React.SetStateAction<Power[]>) => {
    setPowers((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      
      if (selectedCharacter?.id) {
        setIsSyncing(true);
        setDirtyFields((prevDirty) => {
          const nextDirty = new Set(prevDirty);
          nextDirty.add("powers");
          return nextDirty;
        });
        scheduleAutoSave({ powers: next });
      }
      
      return next;
    });
  }, [selectedCharacter?.id, scheduleAutoSave]);

  const addPower = useCallback((power: Power) => {
    updatePowers((prev) => [...prev, power]);
  }, [updatePowers]);

  const updatePower = useCallback((power: Power) => {
    updatePowers((prev) => prev.map((p) => (p.id === power.id ? power : p)));
  }, [updatePowers]);

  const deletePower = useCallback((id: string) => {
    updatePowers((prev) => prev.filter((p) => p.id !== id));
  }, [updatePowers]);

  const markFieldDirty = useCallback((field: string) => {
    setDirtyFields((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  }, []);

  return (
    <PowersContext.Provider value={{ powers, setPowers, updatePowers, addPower, updatePower, deletePower, isSyncing, dirtyFields, markFieldDirty }}>
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
