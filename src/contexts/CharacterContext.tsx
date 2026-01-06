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
  effectiveUserId: string | null;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [selectedCharacter, internalSetSelectedCharacter] = useState<CharacterDocument | null>(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const { isAdminMode, targetUserId, isAdminRestored } = useAdmin();
  
  // Resolve o usuário efetivo baseado no estado atual da aplicação (Padrão Strategy)
  const effectiveUserId = useMemo(() => {
    if (!isAdminRestored) return null; 

    // Se NÃO estamos em modo admin, o usuário efetivo SOMENTE pode ser o logado
    if (!isAdminMode) return user?.uid ?? null;

    // Em modo admin: Prioridade p/ Personagem selecionado > Target Admin > Cache > Logado
    return (
        selectedCharacter?.userId || 
        targetUserId || 
        CharacterStorageService.getStoredOwnerId() || 
        user?.uid || 
        null
    );
  }, [selectedCharacter?.userId, user?.uid, isAdminRestored, isAdminMode, targetUserId]);

  // Hook de persistência configurado para o usuário efetivo
  const { loadCharacter, loadLastSelected } = useCharacterPersistence(effectiveUserId);

  // Instância do repositório garantida para o usuário efetivo (Observer Pattern)
  const repo = useMemo(() => effectiveUserId ? new FirebaseCharacterRepository(effectiveUserId) : null, [effectiveUserId]);

  // Helper para garantir objetos Date válidos
  const asDate = useCallback((d: unknown): Date => {
      if (d instanceof Date) return d;
      const candidate = d as { toDate?: () => Date } | null | undefined;
      if (candidate && typeof candidate.toDate === 'function') return candidate.toDate();
      if (typeof d === 'string' || typeof d === 'number') return new Date(d);
      return new Date();
  }, []);

  // Escuta mudanças em tempo real (Subscription Strategy)
  useEffect(() => {
    if (!repo || !selectedCharacter?.id) return;

    return repo.onCharacterChange(
      selectedCharacter.id,
      (updatedChar) => {
        if (!updatedChar) return;

        const updatedTime = updatedChar.updatedAt.getTime();
        const selectedTime = selectedCharacter.updatedAt.getTime();

        // Só atualiza se houver mudança real de versão ou timestamp para evitar loops
        if (updatedChar.version !== selectedCharacter.version || updatedTime !== selectedTime) {
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
      CharacterStorageService.clearSelection(selectedCharacter?.id);
    }
  }, [user?.uid, selectedCharacter?.id]);

  // Limpa seleção ao alternar o modo administrativo (Segurança de Contexto)
  useEffect(() => {
    if (!isAdminRestored) return;
    
    internalSetSelectedCharacter(null);
    CharacterStorageService.clearSelection();
  }, [isAdminMode, isAdminRestored]);

  // Restaura Personagem Próprio ou Última Seleção (Workflow de Recuperação)
  useEffect(() => {
    if (!user?.uid || !isAdminRestored) {
        if (!user?.uid) {
            internalSetSelectedCharacter(null);
            setIsLoading(false);
        }
        return;
    }

    let isSubscribed = true;

    const performRestoration = async () => {
        // Se mudou de Admin p/ User, tenta restaurar última ficha própria
        if (!isAdminMode && !selectedCharacter) {
            const lastOwnId = CharacterStorageService.getStoredLastOwnId();
            if (lastOwnId) {
                const char = await loadCharacter(lastOwnId);
                if (isSubscribed && char && char.userId === user?.uid) {
                    setSelectedCharacter(char);
                }
            }
        }

        // Restauração inicial após boot ou F5
        const currentId = CharacterStorageService.getStoredCurrentId();
        if (!selectedCharacter && currentId) {
            // Se estamos em modo admin e não temos um alvo definido, limpa
            if (isAdminMode && !targetUserId && CharacterStorageService.getStoredOwnerId() !== user?.uid) {
                setIsLoading(false);
                return;
            }

            const char = await loadCharacter(currentId);
            if (isSubscribed && char) internalSetSelectedCharacter(char);
        } else if (!selectedCharacter) {
            // Fallback: Busca último selecionado no Firestore via Repo
            const last = await loadLastSelected();
            if (isSubscribed && last) internalSetSelectedCharacter(last);
        }

        if (isSubscribed) setIsLoading(false);
    };

    performRestoration();
    return () => { isSubscribed = false; };
  }, [user?.uid, isAdminMode, targetUserId, isAdminRestored, loadCharacter, loadLastSelected, selectedCharacter, setSelectedCharacter]);

  const value = useMemo(() => ({
    selectedCharacter,
    setSelectedCharacter,
    openNewDialog,
    setOpenNewDialog,
    isLoading,
    effectiveUserId
  }), [selectedCharacter, setSelectedCharacter, openNewDialog, setOpenNewDialog, isLoading, effectiveUserId]);

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) throw new Error("useCharacter deve ser usado dentro de CharacterProvider");
  return context;
}
