"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Skill } from "../components/pages/status/skills/types";
import { INITIAL_SKILLS } from "../components/pages/status/skills/constants";
import { useAuth } from "./AuthContext";
import { useCharacter } from "./CharacterContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";

interface SkillsContextType {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  updateSkills: (action: React.SetStateAction<Skill[]>) => void;
  updateSkill: (id: string, field: "value" | "others", value: number) => void;
  addSpecialization: (templateId: string, name: string) => void;
  removeSkill: (id: string) => void;
  isSyncing: boolean;
  dirtyFields: Set<string>;
  markFieldDirty: (field: string) => void;
}

const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

const STORAGE_KEY = "midnight-skills";

export const SkillsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize with default values, ensuring value and others are 0 if undefined
  const [skills, setSkills] = useState<Skill[]>(
    INITIAL_SKILLS.map((s) => ({
      ...s,
      value: s.value ?? 0,
      others: s.others ?? 0,
    })),
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());

  const { user } = useAuth();
  const { selectedCharacter } = useCharacter();
  const { scheduleAutoSave, setOnSaveSuccess } = useCharacterPersistence(
    user?.uid ?? null,
    selectedCharacter?.id
  );

  // Setup save success callback
  useEffect(() => {
    setOnSaveSuccess((fields) => {
      if (fields.includes("skills")) {
        setIsSyncing(false);
        setDirtyFields((prev) => {
          const next = new Set(prev);
          next.delete("skills");
          return next;
        });
      }
    });
    return () => setOnSaveSuccess(null);
  }, [setOnSaveSuccess]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSkills: Skill[] = JSON.parse(stored);
        // Basic validation could be added here
        if (Array.isArray(parsedSkills) && parsedSkills.length > 0) {
          // Merge stored skills with INITIAL_SKILLS
          const storedMap = new Map(parsedSkills.map((s) => [s.id, s]));
          
          // 1. Keep all base skills from INITIAL_SKILLS
          const baseSkills = INITIAL_SKILLS.map((initial) => {
            const stored = storedMap.get(initial.id);
            if (stored) {
              return { ...initial, ...stored };
            }
            return { ...initial, value: 0, others: 0 };
          });

          // 2. Add back specializations that were in stored but not in INITIAL_SKILLS
          const specializations = parsedSkills.filter(s => s.parentId);
          
          setSkills([...baseSkills, ...specializations]);
        }
      }
    } catch {
      // ignore errors
    }
  }, []);

  // Persist to localStorage (async/idle to avoid blocking)
  useEffect(() => {
    try {
      import("@/lib/local-storage-async").then((m) => m.setItemAsync(STORAGE_KEY, skills)).catch(() => {});
    } catch {
      // ignore errors
    }
  }, [skills]);

  const updateSkills = useCallback((action: React.SetStateAction<Skill[]>) => {
    setSkills((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      
      // Schedule auto-save if we have a character selected
      if (selectedCharacter?.id) {
        setIsSyncing(true);
        setDirtyFields((prevDirty) => {
          const nextDirty = new Set(prevDirty);
          nextDirty.add("skills");
          return nextDirty;
        });
        scheduleAutoSave({ skills: next });
      }
      
      return next;
    });
  }, [selectedCharacter?.id, scheduleAutoSave]);

  const updateSkill = useCallback((
    id: string,
    field: "value" | "others",
    value: number,
  ) => {
    updateSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  }, [updateSkills]);

  const addSpecialization = useCallback((templateId: string, specialization: string) => {
    const template = INITIAL_SKILLS.find((s) => s.id === templateId);
    if (!template) return;

    const newSkill: Skill = {
      ...template,
      id: `${templateId}-${Date.now()}`,
      parentId: templateId,
      specialization,
      name: `${template.abbreviation || template.name}: ${specialization}`,
      value: 0,
      others: 0,
      isTemplate: false,
    };

    updateSkills((prev) => [...prev, newSkill]);
  }, [updateSkills]);

  const removeSkill = useCallback((id: string) => {
    updateSkills((prev) => prev.filter((s) => s.id !== id));
  }, [updateSkills]);

  const markFieldDirty = useCallback((field: string) => {
    setDirtyFields((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  }, []);

  return (
    <SkillsContext.Provider value={{ skills, setSkills, updateSkills, updateSkill, addSpecialization, removeSkill, isSyncing, dirtyFields, markFieldDirty }}>
      {children}
    </SkillsContext.Provider>
  );
};

export const useSkillsContext = () => {
  const context = useContext(SkillsContext);
  if (context === undefined) {
    throw new Error("useSkillsContext must be used within a SkillsProvider");
  }
  return context;
};
