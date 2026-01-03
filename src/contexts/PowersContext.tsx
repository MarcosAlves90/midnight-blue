"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Power } from "../components/pages/status/powers/types";
import { useAuth } from "./AuthContext";
import { useCharacter } from "./CharacterContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";

interface PowersContextType {
  powers: Power[];
  setPowers: React.Dispatch<React.SetStateAction<Power[]>>;
  addPower: (power: Power) => void;
  updatePower: (power: Power) => void;
  deletePower: (id: string) => void;
  isSyncing: boolean;
}

const PowersContext = createContext<PowersContextType | undefined>(undefined);

const STORAGE_KEY = "midnight-powers";

export const PowersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [powers, setPowersState] = useState<Power[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const lastVersionRef = useRef<number>(0);

  const { user } = useAuth();
  const { selectedCharacter } = useCharacter();
  const { scheduleAutoSave, setOnSaveSuccess } = useCharacterPersistence(
    user?.uid ?? null,
    selectedCharacter?.id
  );

  // Inbound Sync: Listen to selectedCharacter changes from server
  useEffect(() => {
    if (selectedCharacter && selectedCharacter.powers) {
      // Only update if server version is newer than what we last processed
      if (selectedCharacter.version > lastVersionRef.current) {
        console.debug("[PowersContext] Inbound sync", { 
          version: selectedCharacter.version, 
          prevVersion: lastVersionRef.current 
        });
        setPowersState(selectedCharacter.powers);
        lastVersionRef.current = selectedCharacter.version;
      }
    } else if (!selectedCharacter) {
      setPowersState([]);
      lastVersionRef.current = 0;
    }
  }, [selectedCharacter]);

  // Setup save success callback
  useEffect(() => {
    setOnSaveSuccess((fields) => {
      if (fields.includes("powers")) {
        setIsSyncing(false);
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
          setPowersState(parsed);
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

  const setPowers = useCallback((action: React.SetStateAction<Power[]>) => {
    setPowersState((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      
      if (selectedCharacter?.id) {
        setIsSyncing(true);
        scheduleAutoSave({ powers: next });
      }
      
      return next;
    });
  }, [selectedCharacter?.id, scheduleAutoSave]);

  const addPower = useCallback((power: Power) => {
    setPowers((prev) => [...prev, power]);
  }, [setPowers]);

  const updatePower = useCallback((power: Power) => {
    setPowers((prev) => prev.map((p) => (p.id === power.id ? power : p)));
  }, [setPowers]);

  const deletePower = useCallback((id: string) => {
    setPowers((prev) => prev.filter((p) => p.id !== id));
  }, [setPowers]);

  return (
    <PowersContext.Provider value={{ powers, setPowers, addPower, updatePower, deletePower, isSyncing }}>
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
