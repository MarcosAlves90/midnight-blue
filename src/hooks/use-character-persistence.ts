import { useCallback, useRef, useEffect, useState } from "react";
import {
  saveCharacter,
  getCharacter,
  listCharacters,
  updateCharacter,
  deleteCharacter,
  autoSaveCharacter,
  setLastSelectedCharacter,
  getLastSelectedCharacterId,
  getLastSelectedCharacter,
  onCharactersChange,
  type CharacterDocument,
  type CharacterData,
} from "@/lib/character-service";

export function useCharacterPersistence(
  userId: string | null,
  characterId?: string,
) {
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSavedDataRef = useRef<Partial<CharacterData> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Inicia auto-save do personagem com debounce de 3 segundos
   * OTIMIZADO: Não envia dados idênticos (change detection)
   */
  const scheduleAutoSave = useCallback(
    (data: Partial<CharacterData>) => {
      if (!userId || !characterId) return;

      // Evita agendar salvamento se os dados são idênticos aos últimos salvos
      if (
        lastSavedDataRef.current &&
        JSON.stringify(lastSavedDataRef.current) === JSON.stringify(data)
      ) {
        return;
      }

      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        setIsSaving(true);
        lastSavedDataRef.current = data;
        autoSaveCharacter(userId, characterId, data)
          .then(() => {
            setIsSaving(false);
          })
          .catch((error) => {
            console.error("Erro no auto-save:", error);
            setIsSaving(false);
          });
      }, 3000);
    },
    [userId, characterId],
  );

  /**
   * Salva imediatamente um novo personagem
   */
  const createCharacter = useCallback(
    async (data: CharacterData, newCharacterId?: string): Promise<string> => {
      if (!userId) throw new Error("Usuário não autenticado");
      return saveCharacter(userId, data, newCharacterId);
    },
    [userId],
  );

  /**
   * Carrega um personagem específico
   */
  const loadCharacter = useCallback(
    async (charId: string): Promise<CharacterDocument | null> => {
      if (!userId) throw new Error("Usuário não autenticado");
      return getCharacter(userId, charId);
    },
    [userId],
  );

  /**
   * Lista todos os personagens do usuário
   */
  const loadCharactersList = useCallback(async (): Promise<CharacterDocument[]> => {
    if (!userId) throw new Error("Usuário não autenticado");
    return listCharacters(userId);
  }, [userId]);

  /**
   * Atualiza um personagem imediatamente
   */
  const saveImmediately = useCallback(
    async (updates: Partial<CharacterData>) => {
      if (!userId || !characterId) throw new Error("Dados incompletos");

      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      return updateCharacter(userId, characterId, updates);
    },
    [userId, characterId],
  );

  /**
   * Remove um personagem
   */
  const removeCharacter = useCallback(
    async (charId: string) => {
      if (!userId) throw new Error("Usuário não autenticado");
      return deleteCharacter(userId, charId);
    },
    [userId],
  );

  /**
   * Marca um personagem como o último selecionado
   */
  const selectCharacter = useCallback(
    async (charId: string) => {
      if (!userId) throw new Error("Usuário não autenticado");
      return setLastSelectedCharacter(userId, charId);
    },
    [userId],
  );

  /**
   * Recupera o ID do último personagem selecionado
   */
  const getLastSelectedId = useCallback(async () => {
    if (!userId) throw new Error("Usuário não autenticado");
    return getLastSelectedCharacterId(userId);
  }, [userId]);

  /**
   * Recupera o último personagem selecionado com todos os dados
   */
  const loadLastSelected = useCallback(async () => {
    if (!userId) throw new Error("Usuário não autenticado");
    return getLastSelectedCharacter(userId);
  }, [userId]);

  /**
   * Escuta mudanças em tempo real na lista de personagens
   */
  const listenToCharacters = useCallback(
    (callback: (characters: CharacterDocument[]) => void) => {
      if (!userId) throw new Error("Usuário não autenticado");
      return onCharactersChange(userId, callback);
    },
    [userId],
  );

  // Limpa timeout ao desmontar
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    createCharacter,
    loadCharacter,
    loadCharactersList,
    listenToCharacters,
    scheduleAutoSave,
    saveImmediately,
    removeCharacter,
    selectCharacter,
    getLastSelectedId,
    loadLastSelected,
    isSaving,
  };
}
