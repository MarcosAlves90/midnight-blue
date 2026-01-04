"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useCharacterSheet } from "./CharacterSheetContext";
import type { CharacterDocument, CharacterData } from "@/lib/types/character";

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
  isSyncing: boolean;
  isReady: boolean;

  /** Conflict resolution APIs */
  conflict: null | { server: CharacterDocument; attempted: Partial<CharacterData> };
  resolveKeepLocal: () => Promise<void>;
  resolveUseServer: () => void;
  openConflictModal: () => void;
  closeConflictModal: () => void;
  subscribeToField: (field: string, cb: () => void) => () => void;
  getField: <K extends keyof IdentityData>(field: K) => IdentityData[K];
}

const IdentityContext = createContext<IdentityContextType | undefined>(
  undefined,
);

type IdentityActions = Pick<
  IdentityContextType,
  | "updateIdentity"
  | "setIdentity"
  | "setCurrentCharacterId"
  | "saveIdentityNow"
  | "markFieldDirty"
  | "markFieldsSaved"
  | "resolveKeepLocal"
  | "resolveUseServer"
  | "openConflictModal"
  | "closeConflictModal"
  | "subscribeToField"
  | "getField"
>;

const IdentityActionsContext = createContext<IdentityActions | undefined>(undefined);

export const useIdentityActions = () => {
  const ctx = useContext(IdentityActionsContext);
  if (!ctx) throw new Error("useIdentityActions must be used within IdentityProvider");
  return ctx;
};

export const IdentityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { 
    state, 
    updateIdentity: updateIdentitySheet, 
    dirtyFields, 
    isSyncing, 
    isReady,
    conflict, 
    resolveKeepLocal, 
    resolveUseServer,
    saveNow
  } = useCharacterSheet();

  const identity = state?.identity ?? INITIAL_IDENTITY;
  const hasLocalChanges = dirtyFields.size > 0;

  const fieldSubscribersRef = useRef<Map<string, Set<() => void>>>(new Map());
  const identityRef = useRef<IdentityData>(identity);

  useEffect(() => {
    const prev = identityRef.current;
    identityRef.current = identity;

    const changedFields: string[] = [];
    const prevRec = prev as unknown as Record<string, unknown>;
    const nextRec = identity as unknown as Record<string, unknown>;
    
    Object.keys(identity).forEach((key) => {
      if (prevRec[key] !== nextRec[key]) {
        changedFields.push(key);
      }
    });

    if (changedFields.length > 0) {
      changedFields.forEach((f) => {
        const subs = fieldSubscribersRef.current.get(f);
        if (subs) subs.forEach((cb) => cb());
      });
    }
  }, [identity]);

  const subscribeToField = useCallback((field: string, cb: () => void) => {
    let s = fieldSubscribersRef.current.get(field);
    if (!s) {
      s = new Set();
      fieldSubscribersRef.current.set(field, s);
    }
    s.add(cb);
    return () => {
      s!.delete(cb);
      if (s && s.size === 0) fieldSubscribersRef.current.delete(field);
    };
  }, []);

  const getField = useCallback(<K extends keyof IdentityData>(field: K) => {
    return identityRef.current[field];
  }, []);

  const updateIdentity = useCallback(<K extends keyof IdentityData>(field: K, value: IdentityData[K]) => {
    updateIdentitySheet({ [field]: value });
  }, [updateIdentitySheet]);

  const markFieldDirty = useCallback(() => {}, []);
  const markFieldsSaved = useCallback(() => {}, []);

  const contextValue = useMemo(
    () => ({
      identity,
      updateIdentity,
      setIdentity: () => {},
      currentCharacterId: null,
      setCurrentCharacterId: () => {},
      saveIdentityNow: saveNow,
      dirtyFields,
      markFieldDirty,
      markFieldsSaved,
      hasLocalChanges,
      isSyncing,
      isReady,
      conflict,
      resolveKeepLocal,
      resolveUseServer,
      openConflictModal: () => {},
      closeConflictModal: () => {},
      subscribeToField,
      getField,
    }),
    [
      identity,
      updateIdentity,
      saveNow,
      dirtyFields,
      markFieldDirty,
      markFieldsSaved,
      hasLocalChanges,
      isSyncing,
      isReady,
      conflict,
      resolveKeepLocal,
      resolveUseServer,
      subscribeToField,
      getField,
    ],
  );

  const actionsValue: IdentityActions = {
    updateIdentity,
    setIdentity: () => {},
    setCurrentCharacterId: () => {},
    saveIdentityNow: saveNow,
    markFieldDirty,
    markFieldsSaved,
    resolveKeepLocal,
    resolveUseServer,
    openConflictModal: () => {},
    closeConflictModal: () => {},
    subscribeToField,
    getField,
  };

  return (
    <IdentityActionsContext.Provider value={actionsValue}>
      <IdentityContext.Provider value={contextValue}>
        {children}
      </IdentityContext.Provider>
    </IdentityActionsContext.Provider>
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
