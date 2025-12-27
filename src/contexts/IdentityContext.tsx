"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";

export interface IdentityData {
  name: string;
  heroName: string;
  alternateIdentity: string;
  identityStatus: string; // Public, Secret
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
  identityStatus: "Secret",
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
  } = useCharacterPersistence(user?.uid ?? null, currentCharacterId ?? undefined);

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
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
    } catch {
      // ignore
    }

    // Auto-save (debounced) to Firestore when a character is selected
    if (currentCharacterId && user) {
      scheduleAutoSave({ identity });
    }
  }, [identity, currentCharacterId, user, scheduleAutoSave]);

  const updateIdentity = useCallback(
    <K extends keyof IdentityData>(field: K, value: IdentityData[K]) => {
      setIdentity((prev) => ({ ...prev, [field]: value }));
      // schedule auto-save if we have a character selected and a user
      if (currentCharacterId && user) {
        scheduleAutoSave({ identity: { ...identity, [field]: value } });
      }
    },
    [currentCharacterId, user, scheduleAutoSave, identity],
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
