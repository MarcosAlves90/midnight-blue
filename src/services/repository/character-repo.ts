"use client";

import type { CharacterDocument, CharacterData, Folder } from "@/lib/character-service";
import * as CharacterService from "@/lib/character-service";

export interface CharacterRepository {
  saveCharacter: (data: CharacterData, characterId?: string) => Promise<string>;
  getCharacter: (characterId: string) => Promise<CharacterDocument | null>;
  listCharacters: () => Promise<CharacterDocument[]>;
  updateCharacter: (characterId: string, updates: Partial<CharacterData>, options?: { baseVersion?: number }) => Promise<import("@/lib/character-service").UpdateResult>;
  patchCharacter?: (characterId: string, updates: Partial<CharacterData>) => Promise<void>;
  deleteCharacter: (characterId: string) => Promise<void>;
  
  // Folder management
  createFolder: (name: string, parentId?: string | null) => Promise<string>;
  deleteFolder: (folderId: string) => Promise<void>;
  listFolders: () => Promise<Folder[]>;
  moveCharacterToFolder: (characterId: string, folderId: string | null) => Promise<void>;
  listenToFolders: (callback: (folders: Folder[]) => void) => () => void;
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

    const perfKey = `FirebaseRepo.updateCharacter:${characterId}`;
    try {
      performance.mark(`${perfKey}-start`);
    } catch {
      // ignore
    }

    const res = await CharacterService.updateCharacter(this.userId, characterId, updates, options?.baseVersion);

    try {
      performance.mark(`${perfKey}-end`);
      performance.measure(perfKey, `${perfKey}-start`, `${perfKey}-end`);
      performance.clearMarks(`${perfKey}-start`);
      performance.clearMarks(`${perfKey}-end`);
      performance.clearMeasures(perfKey);
    } catch {
      // ignore
    }

    return res;
  }

  async patchCharacter(characterId: string, updates: Partial<CharacterData>) {
    if (!this.userId) throw new Error("User not authenticated");

    const perfKey = `FirebaseRepo.patchCharacter:${characterId}`;
    try { performance.mark(`${perfKey}-start`); } catch {}

    await CharacterService.patchCharacter(this.userId, characterId, updates);

    try { performance.mark(`${perfKey}-end`); performance.measure(perfKey, `${perfKey}-start`, `${perfKey}-end`); performance.clearMarks(`${perfKey}-start`); performance.clearMarks(`${perfKey}-end`); performance.clearMeasures(perfKey); } catch {}
  }
  async deleteCharacter(characterId: string) {
    if (!this.userId) throw new Error("User not authenticated");
    return CharacterService.deleteCharacter(this.userId, characterId);
  }

  async createFolder(name: string, parentId: string | null = null) {
    if (!this.userId) throw new Error("User not authenticated");
    return CharacterService.createFolder(this.userId, name, parentId);
  }

  async deleteFolder(folderId: string) {
    if (!this.userId) throw new Error("User not authenticated");
    return CharacterService.deleteFolder(this.userId, folderId);
  }

  async listFolders() {
    if (!this.userId) throw new Error("User not authenticated");
    return CharacterService.listFolders(this.userId);
  }

  async moveCharacterToFolder(characterId: string, folderId: string | null) {
    if (!this.userId) throw new Error("User not authenticated");
    return CharacterService.moveCharacterToFolder(this.userId, characterId, folderId);
  }

  listenToFolders(callback: (folders: Folder[]) => void) {
    if (!this.userId) return () => {};
    return CharacterService.onFoldersChange(this.userId, callback);
  }
}
