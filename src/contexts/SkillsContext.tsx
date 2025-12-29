"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Skill } from "../components/pages/status/skills/types";
import { INITIAL_SKILLS } from "../components/pages/status/skills/constants";

interface SkillsContextType {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  updateSkill: (id: string, field: "value" | "others", value: number) => void;
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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSkills: Skill[] = JSON.parse(stored);
        // Basic validation could be added here
        if (Array.isArray(parsedSkills) && parsedSkills.length > 0) {
          // Merge stored skills with INITIAL_SKILLS to ensure new skills are added if constants change
          // This is a simple merge strategy: keep stored values for existing IDs, add new ones from INITIAL
          const storedMap = new Map(parsedSkills.map((s) => [s.id, s]));
          const mergedSkills = INITIAL_SKILLS.map((initial) => {
            const stored = storedMap.get(initial.id);
            if (stored) {
              return { ...initial, ...stored }; // Keep stored values but update static data like name/desc if changed
            }
            return { ...initial, value: 0, others: 0 };
          });
          setSkills(mergedSkills);
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

  const updateSkill = (
    id: string,
    field: "value" | "others",
    value: number,
  ) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  return (
    <SkillsContext.Provider value={{ skills, setSkills, updateSkill }}>
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
