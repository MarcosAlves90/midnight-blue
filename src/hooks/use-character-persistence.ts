import { useCallback, useRef, useEffect } from "react";
import { FirebaseCharacterRepository } from "@/services/repository/character-repo";
import type { CharacterDocument, CharacterData, Folder } from "@/lib/types/character";
import { AutoSaveService } from "@/services/auto-save";
import { PersistenceManager } from "@/services/persistence-manager";
import { setItemAsync } from "@/lib/local-storage-async";
import { measureAndWarn } from "@/lib/perf-utils";
import { getCheapFingerprint } from "@/lib/utils";

export function useCharacterPersistence(
  userId: string | null,
  characterId?: string,
) {
  // Store last saved fingerprint to avoid repeated stringify costs
  const lastSavedDataRef = useRef<string | null>(null);
  const pendingObjRef = useRef<Partial<CharacterData> | null>(null);
  
  // Track all fields that have been scheduled for saving (accumulated across multiple rapid edits)
  // This ensures we clear all dirtyFields even when AutoSaveService coalesces multiple saves
  const pendingFieldsRef = useRef<Set<string>>(new Set());

  // PersistenceManager + AutoSaveService instances (per hook instance)
  const persistenceManagerRef = useRef<PersistenceManager | null>(null);
  const autoSaveServiceRef = useRef<AutoSaveService<Partial<CharacterData>> | null>(null);
  const repoRef = useRef<FirebaseCharacterRepository | null>(null);
  
  // Callback ref for notifying when save succeeds (used by IdentityContext to clear dirtyFields)
  const onSaveSuccessRef = useRef<((savedFields: string[]) => void) | null>(null);

  useEffect(() => {
    // instantiate repository and autosave service when userId/characterId available
    if (userId && characterId) {
      // Reset fingerprint when characterId changes to avoid false positives
      lastSavedDataRef.current = null;
      pendingObjRef.current = null;
      pendingFieldsRef.current = new Set();

      repoRef.current = new FirebaseCharacterRepository(userId);
      persistenceManagerRef.current = new PersistenceManager(userId);
      autoSaveServiceRef.current = new AutoSaveService(async (data) => {
        if (!persistenceManagerRef.current) throw new Error("PersistenceManager not initialized");

        // Delegate complex save logic to PersistenceManager
        return persistenceManagerRef.current.save(characterId, data, pendingFieldsRef.current);
      }, {
        debounceMs: 3000,
        onSuccess: (result?: unknown) => {
          // Update fingerprint ONLY after successful save
          let fingerprint: string | null = null;
          
          if (result && typeof result === "object") {
            const res = result as { fingerprint?: string; savedFields?: string[] };
            fingerprint = res.fingerprint ?? null;
          }
          
          if (fingerprint) {
            lastSavedDataRef.current = fingerprint;
            pendingObjRef.current = null;
          }
          
          // Clear accumulated pending fields after successful save
          const fieldsToClear = Array.from(pendingFieldsRef.current);
          pendingFieldsRef.current.clear();
          
          // Notify that fields were saved (will be handled by IdentityContext via callback)
          console.debug("[auto-save] success (service)", { userId, characterId, savedFields: fieldsToClear });
          
          // Call callback to notify IdentityContext that fields were saved
          if (fieldsToClear.length > 0 && onSaveSuccessRef.current) {
            try {
              onSaveSuccessRef.current(fieldsToClear);
            } catch (err) {
              console.error("[auto-save] Error in onSaveSuccess callback:", err);
            }
          }
        },
        onError: (err: unknown) => {
          // On error, reset fingerprint to allow retry
          // BUT keep pendingFieldsRef so fields can be retried
          lastSavedDataRef.current = null;
          
          const maybeConflict = (err as Error & { conflict?: CharacterDocument }).conflict;
          if (maybeConflict) {
            console.warn("[auto-save] conflict (service)", maybeConflict);
          } else {
            console.error("[auto-save] error (service)", err, { pendingFields: Array.from(pendingFieldsRef.current) });
          }
        },
      });
    } else {
      persistenceManagerRef.current = null;
      autoSaveServiceRef.current = null;
      // Reset fingerprint when no character is selected
      lastSavedDataRef.current = null;
      pendingObjRef.current = null;
      pendingFieldsRef.current = new Set();
    }

    return () => {
      // noop
    };
  }, [userId, characterId]);

  /**
   * Schedule autosave with 3-second debounce
   * Uses improved fingerprint for change detection
   */
  const scheduleAutoSave = useCallback(
    (data: Partial<CharacterData>) => {
      if (!userId || !characterId) {
        console.debug("[scheduleAutoSave] Skipping - no userId or characterId", { userId, characterId });
        return;
      }

      const fingerprint = getCheapFingerprint(data);

      // Skip if identical to last saved (only if save was successful)
      if (lastSavedDataRef.current === fingerprint) {
        console.debug("[scheduleAutoSave] Skipping - identical fingerprint", { fingerprint });
        return;
      }

      // Store pending data (fingerprint will be updated in onSuccess after save completes)
      if (!pendingObjRef.current) {
        pendingObjRef.current = { ...data };
      } else {
        pendingObjRef.current = { ...pendingObjRef.current, ...data };
        // Deep merge for identity and status if needed
        if (data.identity && pendingObjRef.current.identity) {
          pendingObjRef.current.identity = { ...pendingObjRef.current.identity, ...data.identity };
        }
        if (data.status && pendingObjRef.current.status) {
          pendingObjRef.current.status = { ...pendingObjRef.current.status, ...data.status };
        }
      }

      // Accumulate fields that are being scheduled for saving
      // This ensures we clear ALL dirtyFields even when AutoSaveService coalesces multiple saves
      if (data.identity && typeof data.identity === "object") {
        const identityFields = data.identity as unknown as Record<string, unknown>;
        Object.keys(identityFields).forEach((key) => {
          pendingFieldsRef.current.add(key);
        });
      }
      
      // Also track other top-level fields
      if (data.status && typeof data.status === "object") {
        const statusFields = data.status as unknown as Record<string, unknown>;
        Object.keys(statusFields).forEach((key) => {
          pendingFieldsRef.current.add(`status.${key}`);
        });
      }
      if (data.attributes) pendingFieldsRef.current.add("attributes");
      if (data.skills) pendingFieldsRef.current.add("skills");
      if (data.powers) pendingFieldsRef.current.add("powers");
      if (data.customDescriptors) pendingFieldsRef.current.add("customDescriptors");

      // Delegate to AutoSaveService
      if (autoSaveServiceRef.current) {
        autoSaveServiceRef.current.schedule(data);
        console.debug("[scheduleAutoSave] Scheduled", { 
          fingerprint, 
          hasPending: !!pendingObjRef.current,
          pendingFields: Array.from(pendingFieldsRef.current)
        });
      } else {
        console.warn("[scheduleAutoSave] AutoSaveService not initialized", { userId, characterId });
      }
    },
    [userId, characterId],
  );

  /**
   * Salva imediatamente um novo personagem
   */
  const createCharacter = useCallback(
    async (data: CharacterData, newCharacterId?: string): Promise<string> => {
      if (!userId) throw new Error("Usuário não autenticado");
      if (!repoRef.current) {
        repoRef.current = new FirebaseCharacterRepository(userId);
      }
      return repoRef.current.saveCharacter(data, newCharacterId);
    },
    [userId],
  );

  /**
   * Carrega um personagem específico
   * 
   * Estratégia de carregamento:
   * 1. Tenta carregar do localStorage para resposta instantânea
   * 2. Se encontrar dados stale (>5s), busca dados frescos do Firebase
   * 3. Se dados são recentes (<5s), retorna imediatamente e atualiza em background
   * 4. Sempre garante que dados frescos sejam buscados e o estado seja atualizado
   */
  const loadCharacter = useCallback(
    async (charId: string, options?: { forceFresh?: boolean }): Promise<CharacterDocument | null> => {
      if (!userId) throw new Error("Usuário não autenticado");
      console.debug("[loadCharacter] fetching", { userId, charId, forceFresh: options?.forceFresh });

      if (!repoRef.current) {
        repoRef.current = new FirebaseCharacterRepository(userId);
      }

      const perfKey = `loadCharacter:${charId}`;
      try {
        performance.mark(`${perfKey}-start`);
      } catch {
        // ignore
      }

      const localStorageKey = `midnight-current-character-doc:${charId}`;
      const STALE_THRESHOLD_MS = 5000; // Considera stale se > 5 segundos

      // Se forceFresh, pula localStorage e busca direto do Firebase
      if (options?.forceFresh) {
        try {
          const fresh = await repoRef.current.getCharacter(charId);
          if (fresh) {
            try { setItemAsync(localStorageKey, fresh); } catch {}
          }
          
          try {
            measureAndWarn(perfKey, 100);
          } catch {
            // ignore
          }
          
          return fresh;
        } catch (err) {
          console.error("[loadCharacter] Failed to load fresh data:", err);
          // Fall through to cached/localStorage approach
        }
      }

      // Fast-path: attempt to restore from localStorage
      try {
        const stored = (() => {
          try {
            const s = localStorage.getItem(localStorageKey);
            return s ? (JSON.parse(s) as CharacterDocument) : null;
          } catch {
            return null;
          }
        })();

        if (stored) {
          // Check if stored data is stale by checking updatedAt timestamp
          // Consider stale if updatedAt is more than STALE_THRESHOLD_MS ago
          const storedUpdatedAt = stored.updatedAt instanceof Date 
            ? stored.updatedAt.getTime() 
            : new Date(stored.updatedAt).getTime();
          const isStale = (Date.now() - storedUpdatedAt) > STALE_THRESHOLD_MS;

          if (isStale) {
            // Data is stale, fetch fresh data but don't block UI
            // Start fresh fetch immediately but return stored data
            console.debug("[loadCharacter] Stale data detected, fetching fresh in background", { charId });
            
            // Fetch fresh data (non-blocking but we'll wait a bit for it)
            const freshPromise = repoRef.current.getCharacter(charId).catch(() => null);
            
            // Wait up to 500ms for fresh data, then return stored if not ready
            const fresh = await Promise.race([
              freshPromise,
              new Promise<CharacterDocument | null>((resolve) => setTimeout(() => resolve(null), 500))
            ]);

            if (fresh) {
              // Fresh data arrived quickly, use it
              try { setItemAsync(localStorageKey, fresh); } catch {}
              console.debug("[loadCharacter] Fresh data loaded", { charId });
              
              try {
                measureAndWarn(perfKey, 100);
              } catch {
                // ignore
              }
              
              return fresh;
            } else {
              // Fresh data didn't arrive in time, return stored but continue fetching
              freshPromise.then((fresh) => {
                if (fresh) {
                  try { setItemAsync(localStorageKey, fresh); } catch {}
                  console.debug("[loadCharacter] Fresh data arrived after initial load", { charId });
                  // Note: We can't update React state here, but cache is updated for next load
                }
              }).catch(() => {});
            }
          } else {
            // Data is fresh, return immediately and update in background
            (async () => {
              try {
                const fresh = await repoRef.current?.getCharacter(charId);
                if (fresh) {
                  try { setItemAsync(localStorageKey, fresh); } catch {}
                }
              } catch {
                // ignore background error
              }
            })();
          }

          try { console.debug("[loadCharacter] restored from localStorage", { isStale }); } catch {}
          return stored;
        }
      } catch {
        // ignore localStorage errors and fall through to network/cache
      }

      // No localStorage data, fetch from cache/network
      let res: CharacterDocument | null = null;
      try {
        if (!repoRef.current) repoRef.current = new FirebaseCharacterRepository(userId);
        res = await repoRef.current.getCharacter(charId);
      } catch {
        // ignore
      }

      // Persist a fresh copy to localStorage for faster future restores
      try {
        if (res) {
          try { setItemAsync(localStorageKey, res); } catch {}
        }
      } catch {
        // ignore
      }

      try {
        measureAndWarn(perfKey, 100);
      } catch {
        // ignore
      }

      return res;
    },
    [userId],
  );

  /**
   * Lista todos os personagens do usuário
   */
  const loadCharactersList = useCallback(async (): Promise<CharacterDocument[]> => {
    if (!userId) throw new Error("Usuário não autenticado");
    if (!repoRef.current) repoRef.current = new FirebaseCharacterRepository(userId);
    return repoRef.current.listCharacters();
  }, [userId]);

  /**
   * Atualiza um personagem imediatamente
   */
  const saveImmediately = useCallback(
    async (updates: Partial<CharacterData>, options?: { baseVersion?: number }) => {
      if (!userId || !characterId) throw new Error("Dados incompletos");

      console.debug("[saveImmediately] start", { userId, characterId });
      if (!repoRef.current) repoRef.current = new FirebaseCharacterRepository(userId);
      
      const res = await repoRef.current.updateCharacter(characterId, updates, { baseVersion: options?.baseVersion });

      if (res && res.success === false) {
        // Conflict returned - surface to caller
        console.warn("[saveImmediately] conflict detected", res.conflict);
        return res;
      }

      // Clear pending state since we just saved
      const fingerprint = getCheapFingerprint(updates);
      lastSavedDataRef.current = fingerprint;
      pendingObjRef.current = null;

      console.debug("[saveImmediately] done", { userId, characterId });
      return res;
    },
    [userId, characterId],
  );

  /**
   * Remove um personagem
   */
  const removeCharacter = useCallback(
    async (charId: string) => {
      if (!userId) throw new Error("Usuário não autenticado");
      if (!repoRef.current) repoRef.current = new FirebaseCharacterRepository(userId);
      return repoRef.current.deleteCharacter(charId);
    },
    [userId],
  );

  /**
   * Marca um personagem como o último selecionado
   */
  const selectCharacter = useCallback(
    async (charId: string) => {
      if (!userId) throw new Error("Usuário não autenticado");
      if (!repoRef.current) repoRef.current = new FirebaseCharacterRepository(userId);
      return repoRef.current.setLastSelectedCharacter(charId);
    },
    [userId],
  );

  /**
   * Recupera o ID do último personagem selecionado
   */
  const getLastSelectedId = useCallback(async () => {
    if (!userId) throw new Error("Usuário não autenticado");
    if (!repoRef.current) repoRef.current = new FirebaseCharacterRepository(userId);
    return repoRef.current.getLastSelectedCharacterId();
  }, [userId]);

  /**
   * Recupera o último personagem selecionado com todos os dados
   */
  const loadLastSelected = useCallback(async () => {
    if (!userId) throw new Error("Usuário não autenticado");
    if (!repoRef.current) repoRef.current = new FirebaseCharacterRepository(userId);
    const id = await repoRef.current.getLastSelectedCharacterId();
    if (!id) return null;
    return repoRef.current.getCharacter(id);
  }, [userId]);

  /**
   * Escuta mudanças em tempo real na lista de personagens
   */
  const listenToCharacters = useCallback(
    (callback: (characters: CharacterDocument[]) => void) => {
      if (!userId) throw new Error("Usuário não autenticado");
      if (!repoRef.current) repoRef.current = new FirebaseCharacterRepository(userId);
      return repoRef.current.onCharactersChange(callback);
    },
    [userId],
  );

  /**
   * Cria uma nova pasta
   */
  const createFolder = useCallback(async (name: string, parentId: string | null = null) => {
    if (!userId) throw new Error("Usuário não autenticado");
    if (!repoRef.current) repoRef.current = new FirebaseCharacterRepository(userId);
    return repoRef.current.createFolder(name, parentId);
  }, [userId]);

  /**
   * Deleta uma pasta
   */
  const deleteFolder = useCallback(async (folderId: string) => {
    if (!userId) throw new Error("Usuário não autenticado");
    if (!repoRef.current) repoRef.current = new FirebaseCharacterRepository(userId);
    return repoRef.current.deleteFolder(folderId);
  }, [userId]);

  /**
   * Move um personagem para uma pasta
   */
  const moveCharacterToFolder = useCallback(async (characterId: string, folderId: string | null) => {
    if (!userId) throw new Error("Usuário não autenticado");
    if (!repoRef.current) repoRef.current = new FirebaseCharacterRepository(userId);
    return repoRef.current.moveCharacterToFolder(characterId, folderId);
  }, [userId]);

  /**
   * Escuta mudanças em tempo real nas pastas
   */
  const listenToFolders = useCallback((callback: (folders: Folder[]) => void) => {
    if (!userId) return () => {};
    if (!repoRef.current) repoRef.current = new FirebaseCharacterRepository(userId);
    return repoRef.current.onFoldersChange(callback);
  }, [userId]);

  // Try to flush pending saves when page is hidden/unloaded to reduce chance of lost edits
  useEffect(() => {
    const flushIfAny = () => {
      try {
        if (autoSaveServiceRef.current) {
          // Best-effort flush (non-blocking in unload/paghide handlers)
          void autoSaveServiceRef.current.flush();
        }
      } catch {
        // ignore
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushIfAny();
    };

    window.addEventListener("pagehide", flushIfAny);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", flushIfAny);

    return () => {
      window.removeEventListener("pagehide", flushIfAny);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", flushIfAny);
    };
  }, []);

  /**
   * Sets a callback to be called when auto-save succeeds
   * Used by IdentityContext to clear dirtyFields when fields are saved
   */
  const setOnSaveSuccess = useCallback((callback: ((savedFields: string[]) => void) | null) => {
    onSaveSuccessRef.current = callback;
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
    setOnSaveSuccess,
    createFolder,
    deleteFolder,
    moveCharacterToFolder,
    listenToFolders,
  };
}
