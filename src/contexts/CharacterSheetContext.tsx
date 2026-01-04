"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useCharacter } from "./CharacterContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import type { CharacterDocument, CharacterData } from "@/lib/types/character";
import type { IdentityData } from "./IdentityContext";
import type { Attribute } from "@/components/pages/status/attributes-grid/types";
import type { Skill } from "@/components/pages/status/skills/types";
import type { Power } from "@/components/pages/status/powers/types";

interface CharacterSheetState {
  identity: IdentityData;
  attributes: Attribute[];
  skills: Skill[];
  powers: Power[];
  status: CharacterDocument["status"];
  customDescriptors: string[];
}

interface CharacterSheetContextType {
  state: CharacterSheetState | null;
  isSyncing: boolean;
  isReady: boolean;
  dirtyFields: Set<string>;
  
  // Conflict resolution
  conflict: null | { server: CharacterDocument; attempted: Partial<CharacterData> };
  resolveKeepLocal: () => Promise<void>;
  resolveUseServer: () => void;

  // Actions
  updateIdentity: (updates: Partial<IdentityData>) => void;
  updateAttributes: (attributes: Attribute[]) => void;
  updateSkills: (skills: Skill[]) => void;
  updatePowers: (powers: Power[]) => void;
  updateStatus: (status: Partial<CharacterSheetState["status"]>) => void;
  updateCustomDescriptors: (descriptors: string[]) => void;
  
  // Persistence
  saveNow: () => Promise<void>;
}

const CharacterSheetContext = createContext<CharacterSheetContextType | undefined>(undefined);

export function CharacterSheetProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { selectedCharacter } = useCharacter();
  
  const [state, setState] = useState<CharacterSheetState | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());
  const [conflict, setConflict] = useState<null | { server: CharacterDocument; attempted: Partial<CharacterData> }>(null);

  const { scheduleAutoSave, saveImmediately, setOnSaveSuccess } = useCharacterPersistence(
    user?.uid ?? null,
    selectedCharacter?.id
  );

  // Setup save success callback
  useEffect(() => {
    setOnSaveSuccess((fields) => {
      setIsSyncing(false);
      setDirtyFields((prev) => {
        const next = new Set(prev);
        fields.forEach(f => next.delete(f));
        return next;
      });
    });
    return () => setOnSaveSuccess(null);
  }, [setOnSaveSuccess]);

  const resolveKeepLocal = useCallback(async () => {
    if (!conflict || !selectedCharacter?.id) return;
    try {
      await saveImmediately(conflict.attempted as Partial<CharacterData>);
      setConflict(null);
    } catch (e) {
      console.error("Failed to resolve conflict (keep local):", e);
    }
  }, [conflict, selectedCharacter?.id, saveImmediately]);

  const resolveUseServer = useCallback(() => {
    if (!conflict) return;
    setState({
      identity: conflict.server.identity,
      attributes: conflict.server.attributes,
      skills: conflict.server.skills,
      powers: conflict.server.powers,
      status: conflict.server.status,
      customDescriptors: conflict.server.customDescriptors,
    });
    setDirtyFields(new Set());
    setConflict(null);
  }, [conflict]);

  const characterIdRef = useRef<string | null>(null);
  const lastSyncedRef = useRef<string | null>(null);

  // Initialize and sync state from selectedCharacter
  useEffect(() => {
    if (!selectedCharacter) {
      setState(null);
      characterIdRef.current = null;
      lastSyncedRef.current = null;
      return;
    }

    const idChanged = characterIdRef.current !== selectedCharacter.id;
    const currentHash = JSON.stringify({
      identity: selectedCharacter.identity,
      attributes: selectedCharacter.attributes,
      skills: selectedCharacter.skills,
      powers: selectedCharacter.powers,
      status: selectedCharacter.status,
      customDescriptors: selectedCharacter.customDescriptors,
    });
    const dataChanged = lastSyncedRef.current !== currentHash;

    if (!idChanged && !dataChanged) return;

    characterIdRef.current = selectedCharacter.id;
    lastSyncedRef.current = currentHash;

    setState(prev => {
      if (!prev || idChanged) {
        return {
          identity: selectedCharacter.identity,
          attributes: selectedCharacter.attributes,
          skills: selectedCharacter.skills,
          powers: selectedCharacter.powers,
          status: selectedCharacter.status,
          customDescriptors: selectedCharacter.customDescriptors,
        };
      }

      // Merge only non-dirty fields
      const next = { ...prev };
      
      if (!dirtyFields.has("attributes")) next.attributes = selectedCharacter.attributes;
      if (!dirtyFields.has("skills")) next.skills = selectedCharacter.skills;
      if (!dirtyFields.has("powers")) next.powers = selectedCharacter.powers;
      if (!dirtyFields.has("customDescriptors")) next.customDescriptors = selectedCharacter.customDescriptors;
      
      // Identity merge
      const nextIdentity = { ...selectedCharacter.identity };
      (Object.keys(prev.identity) as Array<keyof IdentityData>).forEach((key) => {
        if (dirtyFields.has(`identity.${key}`)) {
          Object.assign(nextIdentity, { [key]: prev.identity[key] });
        }
      });
      next.identity = nextIdentity;

      // Status merge
      const nextStatus = { ...selectedCharacter.status };
      (Object.keys(prev.status) as Array<keyof CharacterDocument["status"]>).forEach((key) => {
        if (dirtyFields.has(`status.${key}`)) {
          Object.assign(nextStatus, { [key]: prev.status[key] });
        }
      });
      next.status = nextStatus;

      return next;
    });

    if (idChanged) setDirtyFields(new Set());
  }, [selectedCharacter, dirtyFields]);

  const isReady = useMemo(() => {
    if (!selectedCharacter) return false;
    return state !== null && characterIdRef.current === selectedCharacter.id;
  }, [state, selectedCharacter]);

  const updateState = useCallback((updates: Partial<CharacterSheetState>) => {
    setState(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      
      // Track dirty fields
      const newDirty = new Set(dirtyFields);
      Object.keys(updates).forEach(key => newDirty.add(key));
      setDirtyFields(newDirty);
      setIsSyncing(true);
      
      // Schedule save
      scheduleAutoSave(updates as Partial<CharacterData>);
      
      return next;
    });
  }, [dirtyFields, scheduleAutoSave]);

  const actions = useMemo(() => ({
    updateIdentity: (identity: Partial<IdentityData>) => {
      setState(prev => {
        if (!prev) return prev;
        const nextIdentity = { ...prev.identity, ...identity };
        
        const newDirty = new Set(dirtyFields);
        Object.keys(identity).forEach(key => newDirty.add(`identity.${key}`));
        setDirtyFields(newDirty);
        setIsSyncing(true);
        
        scheduleAutoSave({ identity: nextIdentity });
        return { ...prev, identity: nextIdentity };
      });
    },
    updateAttributes: (attributes: Attribute[]) => updateState({ attributes }),
    updateSkills: (skills: Skill[]) => updateState({ skills }),
    updatePowers: (powers: Power[]) => updateState({ powers }),
    updateStatus: (status: Partial<CharacterSheetState["status"]>) => {
      setState(prev => {
        if (!prev) return prev;
        const nextStatus = { ...prev.status, ...status };
        
        const newDirty = new Set(dirtyFields);
        Object.keys(status).forEach(key => newDirty.add(`status.${key}`));
        setDirtyFields(newDirty);
        setIsSyncing(true);
        
        scheduleAutoSave({ status: nextStatus });
        return { ...prev, status: nextStatus };
      });
    },
    updateCustomDescriptors: (customDescriptors: string[]) => updateState({ customDescriptors }),
    saveNow: async () => {
      if (!state || !selectedCharacter?.id) return;
      await saveImmediately(state as Partial<CharacterData>);
    },
    resolveKeepLocal,
    resolveUseServer,
  }), [state, selectedCharacter?.id, dirtyFields, scheduleAutoSave, saveImmediately, updateState, resolveKeepLocal, resolveUseServer]);

  const value = useMemo(() => ({
    state,
    isSyncing,
    isReady,
    dirtyFields,
    conflict,
    ...actions
  }), [state, isSyncing, isReady, dirtyFields, conflict, actions]);

  return (
    <CharacterSheetContext.Provider value={value}>
      {children}
    </CharacterSheetContext.Provider>
  );
}

export function useCharacterSheet() {
  const context = useContext(CharacterSheetContext);
  if (context === undefined) {
    throw new Error("useCharacterSheet must be used within a CharacterSheetProvider");
  }
  return context;
}
