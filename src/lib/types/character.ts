import type { IdentityData } from "@/contexts/IdentityContext";
import type { Attribute } from "@/components/pages/status/attributes-grid/types";
import type { Skill } from "@/components/pages/status/skills/types";
import type { Power } from "@/components/pages/status/powers/types";

export interface SavedAttribute {
  id: string;
  value: number;
}

export interface SavedSkill {
  id: string;
  value?: number;
  others?: number;
  parentId?: string;
  specialization?: string;
}

// CharacterDocument returns hydrated types (Attributes and Skills) to avoid confusion
export interface CharacterDocument {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  /** numeric monotonic version for optimistic locking */
  version: number;
  identity: IdentityData;
  attributes: Attribute[];
  skills: Skill[];
  powers: Power[];
  status: {
    powerLevel: number;
    extraPoints: number;
    [key: string]: unknown;
  };
  customDescriptors: string[];
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string | null;
}

export type CharacterData = Omit<CharacterDocument, "id">;

export type UpdateResult =
  | { success: true; newVersion: number }
  | { success: false; conflict: CharacterDocument };
