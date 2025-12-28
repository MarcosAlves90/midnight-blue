"use client";

import type { CharacterDocument, CharacterData } from "@/lib/character-service";
import * as CharacterService from "@/lib/character-service";

export interface CharacterRepository {
  saveCharacter: (data: CharacterData, characterId?: string) => Promise<string>;
  getCharacter: (characterId: string) => Promise<CharacterDocument | null>;
  listCharacters: () => Promise<CharacterDocument[]>;
  updateCharacter: (characterId: string, updates: Partial<CharacterData>, options?: { baseVersion?: number }) => Promise<import("@/lib/character-service").UpdateResult>;
  deleteCharacter: (characterId: string) => Promise<void>;
}

export class FirebaseCharacterRepository implements CharacterRepository {
  private userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }

  async saveCharacter(data: CharacterData, characterId?: string) {
    if (!this.userId) throw new Error("User not authenticated");
    return CharacterService.saveCharacter(this.userId, data, characterId);
  }

  async getCharacter(characterId: string) {
    if (!this.userId) throw new Error("User not authenticated");
    return CharacterService.getCharacter(this.userId, characterId);
  }

  async listCharacters() {
    if (!this.userId) throw new Error("User not authenticated");
    return CharacterService.listCharacters(this.userId);
  }

  async updateCharacter(characterId: string, updates: Partial<CharacterData>, options?: { baseVersion?: number }) {
    if (!this.userId) throw new Error("User not authenticated");
    return CharacterService.updateCharacter(this.userId, characterId, updates, options?.baseVersion);
  }

  async deleteCharacter(characterId: string) {
    if (!this.userId) throw new Error("User not authenticated");
    return CharacterService.deleteCharacter(this.userId, characterId);
  }
}
