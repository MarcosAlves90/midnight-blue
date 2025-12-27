"use client";

import React, { createContext, useContext, useState } from "react";
import type { CharacterDocument } from "@/lib/character-service";

interface CharacterContextType {
  selectedCharacter: CharacterDocument | null;
  setSelectedCharacter: (character: CharacterDocument | null) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterDocument | null>(null);

  return (
    <CharacterContext.Provider value={{ selectedCharacter, setSelectedCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacter deve ser usado dentro de CharacterProvider");
  }
  return context;
}
