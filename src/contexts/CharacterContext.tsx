"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { CharacterDocument } from "@/lib/character-service";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import * as CharacterService from "@/lib/character-service";
import { setItemAsync, setStringItemAsync, removeItemAsync } from "@/lib/local-storage-async";

interface CharacterContextType {
  selectedCharacter: CharacterDocument | null;
  setSelectedCharacter: (character: CharacterDocument | null) => void;
  openNewDialog: boolean;
  setOpenNewDialog: (open: boolean) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

const CURRENT_CHAR_KEY = "midnight-current-character-id";

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [selectedCharacter, internalSetSelectedCharacter] = useState<CharacterDocument | null>(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);

  const { user } = useAuth();
  const { loadCharacter, loadLastSelected } = useCharacterPersistence(user?.uid || null);

  // Wrapper que persiste a seleção no localStorage para restaurar rapidamente após reload
  const setSelectedCharacter = React.useCallback((character: CharacterDocument | null) => {
    internalSetSelectedCharacter(character);
    try {
      if (character) {
        try { setStringItemAsync(CURRENT_CHAR_KEY, character.id); } catch {}
        try { setItemAsync(`midnight-current-character-doc:${character.id}`, character); } catch {}
        try { CharacterService.seedCharacterCache(character.userId, character.id, character); } catch {}
      } else {
        // remove id and any persisted document
        try {
          const prev = (() => { try { return localStorage.getItem(CURRENT_CHAR_KEY); } catch { return null; } })();
          if (prev) try { removeItemAsync(`midnight-current-character-doc:${prev}`); } catch {}
        } catch {}
        try { removeItemAsync(CURRENT_CHAR_KEY); } catch {}
      }
    } catch {
      // ignore
    }
  }, []);

  // Memoize provider value to avoid unnecessary re-renders of consumers
  const value = React.useMemo(() => ({
    selectedCharacter,
    setSelectedCharacter,
    openNewDialog,
    setOpenNewDialog,
  }), [selectedCharacter, setSelectedCharacter, openNewDialog, setOpenNewDialog]);

  // Ao logar / montar, restaura última seleção: prefer localStorage para responsividade, fallback para servidor
  useEffect(() => {
    let cancelled = false;

    const restoreSelection = async () => {
      if (!user?.uid) return;

      try {
        // Tenta restore rápido via localStorage
        const localId = (() => {
          try { return localStorage.getItem(CURRENT_CHAR_KEY); } catch { return null; }
        })();

        if (localId) {
          const char = await loadCharacter(localId);
          if (!cancelled && char) {
            // apply selection non-urgently to avoid blocking UI
            try {
              // React 18 startTransition (typed)
              const rt = (React as unknown as { startTransition?: (fn: () => void) => void }).startTransition;
              if (typeof rt === "function") {
                try {
                  rt(() => internalSetSelectedCharacter(char));
                } catch {
                  internalSetSelectedCharacter(char);
                }
              } else internalSetSelectedCharacter(char);
            } catch {
              internalSetSelectedCharacter(char);
            }
            return;
          }
        }

        // Fallback: busca último selecionado no servidor
        const last = await loadLastSelected();
        if (!cancelled && last) {
          try {
            const rt = (React as unknown as { startTransition?: (fn: () => void) => void }).startTransition;
            if (typeof rt === "function") {
              try {
                rt(() => internalSetSelectedCharacter(last));
              } catch {
                internalSetSelectedCharacter(last);
              }
            } else internalSetSelectedCharacter(last);
          } catch {
            internalSetSelectedCharacter(last);
          }
        }
      } catch (err) {
        // Fallback silencioso
        console.error("Falha ao restaurar seleção de personagem:", err);
      }
    };

    restoreSelection();

    return () => { cancelled = true; };
  }, [user?.uid, loadCharacter, loadLastSelected]);

  return (
    <CharacterContext.Provider value={value}>
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
