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

  // Escuta mudanças em tempo real no personagem selecionado
  useEffect(() => {
    if (!user?.uid || !selectedCharacter?.id) return;

    const unsubscribe = CharacterService.onCharacterChange(
      user.uid,
      selectedCharacter.id,
      (updatedChar) => {
        if (updatedChar) {
          // Só atualiza se houver mudança real para evitar loops de render
          // Comparamos a versão ou o timestamp de atualização
          if (updatedChar.version !== selectedCharacter.version || 
              updatedChar.updatedAt.getTime() !== selectedCharacter.updatedAt.getTime()) {
            internalSetSelectedCharacter(updatedChar);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [user?.uid, selectedCharacter?.id, selectedCharacter?.version, selectedCharacter?.updatedAt]);

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
    if (!user?.uid) {
      internalSetSelectedCharacter(null);
      return;
    }

    let cancelled = false;

    const restoreSelection = async () => {

      try {
        // Tenta restore rápido via localStorage
        const localId = (() => {
          try { return localStorage.getItem(CURRENT_CHAR_KEY); } catch { return null; }
        })();

        if (localId) {
          // Carrega dados (pode ser stale, mas retorna rápido)
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

            // Após carregar dados iniciais, verifica se há dados mais frescos
            // Aguarda um pouco para ver se dados frescos chegam do background refresh
            setTimeout(async () => {
              if (cancelled) return;
              
              try {
                // Força busca de dados frescos
                const fresh = await loadCharacter(localId, { forceFresh: true });
                if (!cancelled && fresh) {
                  // Compara se dados mudaram
                  const currentHash = JSON.stringify(char.identity);
                  const freshHash = JSON.stringify(fresh.identity);
                  
                  if (currentHash !== freshHash) {
                    console.debug("[CharacterContext] Fresh data detected, updating state", { localId });
                    // Atualiza com dados frescos
                    internalSetSelectedCharacter(fresh);
                  }
                }
              } catch (err) {
                console.debug("[CharacterContext] Failed to refresh character data:", err);
                // Ignore errors in background refresh
              }
            }, 1000); // Aguarda 1s para dados frescos chegarem

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
