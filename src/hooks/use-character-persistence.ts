import { useCallback, useRef, useEffect } from "react";
import {
  setLastSelectedCharacter,
  getLastSelectedCharacterId,
  getLastSelectedCharacter,
  onCharactersChange,
  updateCharacter as libUpdateCharacter,
  type CharacterDocument,
  type CharacterData,
} from "@/lib/character-service";
import { FirebaseCharacterRepository } from "@/services/repository/character-repo";
import { AutoSaveService } from "@/services/auto-save-simple";
import { backgroundPersistence } from "@/services/background-persistence";
import * as CharacterService from "@/lib/character-service";
import { setItemAsync } from "@/lib/local-storage-async";
import { measureAndWarn } from "@/lib/perf-utils";
import type { UpdateResult } from "@/lib/character-service";

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

  // Repository + AutoSaveService instances (per hook instance)
  const repoRef = useRef<FirebaseCharacterRepository | null>(null);
  const autoSaveServiceRef = useRef<AutoSaveService<Partial<CharacterData>> | null>(null);
  
  // Callback ref for notifying when save succeeds (used by IdentityContext to clear dirtyFields)
  const onSaveSuccessRef = useRef<((savedFields: string[]) => void) | null>(null);

  /**
   * Improved fingerprint for change detection
   * Captures nested object values to avoid false positives
   * Must be defined before useEffect to be accessible
   */
  const getCheapFingerprint = (obj: Partial<CharacterData>): string => {
    // Create a deterministic, sorted serialization of the object and then a
    // fast non-crypto hash. This avoids collisions when values share the same
    // prefix (previously we only sliced the first 20 chars which caused false
    // identical fingerprints when users edited beyond that slice).
    if (!obj) return "";

    const normalize = (x: unknown): unknown => {
      if (x === null || typeof x !== "object") return x;
      if (Array.isArray(x)) return x.map(normalize);
      const out: Record<string, unknown> = {};
      Object.keys(x as Record<string, unknown>)
        .sort()
        .forEach((k) => {
          out[k] = normalize((x as Record<string, unknown>)[k]);
        });
      return out;
    };

    let str: string;
    try {
      str = JSON.stringify(normalize(obj));
    } catch {
      // Fall back to a simple join in pathological cases
      const keys = Object.keys(obj).sort();
      str = keys.map((k) => `${k}:${String((obj as Record<string, unknown>)[k])}`).join("|");
    }

    // FNV-1a 32-bit hash (fast, low-collision for small inputs)
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    }
    const hash = (h >>> 0).toString(36);

    // Include length to reduce collision chance even further
    return `${hash}:${str.length}`;
  };

  useEffect(() => {
    // instantiate repository and autosave service when userId/characterId available
    if (userId && characterId) {
      // Reset fingerprint when characterId changes to avoid false positives
      lastSavedDataRef.current = null;
      pendingObjRef.current = null;
      pendingFieldsRef.current = new Set();

      repoRef.current = new FirebaseCharacterRepository(userId);
      autoSaveServiceRef.current = new AutoSaveService(async (data) => {
        // enqueue a small patch update to BackgroundPersistence instead of calling repo directly.
        if (!repoRef.current) throw new Error("Repository not initialized");

        // Calculate fingerprint BEFORE save to update after success
        const fingerprint = getCheapFingerprint(data);

        // Extract fields that were saved (for dirtyFields cleanup)
        // Use accumulated pendingFieldsRef to capture ALL fields that were scheduled, not just the last patch
        // This handles the case where AutoSaveService coalesces multiple rapid saves
        const savedFields: string[] = Array.from(pendingFieldsRef.current);
        
        // Also extract from current data as fallback (in case pendingFieldsRef is empty)
        if (savedFields.length === 0 && data.identity && typeof data.identity === "object") {
          const identityFields = data.identity as unknown as Record<string, unknown>;
          Object.keys(identityFields).forEach((key) => {
            if (!savedFields.includes(key)) {
              savedFields.push(key);
            }
          });
        }

        // The task will call updateCharacter; if it returns a conflict result we throw so AutoSaveService can handle conflict flow.
        const res = await backgroundPersistence.enqueue(characterId, async () => {
          // Prefer lightweight patch for autosave to avoid transaction overhead
          if (repoRef.current && typeof repoRef.current.patchCharacter === "function") {
            await repoRef.current.patchCharacter(characterId, data as Partial<CharacterData>);
            return { success: true } as const;
          }

          // fallback to full update if patch not available
          return repoRef.current!.updateCharacter(characterId, data as Partial<CharacterData>);
        }, {
          priority: 5,
          maxRetries: 3,
          initialBackoffMs: 400,
          coalesceKey: "autosave-patch",
          shouldRetry: (err: unknown) => {
            // If err contains a conflict result (handled by updateCharacter returning { success: false }), we should NOT retry
            if (!err || typeof err !== "object") return true;
            try {
              const asObj = err as Record<string, unknown>;
              if (asObj["success"] === false) return false;
              if (Object.prototype.hasOwnProperty.call(asObj, "conflict")) return false;
            } catch {
              // ignore
            }
            return true;
          },
        });

        // Enqueue returns the UpdateResult; if it indicates conflict, rethrow to be handled upstream.
        if (res && typeof res === "object") {
          const asObj = res as Record<string, unknown>;
          if (asObj["success"] === false) {
            const err = new Error("conflict") as Error & { conflict?: CharacterDocument };
            err.conflict = asObj["conflict"] as CharacterDocument | undefined;
            throw err;
          }
        }

        // Return both fingerprint and saved fields to onSuccess callback
        return { fingerprint, savedFields };
      }, {
        debounceMs: 3000,
        onSuccess: (result?: unknown) => {
          // Update fingerprint ONLY after successful save
          let fingerprint: string | null = null;
          
          if (result && typeof result === "object") {
            const res = result as { fingerprint?: string; savedFields?: string[] };
            fingerprint = res.fingerprint ?? null;
          } else if (typeof result === "string") {
            // Backward compatibility: if result is just a string, treat as fingerprint
            fingerprint = result;
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
          const savedFingerprint = lastSavedDataRef.current;
          lastSavedDataRef.current = null;
          
          const maybeConflict = (err as Error & { conflict?: CharacterDocument }).conflict;
          if (maybeConflict) {
            console.warn("[auto-save] conflict (service)", maybeConflict);
          } else {
            console.error("[auto-save] error (service)", err, { savedFingerprint, pendingFields: Array.from(pendingFieldsRef.current) });
          }
        },
      });
    } else {
      repoRef.current = null;
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
      pendingObjRef.current = data;

      // Accumulate fields that are being scheduled for saving
      // This ensures we clear ALL dirtyFields even when AutoSaveService coalesces multiple saves
      if (data.identity && typeof data.identity === "object") {
        const identityFields = data.identity as unknown as Record<string, unknown>;
        Object.keys(identityFields).forEach((key) => {
          pendingFieldsRef.current.add(key);
        });
      }

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
      if (repoRef.current) return repoRef.current.saveCharacter(data, newCharacterId);
      // fallback to lib
      return CharacterService.saveCharacter(userId, data, newCharacterId);
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
          const fresh = await CharacterService.getCharacter(userId, charId);
          if (fresh) {
            try { setItemAsync(localStorageKey, fresh); } catch {}
            try { CharacterService.seedCharacterCache(userId, charId, fresh); } catch {}
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

          // Seed cache with stored data
          try { CharacterService.seedCharacterCache(userId, charId, stored); } catch {}

          if (isStale) {
            // Data is stale, fetch fresh data but don't block UI
            // Start fresh fetch immediately but return stored data
            console.debug("[loadCharacter] Stale data detected, fetching fresh in background", { charId });
            
            // Fetch fresh data (non-blocking but we'll wait a bit for it)
            const freshPromise = CharacterService.getCharacter(userId, charId).catch(() => null);
            
            // Wait up to 500ms for fresh data, then return stored if not ready
            const fresh = await Promise.race([
              freshPromise,
              new Promise<CharacterDocument | null>((resolve) => setTimeout(() => resolve(null), 500))
            ]);

            if (fresh) {
              // Fresh data arrived quickly, use it
              try { setItemAsync(localStorageKey, fresh); } catch {}
              try { CharacterService.seedCharacterCache(userId, charId, fresh); } catch {}
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
                  try { CharacterService.seedCharacterCache(userId, charId, fresh); } catch {}
                  console.debug("[loadCharacter] Fresh data arrived after initial load", { charId });
                  // Note: We can't update React state here, but cache is updated for next load
                }
              }).catch(() => {});
            }
          } else {
            // Data is fresh, return immediately and update in background
            (async () => {
              try {
                const fresh = await CharacterService.getCharacterCached(userId, charId, { staleWhileRevalidate: true });
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
        res = await CharacterService.getCharacterCached(userId, charId, { staleWhileRevalidate: false }); // Force fresh on first load
      } catch {
        // fallback to direct repo if available
        if (repoRef.current) res = await repoRef.current.getCharacter(charId);
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
    if (repoRef.current) return repoRef.current.listCharacters();
    return CharacterService.listCharacters(userId);
  }, [userId]);

  /**
   * Atualiza um personagem imediatamente
   */
  const saveImmediately = useCallback(
    async (updates: Partial<CharacterData>, options?: { baseVersion?: number }) => {
      if (!userId || !characterId) throw new Error("Dados incompletos");

      console.debug("[saveImmediately] start", { userId, characterId });
      let res: UpdateResult | void;
      if (repoRef.current) {
        res = await repoRef.current.updateCharacter(characterId, updates, { baseVersion: options?.baseVersion });
      } else {
        // legacy fallback (no version support)
        res = await libUpdateCharacter(userId, characterId, updates as Partial<CharacterData>);
      }

      if (res && res.success === false) {
        // Conflict returned - surface to caller
        console.warn("[saveImmediately] conflict detected", res.conflict);
        return res;
      }

      // Clear pending state since we just saved
      const getFp = (obj: Record<string, unknown>) => {
        const keys = Object.keys(obj).sort();
        const vals = keys.map((k) => {
          const v = obj[k];
          return typeof v === "object" && v !== null ? `obj${Object.keys(v as Record<string, unknown>).length}` : String(v).slice(0, 10);
        });
        return keys.join(":") + "|" + vals.join(":");
      };
      lastSavedDataRef.current = getFp(updates as Record<string, unknown>);
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
      if (repoRef.current) return repoRef.current.deleteCharacter(charId);
      return CharacterService.deleteCharacter(userId, charId);
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

  /**
   * Cria uma nova pasta
   */
  const createFolder = useCallback(async (name: string, parentId: string | null = null) => {
    if (!userId) throw new Error("Usuário não autenticado");
    const repo = new FirebaseCharacterRepository(userId);
    return repo.createFolder(name, parentId);
  }, [userId]);

  /**
   * Deleta uma pasta
   */
  const deleteFolder = useCallback(async (folderId: string) => {
    if (!userId) throw new Error("Usuário não autenticado");
    const repo = new FirebaseCharacterRepository(userId);
    return repo.deleteFolder(folderId);
  }, [userId]);

  /**
   * Move um personagem para uma pasta
   */
  const moveCharacterToFolder = useCallback(async (characterId: string, folderId: string | null) => {
    if (!userId) throw new Error("Usuário não autenticado");
    const repo = new FirebaseCharacterRepository(userId);
    return repo.moveCharacterToFolder(characterId, folderId);
  }, [userId]);

  /**
   * Escuta mudanças em tempo real nas pastas
   */
  const listenToFolders = useCallback((callback: (folders: CharacterService.Folder[]) => void) => {
    if (!userId) return () => {};
    const repo = new FirebaseCharacterRepository(userId);
    return repo.listenToFolders(callback);
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
