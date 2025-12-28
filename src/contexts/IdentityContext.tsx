"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  startTransition,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";


export interface IdentityData {
  name: string;
  heroName: string;
  alternateIdentity: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  eyes: string;
  hair: string;
  groupAffiliation: string;
  baseOfOperations: string;
  powerOrigin: string;
  motivation: string;
  placeOfBirth: string;
  occupation: string;
  favoriteColor: string;
  profileImage?: string;
  imagePosition?: number;
  history: string;
  complications: Complication[];
}

export interface Complication {
  id: string;
  name: string;
  description: string;
}

const INITIAL_IDENTITY: IdentityData = {
  name: "",
  heroName: "",
  alternateIdentity: "",
  gender: "",
  age: "",
  height: "",
  weight: "",
  eyes: "",
  hair: "",
  groupAffiliation: "",
  baseOfOperations: "",
  powerOrigin: "",
  motivation: "",
  placeOfBirth: "",
  occupation: "",
  favoriteColor: "#1e3a8a", // midnight blue theme
  profileImage: "",
  imagePosition: 50, // Center (50%)
  history: "",
  complications: [],
};

interface IdentityContextType {
  identity: IdentityData;
  updateIdentity: <K extends keyof IdentityData>(
    field: K,
    value: IdentityData[K],
  ) => void;
  setIdentity: React.Dispatch<React.SetStateAction<IdentityData>>;
  currentCharacterId?: string | null;
  setCurrentCharacterId: (id: string | null) => void;
  saveIdentityNow: () => Promise<void>;
  /** Tracking of per-field dirty state (local edits not yet acknowledged) */
  dirtyFields: Set<string>;
  markFieldDirty: (field: string) => void;
  markFieldsSaved: (fields: string[]) => void;
  hasLocalChanges: boolean;

  /** Conflict resolution APIs */
  conflict: null | { server: import("@/lib/character-service").CharacterDocument; attempted: Partial<import("@/lib/character-service").CharacterData> };
  resolveKeepLocal: () => Promise<void>;
  resolveUseServer: () => void;
  openConflictModal: () => void;
  closeConflictModal: () => void;
}

const IdentityContext = createContext<IdentityContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "midnight-identity";
const CURRENT_CHAR_KEY = "midnight-current-character-id";

export const IdentityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [identity, setIdentity] = useState<IdentityData>(INITIAL_IDENTITY);
  const [currentCharacterId, setCurrentCharacterIdState] = useState<string | null>(null);

  // Per-field dirty tracking (fields modified locally but not yet acknowledged by the server)
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());
  const hasLocalChanges = dirtyFields.size > 0;

  // Conflict state (when a save conflicts with server and couldn't be auto-resolved)
  const [conflict, setConflict] = useState<null | { server: import("@/lib/character-service").CharacterDocument; attempted: Partial<import("@/lib/character-service").CharacterData> }>(null);
  const [, setConflictModalOpen] = useState(false);

  const { user } = useAuth();
  const {
    scheduleAutoSave,
    saveImmediately,
    isSaving,
  } = useCharacterPersistence(user?.uid ?? null, currentCharacterId ?? undefined);

  // Rastreia o último snapshot serializado enviado ao Firebase para detecção de mudanças
  const lastSavedRef = useRef<string | null>(null);
  const hasPendingChangesRef = useRef<boolean>(false);
  const lastCharacterIdRef = useRef<string | null>(null);
  // Rastreia a função scheduleAutoSave para evitar incluir na dependência do efeito
  const scheduleAutoSaveRef = useRef(scheduleAutoSave);
  // Rastreia a identity atual para detecção de mudanças SEM depender do efeito
  const identityRef = useRef<IdentityData>(identity);

  // Reseta a flag quando o salvamento termina com sucesso e limpa dirtyFields quando o autosave confirma
  useEffect(() => {
    if (!isSaving && hasPendingChangesRef.current) {
      // The persistence hook completed a save; clear the pending flag
      hasPendingChangesRef.current = false;
      // When a save completes successfully, treat dirtyFields as acknowledged
      setDirtyFields(new Set());
    }
  }, [isSaving]);

  // Dev-only long-task monitor for diagnosing expensive handlers
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // dynamic import to avoid require lint rule and keep code-splitting
      import("@/lib/perf-monitor")
        .then((m) => m.startDevLongTaskMonitor?.())
        .catch(() => {
          // ignore
        });
    }
  }, []);



  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setIdentity({ ...INITIAL_IDENTITY, ...parsed });
      }
    } catch {
      // ignore
    }

    // restore last selected character id if present
    try {
      const storedChar = localStorage.getItem(CURRENT_CHAR_KEY);
      if (storedChar) setCurrentCharacterIdState(storedChar);
    } catch {
      // ignore
    }
  }, []);

  // Sincroniza com localStorage de forma assíncrona / debounced
  const localStorageWriteRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Save function
    const save = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
      } catch {
        // ignore
      }
    };

    // Cross-browser helper for idle callback with typed access
    const win = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof window !== "undefined" && typeof win.requestIdleCallback === "function") {
      const idleId = win.requestIdleCallback!(save, { timeout: 1500 });
      return () => {
        try {
          win.cancelIdleCallback?.(idleId);
        } catch {
          // ignore
        }
      };
    }

    // Fallback: debounce write by 700ms
    if (localStorageWriteRef.current) {
      clearTimeout(localStorageWriteRef.current);
    }
    localStorageWriteRef.current = window.setTimeout(() => {
      save();
      localStorageWriteRef.current = undefined;
    }, 700) as unknown as number;

    return () => {
      if (localStorageWriteRef.current) {
        clearTimeout(localStorageWriteRef.current);
        localStorageWriteRef.current = undefined;
      }
    };
  }, [identity]);

  // Atualiza a ref quando scheduleAutoSave muda
  useEffect(() => {
    scheduleAutoSaveRef.current = scheduleAutoSave;
  }, [scheduleAutoSave]);

  // Manage persisted state without triggering expensive work on every identity change.
  // We keep a ref to the identity snapshot for conflict handling and only run light per-field patches on updates.
  useEffect(() => {
    identityRef.current = identity;

    if (!currentCharacterId || !user) {
      return; // nothing to do without character/user
    }

    // If the character changed, mark current state as already saved to avoid an immediate redundant save
    if (lastCharacterIdRef.current !== currentCharacterId) {
      lastCharacterIdRef.current = currentCharacterId;
      try {
        lastSavedRef.current = JSON.stringify(identity);
      } catch {
        lastSavedRef.current = null;
      }
      hasPendingChangesRef.current = false;
      // clear dirtyFields on character switch
      setDirtyFields(new Set());
      return;
    }

    // Do NOT schedule a full-object save here. Field updates call scheduleAutoSave directly (see updateIdentity).
  }, [identity, currentCharacterId, user]);

  // Stable conflict handler reused by per-field saves
  const handleConflict = useCallback(async (conflict: unknown, attempted: Partial<import("@/lib/character-service").CharacterData>) => {
    const server = conflict as import("@/lib/character-service").CharacterDocument;

    // build merged identity: start from server and overlay local dirty fields
    const mergedIdentity = { ...(server.identity || {}) } as unknown as IdentityData;
    try {
      const local = identityRef.current;
      dirtyFields.forEach((field) => {
        (mergedIdentity as unknown as Record<string, unknown>)[field] = (local as unknown as Record<string, unknown>)[field];
      });
    } catch {
      // ignore merge errors
    }

    // Attempt to save merged identity using the server's version as baseVersion
    try {
      const res = await saveImmediately({ identity: mergedIdentity }, { baseVersion: server.version });
      if (res && (res as import("@/lib/character-service").UpdateResult).success === false) {
        // still conflict or failed - show manual resolver to the user
        setConflict({ server, attempted: attempted as Partial<import("@/lib/character-service").CharacterData> });
        setConflictModalOpen(true);
        return { action: "abort" } as const;
      }

      // Success - clear dirty flags (we merged local changes into server and saved)
      setDirtyFields(new Set());
      return { action: "abort" } as const;
    } catch {
      // Couldn't resolve automatically - surface conflict
      setConflict({ server, attempted: attempted as Partial<import("@/lib/character-service").CharacterData> });
      setConflictModalOpen(true);
      return { action: "abort" } as const;
    }
  }, [dirtyFields, saveImmediately]);

  const updateIdentity = useCallback(
    <K extends keyof IdentityData>(field: K, value: IdentityData[K]) => {
      // mark as dirty immediately when a field is updated locally
      try {
        setDirtyFields((prev) => {
          if (prev.has(String(field))) return prev;
          const next = new Set(prev);
          next.add(String(field));
          return next;
        });
      } catch {
        // ignore
      }

      // Use startTransition to mark state updates as non-urgent to avoid blocking UI
      try {
        startTransition(() => {
          setIdentity((prev) => {
            const next = { ...prev, [field]: value } as IdentityData;
            return next;
          });
        });
      } catch {
        // Fallback if startTransition is not available
        setIdentity((prev) => ({ ...prev, [field]: value } as IdentityData));
      }

      // Schedule a lightweight per-field patch save (avoid serializing the whole identity on every keystroke)
      try {
        // construct small patch for the changed field
        const patch = { identity: { [field]: value } as Partial<IdentityData> } as Partial<import("@/lib/character-service").CharacterData>;
        // onSaved: clear dirty flags and update lastSaved snapshot
        const onSaved = () => {
          setDirtyFields(new Set());
          try {
            lastSavedRef.current = JSON.stringify(identityRef.current);
          } catch {
            lastSavedRef.current = null;
          }
          hasPendingChangesRef.current = false;
        };

        // Use the scheduleAutoSave ref to avoid re-render dependency
        try {
          scheduleAutoSaveRef.current?.(patch, onSaved, handleConflict);
          hasPendingChangesRef.current = true;
        } catch {
          // ignore scheduling errors
        }
      } catch {
        // swallow errors in scheduling
      }
    },
    [handleConflict],
  );

  const markFieldDirty = (field: string) => {
    setDirtyFields((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  };

  const markFieldsSaved = (fields: string[]) => {
    if (!fields || fields.length === 0) return;
    setDirtyFields((prev) => {
      const next = new Set(prev);
      fields.forEach((f) => next.delete(f));
      return next;
    });
  };

  const resolveKeepLocal = async () => {
    if (!conflict) return;
    try {
      // Force-apply the local attempted payload (no baseVersion) to overwrite server
      await saveImmediately(conflict.attempted as Partial<import("@/lib/character-service").CharacterData>);
      setDirtyFields(new Set());
      setConflict(null);
      setConflictModalOpen(false);
    } catch (e) {
      console.error("Failed to force-save local changes:", e);
    }
  };

  const resolveUseServer = () => {
    if (!conflict) return;
    // Accept server snapshot: apply server.identity and clear dirty flags
    setIdentity((prev) => ({ ...prev, ...(conflict.server.identity || {}) } as IdentityData));
    setDirtyFields(new Set());
    setConflict(null);
    setConflictModalOpen(false);
  };

  const openConflictModal = () => setConflictModalOpen(true);
  const closeConflictModal = () => setConflictModalOpen(false);

  const setCurrentCharacterId = (id: string | null) => {
    setCurrentCharacterIdState(id);
    try {
      if (id) localStorage.setItem(CURRENT_CHAR_KEY, id);
      else localStorage.removeItem(CURRENT_CHAR_KEY);
    } catch {
      // ignore
    }
  };

  const saveIdentityNow = async () => {
    if (!user || !currentCharacterId) return;
    try {
      await saveImmediately({ identity });
      // Atualiza lastSavedRef após salvar manualmente
      lastSavedRef.current = JSON.parse(JSON.stringify(identity));
      hasPendingChangesRef.current = false;
      // clear dirty flags for fields saved
      setDirtyFields(new Set());
    } catch (e) {
      console.error("Falha ao salvar identidade:", e);
    }
  };

  return (
    <IdentityContext.Provider
      value={{
        identity,
        updateIdentity,
        setIdentity,
        currentCharacterId,
        setCurrentCharacterId,
        saveIdentityNow,
        dirtyFields,
        markFieldDirty,
        markFieldsSaved,
        hasLocalChanges,
        conflict,
        resolveKeepLocal,
        resolveUseServer,
        openConflictModal,
        closeConflictModal,
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
};

export const useIdentityContext = () => {
  const context = useContext(IdentityContext);
  if (context === undefined) {
    throw new Error(
      "useIdentityContext must be used within a IdentityProvider",
    );
  }
  return context;
};
