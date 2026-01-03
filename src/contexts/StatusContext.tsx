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
  extraPoints: number;
  setExtraPoints: (points: number) => void;
  isSyncing: boolean;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

const STORAGE_KEY = "midnight-status";

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [powerLevel, setPowerLevelState] = useState(10);
  const [extraPoints, setExtraPointsState] = useState(0);
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
    if (selectedCharacter && selectedCharacter.status) {
      // Only update if server version is newer than what we last processed
      if (selectedCharacter.version > lastVersionRef.current) {
        console.debug("[StatusContext] Inbound sync", { 
          version: selectedCharacter.version, 
          prevVersion: lastVersionRef.current 
        });
        if (typeof selectedCharacter.status.powerLevel === "number") {
          setPowerLevelState(selectedCharacter.status.powerLevel);
        }
        if (typeof selectedCharacter.status.extraPoints === "number") {
          setExtraPointsState(selectedCharacter.status.extraPoints);
        }
        lastVersionRef.current = selectedCharacter.version;
      }
    } else if (!selectedCharacter) {
      setPowerLevelState(10);
      setExtraPointsState(0);
      lastVersionRef.current = 0;
    }
  }, [selectedCharacter]);

  // Setup save success callback
  useEffect(() => {
    setOnSaveSuccess((fields) => {
      if (fields.some(f => f.startsWith("status."))) {
        setIsSyncing(false);
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
          setPowerLevelState(parsed.powerLevel);
        if (typeof parsed.extraPoints === "number")
          setExtraPointsState(parsed.extraPoints);
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

  const setPowerLevel = useCallback((level: number) => {
    setPowerLevelState(level);
    if (selectedCharacter?.id) {
      setIsSyncing(true);
      scheduleAutoSave({ status: { powerLevel: level } });
    }
  }, [selectedCharacter?.id, scheduleAutoSave]);

  const setExtraPoints = useCallback((points: number) => {
    setExtraPointsState(points);
    if (selectedCharacter?.id) {
      setIsSyncing(true);
      scheduleAutoSave({ status: { extraPoints: points } });
    }
  }, [selectedCharacter?.id, scheduleAutoSave]);

  return (
    <StatusContext.Provider
      value={{ powerLevel, setPowerLevel, extraPoints, setExtraPoints, isSyncing }}
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
