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

  // Reseta a flag quando o salvamento termina com sucesso
  useEffect(() => {
    if (!isSaving && hasPendingChangesRef.current) {
      // A identity será capturada no closure do context
      hasPendingChangesRef.current = false;
    }
  }, [isSaving]);

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

  // Simplified sync: delegate autosave to scheduleAutoSave (service handles debounce/coalesce)
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
      return;
    }

    // Delegate to the persistence hook's scheduleAutoSave (it will coalesce and debounce)
    try {
      scheduleAutoSave({ identity });
      hasPendingChangesRef.current = true;
    } catch {
      // scheduleAutoSave may be unavailable during init; ignore
    }
  }, [identity, currentCharacterId, user, scheduleAutoSave]);

  const updateIdentity = useCallback(
    <K extends keyof IdentityData>(field: K, value: IdentityData[K]) => {
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
    },
    [],
  );

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
