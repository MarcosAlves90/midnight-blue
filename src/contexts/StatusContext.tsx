"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface StatusContextType {
  powerLevel: number;
  setPowerLevel: (level: number) => void;
  extraPoints: number;
  setExtraPoints: (points: number) => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

const STORAGE_KEY = "midnight-status";

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [powerLevel, setPowerLevelState] = useState(10);
  const [extraPoints, setExtraPointsState] = useState(0);

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
  }, []);

  const setExtraPoints = useCallback((points: number) => {
    setExtraPointsState(points);
  }, []);

  return (
    <StatusContext.Provider
      value={{ powerLevel, setPowerLevel, extraPoints, setExtraPoints }}
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
