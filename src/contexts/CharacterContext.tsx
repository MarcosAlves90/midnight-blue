"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { CharacterDocument } from "@/lib/types/character";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import { FirebaseCharacterRepository } from "@/services/repository/character-repo";
import { setItemAsync, setStringItemAsync, removeItemAsync } from "@/lib/local-storage-async";

interface CharacterContextType {
  selectedCharacter: CharacterDocument | null;
  setSelectedCharacter: (character: CharacterDocument | null) => void;
  openNewDialog: boolean;
  setOpenNewDialog: (open: boolean) => void;
  isLoading: boolean;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

const CURRENT_CHAR_KEY = "midnight-current-character-id";
const CURRENT_CHAR_OWNER_KEY = "midnight-current-character-owner-id";

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [selectedCharacter, internalSetSelectedCharacter] = useState<CharacterDocument | null>(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const { isAdminMode, targetUserId } = useAdmin();
  
  // No início, tentamos ler do localStorage para saber quem é o dono salvo (se houver)
  const [persistedOwnerId, setPersistedOwnerId] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPersistedOwnerId(localStorage.getItem(CURRENT_CHAR_OWNER_KEY));
    }
  }, []);

  // Lógica de usuário efetivo:
  // Se estiver em modo Admin e tiver um alvo, usa o alvo.
  // Caso contrário, usa o dono do personagem selecionado (se houver), ou o usuario logado.
  // IMPORTANTE: Priorizamos o targetUserId do modo Admin para garantir que lists/repositórios apontem para o lugar certo.
  const effectiveUserId = useMemo(() => {
    if (isAdminMode && targetUserId) return targetUserId;
    return selectedCharacter?.userId ?? persistedOwnerId ?? user?.uid ?? null;
  }, [isAdminMode, targetUserId, selectedCharacter?.userId, persistedOwnerId, user?.uid]);

  // Hook de persistência configurado para o usuário efetivo
  const { loadCharacter, loadLastSelected } = useCharacterPersistence(effectiveUserId);

  // Instância do repositório garantida para o usuário efetivo (para subscriptions)
  const repo = useMemo(() => effectiveUserId ? new FirebaseCharacterRepository(effectiveUserId) : null, [effectiveUserId]);

  // Limpa seleção se mudarmos de contexto de usuário drasticamente (ex: Admin muda de alvo)
  // Mas preserva se o novo effectiveUserId ainda for compatível com o personagem selecionado.
  useEffect(() => {
    if (selectedCharacter && effectiveUserId && selectedCharacter.userId !== effectiveUserId) {
       // Se o personagem selecionado não pertence ao usuário efetivo atual (ex: mudamos de alvo no admin),
       // deselecionamos para evitar inconsistência.
       // Exceção: O admin pode selecionar qualquer personagem, mas se o 'repo' muda, 
       // a subscription antiga morre.
       // Melhor limpar para evitar "flashes" de dados errados.
       console.debug("[CharacterContext] Clearing selection due to user context switch", {
         charUser: selectedCharacter.userId,
         effective: effectiveUserId
       });
       internalSetSelectedCharacter(null);
    }
  }, [effectiveUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Escuta mudanças em tempo real no personagem selecionado
  useEffect(() => {
    if (!repo || !selectedCharacter?.id) return;

    const unsubscribe = repo.onCharacterChange(
      selectedCharacter.id,
      (updatedChar) => {
        if (!updatedChar) return;

        // --- CORREÇÃO DO ERRO .getTime() is not a function ---
        // Garantimos que as datas sejam objetos Date válidos antes de comparar.
        const getSafeTime = (date: unknown): number => {
            if (date instanceof Date) return date.getTime();
            if (typeof date === 'string') return new Date(date).getTime();
            // Se for Timestamp firestore ou objeto similar
            const candidate = date as { toDate?: () => Date } | null | undefined;
            if (candidate && typeof candidate.toDate === 'function') {
                return candidate.toDate().getTime();
            }
            return 0;
        };

        const updatedTime = getSafeTime(updatedChar.updatedAt);
        const selectedTime = getSafeTime(selectedCharacter.updatedAt);

        // Só atualiza se houver mudança real de versão ou timestamp para evitar loops de render
        if (updatedChar.version !== selectedCharacter.version || updatedTime !== selectedTime) {
          // Garante sanitização completa do objeto antes de setar state
          internalSetSelectedCharacter({
              ...updatedChar,
              updatedAt: new Date(updatedTime), 
              createdAt: asDate(updatedChar.createdAt)
          });
        }
      }
    );

    return () => unsubscribe();
  }, [repo, selectedCharacter?.id, selectedCharacter?.version, selectedCharacter?.updatedAt]);

  // Helper para garantir Date
  const asDate = (d: unknown): Date => {
      if (d instanceof Date) return d;
      const candidate = d as { toDate?: () => Date } | null | undefined;
      if (candidate && typeof candidate.toDate === 'function') return candidate.toDate();
      if (typeof d === 'string' || typeof d === 'number') return new Date(d);
      return new Date();
  }

  // Wrapper que persiste a seleção no localStorage para restaurar rapidamente após reload
  const setSelectedCharacter = React.useCallback((character: CharacterDocument | null) => {
    internalSetSelectedCharacter(character);
    try {
      if (character) {
        try { setStringItemAsync(CURRENT_CHAR_KEY, character.id); } catch {}
        try { setStringItemAsync(CURRENT_CHAR_OWNER_KEY, character.userId); } catch {}
        // Serializamos com cuidado. Datas viram strings no JSON.
        try { setItemAsync(`midnight-current-character-doc:${character.id}`, character); } catch {}
        setPersistedOwnerId(character.userId);
      } else {
        // remove id and any persisted document
        try {
          const prev = (() => { try { return localStorage.getItem(CURRENT_CHAR_KEY); } catch { return null; } })();
          if (prev) try { removeItemAsync(`midnight-current-character-doc:${prev}`); } catch {}
        } catch {}
        try { removeItemAsync(CURRENT_CHAR_KEY); } catch {}
        try { removeItemAsync(CURRENT_CHAR_OWNER_KEY); } catch {}
        setPersistedOwnerId(null);
      }
    } catch {
      // ignore
    }
  }, []);

  // Ao logar / montar, restaura última seleção
  useEffect(() => {
    if (!user?.uid) {
      internalSetSelectedCharacter(null);
      setIsLoading(false);
      return;
    }

    // Se estivermos em modo admin focando outro usuário, NÃO restauramos automaticamente a seleção do localStorage
    // pois ela provavelmente pertence ao Admin (contexto "pessoal").
    if (isAdminMode && targetUserId && targetUserId !== user.uid) {
         setIsLoading(false);
         return;
    }

    let cancelled = false;

    const restoreSelection = async () => {
      try {
        const localId = (() => {
          try { return localStorage.getItem(CURRENT_CHAR_KEY); } catch { return null; }
        })();

        if (localId) {
          const char = await loadCharacter(localId);
          if (!cancelled && char) {
            // Assegura tipos corretos no restore
            const safeChar = {
                ...char,
                updatedAt: asDate(char.updatedAt),
                createdAt: asDate(char.createdAt)
            };
            
            internalSetSelectedCharacter(safeChar);
          }
        } else {
             // Fallback: busca último selecionado no servidor
            const last = await loadLastSelected();
            if (!cancelled && last) {
                 internalSetSelectedCharacter({
                    ...last,
                    updatedAt: asDate(last.updatedAt),
                    createdAt: asDate(last.createdAt)
                 });
            }
        }
      } catch (err) {
        console.error("Falha ao restaurar seleção de personagem:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    restoreSelection();

    return () => { cancelled = true; };
  }, [user?.uid, loadCharacter, loadLastSelected, isAdminMode, targetUserId]);

  const value = React.useMemo(() => ({
    selectedCharacter,
    setSelectedCharacter,
    openNewDialog,
    setOpenNewDialog,
    isLoading
  }), [selectedCharacter, setSelectedCharacter, openNewDialog, setOpenNewDialog, isLoading]);

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
