"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { CharacterDocument } from "@/lib/types/character";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import { FirebaseCharacterRepository } from "@/services/repository/character-repo";
import { CharacterStorageService } from "@/services/character-storage";

interface CharacterContextType {
  selectedCharacter: CharacterDocument | null;
  setSelectedCharacter: (character: CharacterDocument | null) => void;
  openNewDialog: boolean;
  setOpenNewDialog: (open: boolean) => void;
  isLoading: boolean;
  activeContextId: string | null;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [selectedCharacter, internalSetSelectedCharacter] = useState<CharacterDocument | null>(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const { isAdminMode, targetUserId, isAdminRestored, activeContextId } = useAdmin();
  const lastResolvedIdRef = React.useRef<string | null>(null);
  
  // Hook de persistência configurado para o usuário ativo no contexto
  const { loadCharacter, loadLastSelected } = useCharacterPersistence(activeContextId);

  // Instância do repositório garantida para o usuário ativo (Observer Pattern)
  const repo = useMemo(() => activeContextId ? new FirebaseCharacterRepository(activeContextId) : null, [activeContextId]);

  // 1. Limpeza reativa em troca de contexto (Admin <-> User)
  // Se o activeContextId mudar, resetamos a seleção local IMEDIATAMENTE
  useEffect(() => {
    if (activeContextId !== lastResolvedIdRef.current) {
      internalSetSelectedCharacter(null);
      lastResolvedIdRef.current = activeContextId;
    }
  }, [activeContextId]);

  // Escuta mudanças em tempo real (Subscription Strategy)
  useEffect(() => {
    if (!repo || !selectedCharacter?.id) return;

    return repo.onCharacterChange(
      selectedCharacter.id,
      (updatedChar) => {
        if (!updatedChar) return;

        // Só atualiza se houver mudança real de versão ou timestamp para evitar loops
        if (updatedChar.version !== selectedCharacter.version || 
            updatedChar.updatedAt.getTime() !== selectedCharacter.updatedAt.getTime()) {
          internalSetSelectedCharacter(updatedChar);
        }
      }
    );
  }, [repo, selectedCharacter?.id, selectedCharacter?.version, selectedCharacter?.updatedAt]);

  // Wrapper tipado e centralizado para seleção (Encapsulamento de Persistência)
  const setSelectedCharacter = useCallback((character: CharacterDocument | null) => {
    internalSetSelectedCharacter(character);
    if (character) {
      CharacterStorageService.saveSelection(character, character.userId === user?.uid);
    } else {
      CharacterStorageService.clearSelection();
    }
  }, [user?.uid]);

  // 2. Orquestrador de Restauração Simplificado
  useEffect(() => {
    if (!isAdminRestored || !activeContextId) {
        if (!activeContextId && isAdminRestored) {
            internalSetSelectedCharacter(null);
            setIsLoading(false);
        }
        return;
    }

    let isSubscribed = true;

    const resolveInitialCharacter = async () => {
        setIsLoading(true);
        try {
            const currentId = CharacterStorageService.getStoredCurrentId();
            const storedOwnerId = CharacterStorageService.getStoredOwnerId();
            
            // Prioridade 1: Cache local se pertencer ao contexto atual
            if (currentId && storedOwnerId === activeContextId) {
                const char = await loadCharacter(currentId);
                if (isSubscribed && char) {
                    internalSetSelectedCharacter(char);
                    return;
                }
            } 

            // Prioridade 2: Modo Usuário - Recuperar última própria
            if (!isAdminMode) {
                const lastOwnId = CharacterStorageService.getStoredLastOwnId();
                const char = lastOwnId ? await loadCharacter(lastOwnId) : await loadLastSelected();
                if (isSubscribed && char && char.userId === user?.uid) {
                    internalSetSelectedCharacter(char);
                    return;
                }
            }

            // Fallback: Nada selecionado para este contexto
            if (isSubscribed) internalSetSelectedCharacter(null);
        } catch (err) {
            console.error("[CharacterContext] Erro na restauração:", err);
        } finally {
            if (isSubscribed) setIsLoading(false);
        }
    };

    resolveInitialCharacter();
    return () => { isSubscribed = false; };
  }, [activeContextId, isAdminRestored, isAdminMode, loadCharacter, loadLastSelected, user?.uid]);

  const value = useMemo(() => ({
    selectedCharacter,
    setSelectedCharacter,
    openNewDialog,
    setOpenNewDialog,
    isLoading,
    activeContextId
  }), [selectedCharacter, setSelectedCharacter, openNewDialog, setOpenNewDialog, isLoading, activeContextId]);

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) throw new Error("useCharacter deve ser usado dentro de CharacterProvider");
  return context;
}
