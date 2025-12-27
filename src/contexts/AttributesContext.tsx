"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Attribute } from "../components/status/attributes-grid/types";
import { INITIAL_ATTRIBUTES } from "../components/status/attributes-grid/constants";

interface AttributesContextType {
  attributes: Attribute[];
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
  resetAttributes: () => void;
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

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attributes));
    } catch {
      // ignore quota/permission errors
    }
  }, [attributes]);

  const resetAttributes = () => setAttributes(INITIAL_ATTRIBUTES);

  return (
    <AttributesContext.Provider
      value={{ attributes, setAttributes, resetAttributes }}
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
