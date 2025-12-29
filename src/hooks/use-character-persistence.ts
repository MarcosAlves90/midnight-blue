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
import type { UpdateResult } from "@/lib/character-service";

export function useCharacterPersistence(
  userId: string | null,
  characterId?: string,
) {
  // Store last saved fingerprint to avoid repeated stringify costs
  const lastSavedDataRef = useRef<string | null>(null);
  const pendingObjRef = useRef<Partial<CharacterData> | null>(null);

  // Repository + AutoSaveService instances (per hook instance)
  const repoRef = useRef<FirebaseCharacterRepository | null>(null);
  const autoSaveServiceRef = useRef<AutoSaveService<Partial<CharacterData>> | null>(null);

  useEffect(() => {
    // instantiate repository and autosave service when userId/characterId available
    if (userId && characterId) {
      repoRef.current = new FirebaseCharacterRepository(userId);
      autoSaveServiceRef.current = new AutoSaveService(async (data) => {
        // enqueue a small patch update to BackgroundPersistence instead of calling repo directly.
        if (!repoRef.current) throw new Error("Repository not initialized");

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
      }, {
        debounceMs: 3000,
        onSuccess: () => {
          // Fingerprint is already updated in scheduleAutoSave
          console.debug("[auto-save] success (service)", { userId, characterId });
        },
        onError: (err: unknown) => {
          const maybeConflict = (err as Error & { conflict?: CharacterDocument }).conflict;
          if (maybeConflict) {
            console.warn("[auto-save] conflict (service)", maybeConflict);
          } else {
            console.error("[auto-save] error (service)", err);
          }
        },
      });
    } else {
      repoRef.current = null;
      autoSaveServiceRef.current = null;
    }

    return () => {
      // noop
    };
  }, [userId, characterId]);

  /**
   * Cheap fingerprint for change detection (avoids expensive JSON.stringify in hot path)
   */
  const getCheapFingerprint = (obj: Partial<CharacterData>): string => {
    if (!obj) return "";
    const keys = Object.keys(obj).sort();
    const values = keys.map((k) => {
      const v = (obj as Record<string, unknown>)[k];
      if (typeof v === "object" && v !== null) {
        return `obj${Object.keys(v as Record<string, unknown>).length}`;
      }
      return String(v).slice(0, 10);
    });
    return keys.join(":") + "|" + values.join(":");
  };

  /**
   * Schedule autosave with 3-second debounce
   * Uses cheap fingerprint for change detection (avoids JSON.stringify in hot path)
   */
  const scheduleAutoSave = useCallback(
    (data: Partial<CharacterData>) => {
      if (!userId || !characterId) return;

      const fingerprint = getCheapFingerprint(data);

      // Skip if identical to last saved
      if (lastSavedDataRef.current === fingerprint) {
        return;
      }

      // Store fingerprint for onSuccess callback
      lastSavedDataRef.current = fingerprint;
      pendingObjRef.current = data;

      // Delegate to AutoSaveService
      if (autoSaveServiceRef.current) {
        autoSaveServiceRef.current.schedule(data);
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
   */
  const loadCharacter = useCallback(
    async (charId: string): Promise<CharacterDocument | null> => {
      if (!userId) throw new Error("Usuário não autenticado");
      console.debug("[loadCharacter] fetching", { userId, charId });

      const perfKey = `loadCharacter:${charId}`;
      try {
        performance.mark(`${perfKey}-start`);
      } catch {
        // ignore
      }

      // Fast-path: attempt to restore a previously saved full document from localStorage to avoid
      // the initial network hit on startup. We still revalidate in background to keep it fresh.
      const localStorageKey = `midnight-current-character-doc:${charId}`;
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
          // seed in-memory cache so background revalidation won't immediately hit the network
          try { CharacterService.seedCharacterCache(userId, charId, stored); } catch {}

          // background refresh to update local cache + localStorage
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

          try { console.debug(`[perf] loadCharacter:${charId} restored from localStorage`); } catch {}
          return stored;
        }
      } catch {
        // ignore localStorage errors and fall through to network/cache
      }

      // prefer cached read with SWR behavior for quick responsiveness
      let res: CharacterDocument | null = null;
      try {
        res = await CharacterService.getCharacterCached(userId, charId, { staleWhileRevalidate: true });
      } catch {
        // fallback to direct repo if available
        if (repoRef.current) res = await repoRef.current.getCharacter(charId);
      }

      // Persist a fresh copy to localStorage for faster future restores (async)
      try {
        if (res) {
          try { setItemAsync(localStorageKey, res); } catch {}
        }
      } catch {
        // ignore
      }

      try {
        performance.mark(`${perfKey}-end`);
        performance.measure(perfKey, `${perfKey}-start`, `${perfKey}-end`);
        const m = performance.getEntriesByName(perfKey)[0];
        if (m && m.duration > 100) console.warn(`[perf] ${perfKey} took ${Math.round(m.duration)}ms`);
        performance.clearMarks(`${perfKey}-start`);
        performance.clearMarks(`${perfKey}-end`);
        performance.clearMeasures(perfKey);
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
  };
}
