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
  defenses?: CharacterDocument["defenses"];
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
  updateAttributes: (updater: Attribute[] | ((prev: Attribute[]) => Attribute[])) => void;
  updateSkills: (updater: Skill[] | ((prev: Skill[]) => Skill[])) => void;
  updatePowers: (updater: Power[] | ((prev: Power[]) => Power[])) => void;
  updateStatus: (status: Partial<CharacterSheetState["status"]>) => void;
  updateDefenses: (updater: CharacterDocument["defenses"] | ((prev: CharacterDocument["defenses"] | undefined) => CharacterDocument["defenses"] | undefined)) => void;
  markFieldDirty: (field: string) => void;
  updateCustomDescriptors: (updater: string[] | ((prev: string[]) => string[])) => void;
  
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

  // Watchdog para evitar spinner infinito em caso de erro não capturado
  useEffect(() => {
    if (!isSyncing) return;
    const timeout = setTimeout(() => {
      console.warn("[CharacterSheet] Syncing watchdog: Forçando encerramento do indicador de sincronização.");
      setIsSyncing(false);
    }, 15000); // 15 segundos de segurança
    return () => clearTimeout(timeout);
  }, [isSyncing]);

  // Se o personagem selecionado pertencer a outro usuário (Admin mode), usamos o userId dono da ficha
  const persistenceUserId = selectedCharacter?.userId ?? user?.uid ?? null;

  const { scheduleAutoSave, saveImmediately, setOnSaveSuccess, setOnSaveError } = useCharacterPersistence(
    persistenceUserId,
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

    // Handle autosave errors/conflicts
    setOnSaveError((payload: { type: "conflict" | "error"; server?: CharacterDocument; attempted?: Partial<CharacterData>; error?: unknown }) => {
      console.debug("[CharacterSheet] onSaveError callback", payload);
      setIsSyncing(false);
      if (payload.type === "conflict" && payload.server) {
        setConflict({ server: payload.server, attempted: (payload.attempted as Partial<CharacterData>) ?? {} });
      }
    });

    return () => {
      setOnSaveSuccess(null);
      setOnSaveError(null);
    };
  }, [setOnSaveSuccess, setOnSaveError, dirtyFields]);

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
      defenses: conflict.server.defenses,
      customDescriptors: conflict.server.customDescriptors,
    });
    setDirtyFields(new Set());
    setConflict(null);
  }, [conflict]);

  const characterIdRef = useRef<string | null>(null);
  const lastSyncedRef = useRef<string | null>(null);
  const stateRef = useRef<CharacterSheetState | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
      defenses: selectedCharacter.defenses,
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
          defenses: selectedCharacter.defenses,
          customDescriptors: selectedCharacter.customDescriptors,
        };
      }

      // Mescla apenas campos que não estão sujos localmente
      const next = { ...prev };
      
      if (!dirtyFields.has("attributes")) next.attributes = selectedCharacter.attributes;

      // Simplificando: Sincroniza perícias somente se a seção inteira não estiver suja
      if (!dirtyFields.has("skills")) {
        next.skills = selectedCharacter.skills;
      }

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

      // Defenses merge 
      if (!dirtyFields.has("defenses")) {
        next.defenses = selectedCharacter.defenses;
      }

      return next;
    });

    if (idChanged) setDirtyFields(new Set());
  }, [selectedCharacter, dirtyFields]);

  const isReady = useMemo(() => {
    if (!selectedCharacter) return false;
    return state !== null && characterIdRef.current === selectedCharacter.id;
  }, [state, selectedCharacter]);

  const updateState = useCallback((updates: Partial<CharacterSheetState> | ((prev: CharacterSheetState) => Partial<CharacterSheetState>)) => {
    setState(prev => {
      if (!prev) {
        console.warn("[CharacterSheet] updateState ignorado: state é null");
        return prev;
      }
      
      const nextUpdates = typeof updates === "function" ? updates(prev) : updates;
      
      // Detecção de mudança real para evitar disparos desnecessários
      const hasChanges = Object.keys(nextUpdates).some(k => {
        const key = k as keyof CharacterSheetState;
        const isDiff = JSON.stringify(nextUpdates[key]) !== JSON.stringify(prev[key]);
        return isDiff;
      });

      if (!hasChanges) {
        return prev;
      }

      console.debug("[CharacterSheet] updateState - Iniciando sincronização", {
        fields: Object.keys(nextUpdates),
        skillsChanged: !!nextUpdates.skills
      });
      
      setIsSyncing(true);

      setDirtyFields(d => {
        const n = new Set(d);
        Object.keys(nextUpdates).forEach(k => {
          n.add(k);
          const val = nextUpdates[k as keyof CharacterSheetState];
          if (val && typeof val === "object" && !Array.isArray(val)) {
            Object.keys(val).forEach(subK => n.add(`${k}.${subK}`));
          }
        });
        return n;
      });

      const nextState = { ...prev, ...nextUpdates };
      stateRef.current = nextState; // Atualização imediata do ref para evitar lag em chamadas subsequentes

      // Agenda o salvamento
      scheduleAutoSave(nextUpdates as Partial<CharacterData>);
      
      return nextState;
    });
  }, [scheduleAutoSave]);

  const updateIdentity = useCallback((identity: Partial<IdentityData> | ((prev: IdentityData) => Partial<IdentityData>)) => {
    setState(prev => {
      if (!prev) return prev;
      const nextIdentityUpdates = typeof identity === "function" ? identity(prev.identity) : identity;
      
      const realChanges: Partial<IdentityData> = {};
      let hasChanges = false;
      
      Object.keys(nextIdentityUpdates).forEach(k => {
        const key = k as keyof IdentityData;
        if (nextIdentityUpdates[key] !== prev.identity[key]) {
          (realChanges as Record<string, unknown>)[key] = nextIdentityUpdates[key];
          hasChanges = true;
        }
      });

      if (!hasChanges) return prev;

      console.debug("[CharacterSheet] updateIdentity - Sincronizando", Object.keys(realChanges));
      setIsSyncing(true);

      const nextIdentity = { ...prev.identity, ...realChanges };
      
      setDirtyFields(d => {
        const n = new Set(d);
        Object.keys(realChanges).forEach(k => n.add(`identity.${k}`));
        return n;
      });

      const nextState = { ...prev, identity: nextIdentity };
      stateRef.current = nextState;
      scheduleAutoSave({ identity: nextIdentity });
      return nextState;
    });
  }, [scheduleAutoSave]);

  const updateStatus = useCallback((status: Partial<CharacterSheetState["status"]> | ((prev: CharacterSheetState["status"]) => Partial<CharacterSheetState["status"]>)) => {
    setState(prev => {
      if (!prev) return prev;
      const nextStatusUpdates = typeof status === "function" ? status(prev.status) : status;
      
      const realChanges: Partial<CharacterSheetState["status"]> = {};
      let hasChanges = false;
      
      Object.keys(nextStatusUpdates).forEach(k => {
        const key = k as keyof CharacterSheetState["status"];
        if (nextStatusUpdates[key] !== prev.status[key]) {
          (realChanges as Record<string, unknown>)[key] = nextStatusUpdates[key];
          hasChanges = true;
        }
      });

      if (!hasChanges) return prev;

      console.debug("[CharacterSheet] updateStatus - Sincronizando", Object.keys(realChanges));
      setIsSyncing(true);

      const nextStatus = { ...prev.status, ...realChanges };
      
      setDirtyFields(d => {
        const n = new Set(d);
        Object.keys(realChanges).forEach(k => n.add(`status.${k}`));
        return n;
      });

      const nextState = { ...prev, status: nextStatus };
      stateRef.current = nextState;
      scheduleAutoSave({ status: nextStatus });
      return nextState;
    });
  }, [scheduleAutoSave]);

  // Mark an arbitrary field as dirty (useful for per-field controls)
  const markFieldDirty = useCallback((field: string) => {
    console.debug("[CharacterSheet] markFieldDirty", { field });
    setDirtyFields(d => {
      if (d.has(field)) return d;
      const n = new Set(d);
      n.add(field);
      console.debug("[CharacterSheet] dirtyFields now", Array.from(n));
      return n;
    });
  }, []);

  const saveNow = useCallback(async () => {
    if (!stateRef.current || !selectedCharacter?.id) return;
    await saveImmediately(stateRef.current as Partial<CharacterData>);
  }, [selectedCharacter?.id, saveImmediately]);

  const actions = useMemo(() => ({
    updateIdentity,
    updateAttributes: (updater: Attribute[] | ((prev: Attribute[]) => Attribute[])) => 
      updateState(prev => ({ attributes: typeof updater === "function" ? updater(prev.attributes) : updater })),
    updateSkills: (updater: Skill[] | ((prev: Skill[]) => Skill[])) => 
      updateState(prev => ({ skills: typeof updater === "function" ? updater(prev.skills) : updater })),
    updatePowers: (updater: Power[] | ((prev: Power[]) => Power[])) => 
      updateState(prev => ({ powers: typeof updater === "function" ? updater(prev.powers) : updater })),
    updateStatus,
    updateDefenses: (updater: CharacterDocument["defenses"] | ((prev: CharacterDocument["defenses"] | undefined) => CharacterDocument["defenses"] | undefined)) => 
      updateState(prev => ({ defenses: typeof updater === "function" ? updater(prev.defenses) : updater })),
    markFieldDirty,
    updateCustomDescriptors: (updater: string[] | ((prev: string[]) => string[])) => 
      updateState(prev => ({ customDescriptors: typeof updater === "function" ? updater(prev.customDescriptors) : updater })),
    saveNow,
    resolveKeepLocal,
    resolveUseServer,
  }), [
    updateIdentity, 
    updateState, 
    updateStatus, 
    markFieldDirty,
    saveNow, 
    resolveKeepLocal, 
    resolveUseServer
  ]);

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
