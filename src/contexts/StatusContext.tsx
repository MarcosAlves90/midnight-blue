"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import { useCharacter } from "./CharacterContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";

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

const STORAGE_KEY = "midnight-status";

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [powerLevel, setPowerLevel] = useState(10);
  const [extraPoints, setExtraPoints] = useState(0);
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
      if (fields.some(f => f.startsWith("status."))) {
        setIsSyncing(false);
        setDirtyFields((prev) => {
          const next = new Set(prev);
          fields.forEach(f => {
            if (f.startsWith("status.")) {
              next.delete(f.split(".")[1]);
            }
          });
          return next;
        });
      }
    });
    return () => setOnSaveSuccess(null);
  }, [setOnSaveSuccess]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.powerLevel === "number")
          setPowerLevel(parsed.powerLevel);
        if (typeof parsed.extraPoints === "number")
          setExtraPoints(parsed.extraPoints);
      }
    } catch (e) {
      console.error("Failed to load status from localStorage", e);
    }
  }, []);

  // Save to localStorage (async/idle to avoid blocking)
  useEffect(() => {
    try {
      import("@/lib/local-storage-async").then((m) => m.setItemAsync(STORAGE_KEY, { powerLevel, extraPoints })).catch(() => {});
    } catch (e) {
      console.error("Failed to save status to localStorage", e);
    }
  }, [powerLevel, extraPoints]);

  const updatePowerLevel = useCallback((level: number) => {
    setPowerLevel(level);
    if (selectedCharacter?.id) {
      setIsSyncing(true);
      setDirtyFields((prev) => {
        const next = new Set(prev);
        next.add("powerLevel");
        return next;
      });
      scheduleAutoSave({ status: { powerLevel: level } });
    }
  }, [selectedCharacter?.id, scheduleAutoSave]);

  const updateExtraPoints = useCallback((points: number) => {
    setExtraPoints(points);
    if (selectedCharacter?.id) {
      setIsSyncing(true);
      setDirtyFields((prev) => {
        const next = new Set(prev);
        next.add("extraPoints");
        return next;
      });
      scheduleAutoSave({ status: { extraPoints: points } });
    }
  }, [selectedCharacter?.id, scheduleAutoSave]);

  const markFieldDirty = useCallback((field: string) => {
    setDirtyFields((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  }, []);

  return (
    <StatusContext.Provider
      value={{ powerLevel, setPowerLevel, updatePowerLevel, extraPoints, setExtraPoints, updateExtraPoints, isSyncing, dirtyFields, markFieldDirty }}
    >
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
