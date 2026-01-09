"use client";
import React, { createContext, useContext, useCallback, useMemo } from "react";
import { Skill } from "../components/pages/status/skills/types";
import { INITIAL_SKILLS } from "../components/pages/status/skills/constants";
import { useCharacterSheet } from "./CharacterSheetContext";

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

export const SkillsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state, updateSkills: updateSheet, isSyncing, dirtyFields, markFieldDirty } = useCharacterSheet();

  const skills = state?.skills ?? INITIAL_SKILLS;

  const updateSkills = useCallback((action: React.SetStateAction<Skill[]>) => {
    updateSheet(action);
  }, [updateSheet]);

  const updateSkill = useCallback((
    id: string,
    field: "value" | "others",
    value: number,
  ) => {
    updateSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
    // Marcamos a seção de perícias como suja de forma simplificada
    markFieldDirty("skills");
  }, [updateSkills, markFieldDirty]);

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

  const value = useMemo(() => ({
    skills,
    setSkills: () => {}, // No longer used directly
    updateSkills,
    updateSkill,
    addSpecialization,
    removeSkill,
    isSyncing,
    dirtyFields,
    markFieldDirty
  }), [skills, updateSkills, updateSkill, addSpecialization, removeSkill, isSyncing, dirtyFields, markFieldDirty]);

  return (
    <SkillsContext.Provider value={value}>
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
