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
  updateAttributes: (action: React.SetStateAction<Attribute[]>) => void;
  resetAttributes: () => void;
  isSyncing: boolean;
  dirtyFields: Set<string>;
  markFieldDirty: (field: string) => void;
}

const AttributesContext = createContext<AttributesContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "midnight-attributes";

export const AttributesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Start with server-safe initial value so SSR and first client render match.
  const [attributes, setAttributes] = useState<Attribute[]>(INITIAL_ATTRIBUTES);
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
      if (fields.includes("attributes")) {
        setIsSyncing(false);
        setDirtyFields((prev) => {
          const next = new Set(prev);
          next.delete("attributes");
          return next;
        });
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
          setAttributes(parsedAttributes);
        } else {
          // Reset to new INITIAL_ATTRIBUTES if structure changed
          setAttributes(INITIAL_ATTRIBUTES);
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

  const updateAttributes = useCallback((action: React.SetStateAction<Attribute[]>) => {
    setAttributes((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      
      // Schedule auto-save if we have a character selected
      if (selectedCharacter?.id) {
        setIsSyncing(true);
        setDirtyFields((prevDirty) => {
          const nextDirty = new Set(prevDirty);
          nextDirty.add("attributes");
          return nextDirty;
        });
        scheduleAutoSave({ attributes: next });
      }
      
      return next;
    });
  }, [selectedCharacter?.id, scheduleAutoSave]);

  const markFieldDirty = useCallback((field: string) => {
    setDirtyFields((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  }, []);

  const resetAttributes = () => updateAttributes(INITIAL_ATTRIBUTES);

  return (
    <AttributesContext.Provider
      value={{ attributes, setAttributes, updateAttributes, resetAttributes, isSyncing, dirtyFields, markFieldDirty }}
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
