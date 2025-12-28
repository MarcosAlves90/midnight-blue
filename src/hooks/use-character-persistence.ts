import { useCallback, useRef, useEffect, useState } from "react";
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
import { AutoSaveService } from "@/services/auto-save";
import { backgroundPersistence } from "@/services/background-persistence";
import * as CharacterService from "@/lib/character-service";
import type { UpdateResult } from "@/lib/character-service";

export function useCharacterPersistence(
  userId: string | null,
  characterId?: string,
) {
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Store last saved snapshot as serialized string to avoid repeated stringify costs
  const lastSavedDataRef = useRef<string | null>(null);
  // Track in-flight save and queued pending save to avoid concurrent writes
  const inFlightRef = useRef<boolean>(false);
  const pendingSerializedRef = useRef<string | null>(null);
  const pendingObjRef = useRef<Partial<CharacterData> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
          return repoRef.current!.updateCharacter(characterId, data as Partial<CharacterData>);
        }, {
          priority: 5,
          maxRetries: 3,
          initialBackoffMs: 400,
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
        onSchedule: () => console.debug("[auto-save] scheduled (service)", { userId, characterId }),
        onExecute: () => console.debug("[auto-save] executing (service)", { userId, characterId }),
        onSuccess: () => console.debug("[auto-save] success (service)", { userId, characterId }),
        onError: (err: unknown) => {
          // detect conflict and surface it for higher-level handling
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
   * Inicia auto-save do personagem com debounce de 3 segundos
   * OTIMIZADO: Não envia dados idênticos (change detection)
   */
  const scheduleAutoSave = useCallback(
    (data: Partial<CharacterData>, onSaved?: () => void, onConflict?: (conflict: import("@/lib/character-service").CharacterDocument, attempted: Partial<CharacterData>) => Promise<{ action: "retry" } | { action: "retryWith"; data: Partial<CharacterData> } | { action: "abort" }>) => {
      if (!userId || !characterId) return;

      const serialized = JSON.stringify(data);

      // If nothing changed since last successful save and no pending different change, skip
      if (!inFlightRef.current && lastSavedDataRef.current === serialized) {
        console.debug("[auto-save] skip - data identical to last saved", { userId, characterId });
        return;
      }

      // Queue this payload as pending (coalescing multiple rapid updates)
      pendingSerializedRef.current = serialized;
      pendingObjRef.current = data;

      // delegate to AutoSaveService if available, forwarding onSaved and onConflict
      if (autoSaveServiceRef.current) {
        // 'onConflict' has a narrower conflict type here, cast to the generic signature expected by the service
        autoSaveServiceRef.current.schedule(data as Partial<CharacterData>, onSaved, onConflict as unknown as (conflict: unknown, attempted: Partial<CharacterData>) => Promise<{ action: "retry" } | { action: "retryWith"; data: Partial<CharacterData> } | { action: "abort" }>);
        return;
      }

      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      console.debug("[auto-save] scheduled in 3s", { userId, characterId });
      autoSaveTimeoutRef.current = setTimeout(async () => {
        // If a save is already in flight, do nothing here; the in-flight completion will check pending
        if (inFlightRef.current) {
          console.debug("[auto-save] execution deferred - another save in flight", { userId, characterId });
          return;
        }

        // Grab the latest pending snapshot
        const toSave = pendingObjRef.current;
        const toSaveSerialized = pendingSerializedRef.current;

        // clear pending now - if new updates arrive they'll set pending again
        pendingObjRef.current = null;
        pendingSerializedRef.current = null;

        if (!toSave || !toSaveSerialized) {
          return;
        }

        inFlightRef.current = true;
        setIsSaving(true);
        console.debug("[auto-save] executing (legacy)", { userId, characterId });

        try {
          let res: UpdateResult | void;
          if (repoRef.current) {
            res = await repoRef.current.updateCharacter(characterId, toSave as Partial<CharacterData>);
          } else {
            res = await CharacterService.updateCharacter(userId, characterId, toSave as Partial<CharacterData>);
          }

          if (res && res.success === false) {
            // Conflict detected - log and surface
            console.warn("[auto-save] conflict detected (legacy)", res.conflict);
            // leave pendingObj as-is so user can decide how to resolve later
          } else {
            // mark successful save
            lastSavedDataRef.current = toSaveSerialized;

            // Notify caller that save completed
            try {
              onSaved?.();
            } catch {
              // ignore callback errors
            }
          }
        } catch (error) {
          console.error("Erro no auto-save:", error);
        } finally {
          setIsSaving(false);
          inFlightRef.current = false;

          // If there is a pending newer change, schedule it immediately (no extra delay)
          if (pendingSerializedRef.current && pendingSerializedRef.current !== lastSavedDataRef.current) {
            console.debug("[auto-save] pending change detected - scheduling immediate save (legacy)", { userId, characterId });
            if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
            autoSaveTimeoutRef.current = setTimeout(() => {
              // Re-run schedule with the already queued pendingObj (it will take latest pending)
              scheduleAutoSave(pendingObjRef.current || toSave);
            }, 0);
          }
        }
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
      if (repoRef.current) return repoRef.current.getCharacter(charId);
      return CharacterService.getCharacter(userId, charId);
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

      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

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

      // Clear pending timeout and update lastSavedDataRef to reflect the saved state
      lastSavedDataRef.current = JSON.stringify(updates);
      // Clear any pending queued data since we just saved
      pendingObjRef.current = null;
      pendingSerializedRef.current = null;

      // if there's an autoSaveService, clear its pending state as well by scheduling a flush
      if (autoSaveServiceRef.current) {
        // ensure service knows about the last saved state
        autoSaveServiceRef.current.markSaved(JSON.stringify(updates));
      }

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

  // Limpa timeout ao desmontar
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

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
    isSaving,
  };
}
