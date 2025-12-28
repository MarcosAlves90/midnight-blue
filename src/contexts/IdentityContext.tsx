"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import { deepEqual } from "@/lib/deep-equal";

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

  // Rastreia o último estado enviado ao Firebase para detecção de mudanças
  const lastSavedRef = useRef<IdentityData | null>(null);
  const hasPendingChangesRef = useRef<boolean>(false);
  // Rastreia se é a primeira sincronização de uma nova ficha (não deve disparar auto-save)
  const isInitialSyncRef = useRef<boolean>(true);
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

  // Sincroniza com localStorage sempre
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
    } catch {
      // ignore
    }
  }, [identity]);

  // Atualiza a ref quando scheduleAutoSave muda
  useEffect(() => {
    scheduleAutoSaveRef.current = scheduleAutoSave;
  }, [scheduleAutoSave]);

  // Detecta mudanças na identity e dispara auto-save (com debounce via scheduleAutoSave)
  useEffect(() => {
    identityRef.current = identity;

    if (!currentCharacterId || !user || isInitialSyncRef.current) {
      return; // Não auto-save na primeira sincronização ou sem character selecionado
    }

    // Se mudou de ficha, reinicia sync inicial
    if (lastCharacterIdRef.current !== currentCharacterId) {
      lastCharacterIdRef.current = currentCharacterId;
      isInitialSyncRef.current = true;
      lastSavedRef.current = JSON.parse(JSON.stringify(identity));
      return;
    }

    // Se a identity mudou desde o último save, dispara auto-save
    if (!deepEqual(lastSavedRef.current, identity)) {
      hasPendingChangesRef.current = true;
      // scheduleAutoSave já tem seu próprio debounce de 3 segundos
      scheduleAutoSaveRef.current({ identity });
    }
  }, [identity, currentCharacterId, user]);

  const updateIdentity = useCallback(
    <K extends keyof IdentityData>(field: K, value: IdentityData[K]) => {
      setIdentity((prev) => {
        const next = { ...prev, [field]: value } as IdentityData;
        return next;
      });
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
