"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Attribute } from "../components/pages/status/attributes-grid/types";
import { INITIAL_ATTRIBUTES } from "../components/pages/status/attributes-grid/constants";
import { useAuth } from "./AuthContext";
import { useCharacter } from "./CharacterContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";

interface AttributesContextType {
  attributes: Attribute[];
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
  resetAttributes: () => void;
  isSyncing: boolean;
}

const AttributesContext = createContext<AttributesContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "midnight-attributes";

export const AttributesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Start with server-safe initial value so SSR and first client render match.
  const [attributes, setAttributesState] = useState<Attribute[]>(INITIAL_ATTRIBUTES);
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
    if (selectedCharacter && selectedCharacter.attributes) {
      // Only update if server version is newer than what we last processed
      if (selectedCharacter.version > lastVersionRef.current) {
        console.debug("[AttributesContext] Inbound sync", { 
          version: selectedCharacter.version, 
          prevVersion: lastVersionRef.current 
        });
        setAttributesState(selectedCharacter.attributes);
        lastVersionRef.current = selectedCharacter.version;
      }
    } else if (!selectedCharacter) {
      setAttributesState(INITIAL_ATTRIBUTES);
      lastVersionRef.current = 0;
    }
  }, [selectedCharacter]);

  // Setup save success callback
  useEffect(() => {
    setOnSaveSuccess((fields) => {
      if (fields.includes("attributes")) {
        setIsSyncing(false);
      }
    });
    return () => setOnSaveSuccess(null);
  }, [setOnSaveSuccess]);

  // On mount, load saved attributes from localStorage (client-only).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedAttributes: Attribute[] = JSON.parse(stored);
        // Check if stored attributes match current INITIAL_ATTRIBUTES structure
        const currentIds = new Set(INITIAL_ATTRIBUTES.map((attr) => attr.id));
        const storedIds = new Set(parsedAttributes.map((attr) => attr.id));
        const idsMatch =
          currentIds.size === storedIds.size &&
          [...currentIds].every((id) => storedIds.has(id));
        if (idsMatch) {
          setAttributesState(parsedAttributes);
        } else {
          // Reset to new INITIAL_ATTRIBUTES if structure changed
          setAttributesState(INITIAL_ATTRIBUTES);
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  // Persist changes to localStorage (async/idle to avoid blocking)
  useEffect(() => {
    try {
      import("@/lib/local-storage-async").then((m) => m.setItemAsync(STORAGE_KEY, attributes)).catch(() => {});
    } catch {
      // ignore quota/permission errors
    }
  }, [attributes]);

  const setAttributes = useCallback((action: React.SetStateAction<Attribute[]>) => {
    setAttributesState((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      
      // Schedule auto-save if we have a character selected
      if (selectedCharacter?.id) {
        setIsSyncing(true);
        scheduleAutoSave({ attributes: next });
      }
      
      return next;
    });
  }, [selectedCharacter?.id, scheduleAutoSave]);

  const resetAttributes = () => setAttributes(INITIAL_ATTRIBUTES);

  return (
    <AttributesContext.Provider
      value={{ attributes, setAttributes, resetAttributes, isSyncing }}
    >
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
