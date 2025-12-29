"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  startTransition,
  useMemo,
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
  } = useCharacterPersistence(user?.uid ?? null, currentCharacterId ?? undefined);

  // Rastreia o último snapshot serializado enviado ao Firebase para detecção de mudanças
  const lastSavedRef = useRef<string | null>(null);
  const hasPendingChangesRef = useRef<boolean>(false);
  const lastCharacterIdRef = useRef<string | null>(null);
  // Rastreia a função scheduleAutoSave para evitar incluir na dependência do efeito
  const scheduleAutoSaveRef = useRef(scheduleAutoSave);
  // Rastreia a identity atual para detecção de mudanças SEM depender do efeito
  const identityRef = useRef<IdentityData>(identity);




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

  // Sincroniza com localStorage de forma assíncrona
  useEffect(() => {
    // Save asynchronously via helper to avoid duplicating idle logic
    try {
      import("@/lib/local-storage-async").then((m) => m.setItemAsync(STORAGE_KEY, identity)).catch(() => {});
    } catch {
      // ignore
    }

    return () => {
      // nothing to clean up (async writer handles coalescing/cleanup)
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
        
        // Use the scheduleAutoSave ref to delegate conflict handling to higher level
        try {
          scheduleAutoSaveRef.current?.(patch);
          hasPendingChangesRef.current = true;
        } catch {
          // ignore scheduling errors
        }
      } catch {
        // swallow errors in scheduling
      }
    },
    [/* userId and characterId are from props, not state triggers */],
  );

  const markFieldDirty = useCallback((field: string) => {
    setDirtyFields((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  }, []);

  const markFieldsSaved = useCallback((fields: string[]) => {
    if (!fields || fields.length === 0) return;
    setDirtyFields((prev) => {
      const next = new Set(prev);
      fields.forEach((f) => next.delete(f));
      return next;
    });
  }, []);

  const resolveKeepLocal = useCallback(async () => {
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
  }, [conflict, saveImmediately]);

  const resolveUseServer = useCallback(() => {
    if (!conflict) return;
    // Accept server snapshot: apply server.identity and clear dirty flags
    setIdentity((prev) => ({ ...prev, ...(conflict.server.identity || {}) } as IdentityData));
    setDirtyFields(new Set());
    setConflict(null);
    setConflictModalOpen(false);
  }, [conflict]);

  const openConflictModal = useCallback(() => setConflictModalOpen(true), []);
  const closeConflictModal = useCallback(() => setConflictModalOpen(false), []);

  const setCurrentCharacterId = useCallback((id: string | null) => {
    setCurrentCharacterIdState(id);
    try {
      if (id) {
        import("@/lib/local-storage-async").then((m) => m.setStringItemAsync(CURRENT_CHAR_KEY, id)).catch(() => {});
      } else {
        import("@/lib/local-storage-async").then((m) => m.removeItemAsync(CURRENT_CHAR_KEY)).catch(() => {});
      }
    } catch {
      // ignore
    }
  }, []);

  const saveIdentityNow = useCallback(async () => {
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
  }, [user, currentCharacterId, saveImmediately, identity]);

  // Memoize context value to prevent unnecessary re-renders of subscribers
  const contextValue = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  return (
    <IdentityContext.Provider value={contextValue}>
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
