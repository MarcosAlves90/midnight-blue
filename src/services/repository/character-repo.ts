"use client";

import type { CharacterDocument, CharacterData, Folder, UpdateResult } from "@/lib/types/character";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  normalizeIdentity,
  serializeAttributes,
  serializeSkills,
  mapFirestoreToCharacter,
  toDateSafe,
} from "@/lib/mappers/character-mapper";
import { INITIAL_ATTRIBUTES } from "@/components/pages/status/attributes-grid/constants";
import { INITIAL_SKILLS } from "@/components/pages/status/skills/constants";
import type { Attribute } from "@/components/pages/status/attributes-grid/types";
import type { Skill } from "@/components/pages/status/skills/types";

const USERS_COLLECTION = "users";
const CHARACTERS_SUBCOLLECTION = "characters";
const FOLDERS_SUBCOLLECTION = "folders";

export interface CharacterRepository {
  saveCharacter: (data: CharacterData, characterId?: string) => Promise<string>;
  getCharacter: (characterId: string) => Promise<CharacterDocument | null>;
  listCharacters: () => Promise<CharacterDocument[]>;
  updateCharacter: (characterId: string, updates: Partial<CharacterData>, options?: { baseVersion?: number }) => Promise<UpdateResult>;
  patchCharacter: (characterId: string, updates: Partial<CharacterData>) => Promise<void>;
  deleteCharacter: (characterId: string) => Promise<void>;
  
  // Listeners
  onCharactersChange: (callback: (characters: CharacterDocument[]) => void) => Unsubscribe;
  onCharacterChange: (characterId: string, callback: (character: CharacterDocument | null) => void) => Unsubscribe;

  // Last selected
  setLastSelectedCharacter: (characterId: string) => Promise<void>;
  getLastSelectedCharacterId: () => Promise<string | null>;

  // Folder management
  createFolder: (name: string, parentId?: string | null) => Promise<string>;
  deleteFolder: (folderId: string) => Promise<void>;
  listFolders: () => Promise<Folder[]>;
  moveCharacterToFolder: (characterId: string, folderId: string | null) => Promise<void>;
  onFoldersChange: (callback: (folders: Folder[]) => void) => Unsubscribe;
}

export class FirebaseCharacterRepository implements CharacterRepository {
  private userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }

  private get characterCollection() {
    return collection(db, USERS_COLLECTION, this.userId, CHARACTERS_SUBCOLLECTION);
  }

  private get folderCollection() {
    return collection(db, USERS_COLLECTION, this.userId, FOLDERS_SUBCOLLECTION);
  }

  private getDocRef(characterId: string) {
    return doc(db, USERS_COLLECTION, this.userId, CHARACTERS_SUBCOLLECTION, characterId);
  }

  async saveCharacter(data: CharacterData, characterId?: string): Promise<string> {
    const id = characterId ?? doc(this.characterCollection).id;
    const docRef = this.getDocRef(id);
    const now = new Date();

    const payload = {
      id,
      userId: this.userId,
      createdAt: data.createdAt ?? now,
      updatedAt: now,
      version: 1,
      identity: normalizeIdentity(data.identity),
      attributes: serializeAttributes((data.attributes as Attribute[]) ?? INITIAL_ATTRIBUTES),
      skills: serializeSkills((data.skills as Skill[]) ?? INITIAL_SKILLS),
      powers: data.powers ?? [],
      status: data.status ?? { powerLevel: 10, extraPoints: 0 },
      customDescriptors: data.customDescriptors ?? [],
      folderId: data.folderId ?? null,
    };

    await setDoc(docRef, payload);
    return id;
  }

  async getCharacter(characterId: string): Promise<CharacterDocument | null> {
    const docRef = this.getDocRef(characterId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return mapFirestoreToCharacter(snap.id, snap.data());
  }

  async listCharacters(): Promise<CharacterDocument[]> {
    const q = query(this.characterCollection);
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((d) => mapFirestoreToCharacter(d.id, d.data()))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async updateCharacter(characterId: string, updates: Partial<CharacterData>, options?: { baseVersion?: number }): Promise<UpdateResult> {
    const docRef = this.getDocRef(characterId);
    const payload = this.prepareUpdatePayload(updates);

    const { runTransaction, serverTimestamp } = await import("firebase/firestore");
    
    return runTransaction(db, async (t) => {
      const snap = await t.get(docRef);
      if (!snap.exists()) throw new Error("Document does not exist");

      const serverData = snap.data();
      const serverVersion = Number((serverData.version as number) ?? 0);

      if (typeof options?.baseVersion === "number" && options.baseVersion !== serverVersion) {
        return { success: false as const, conflict: mapFirestoreToCharacter(snap.id, serverData) };
      }

      const newVersion = serverVersion + 1;
      t.update(docRef, { ...payload, updatedAt: serverTimestamp(), version: newVersion });
      return { success: true as const, newVersion };
    });
  }

  async patchCharacter(characterId: string, updates: Partial<CharacterData>): Promise<void> {
    const docRef = this.getDocRef(characterId);
    const payload = this.prepareUpdatePayload(updates);

    if (Object.keys(payload).length === 0) return;

    const { updateDoc, serverTimestamp, increment } = await import("firebase/firestore");
    await updateDoc(docRef, { ...payload, updatedAt: serverTimestamp(), version: increment(1) });
  }

  async deleteCharacter(characterId: string): Promise<void> {
    await deleteDoc(this.getDocRef(characterId));
  }

  onCharactersChange(callback: (characters: CharacterDocument[]) => void): Unsubscribe {
    return onSnapshot(query(this.characterCollection), (snapshot) => {
      const chars = snapshot.docs
        .map((d) => mapFirestoreToCharacter(d.id, d.data()))
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      callback(chars);
    });
  }

  onCharacterChange(characterId: string, callback: (character: CharacterDocument | null) => void): Unsubscribe {
    return onSnapshot(this.getDocRef(characterId), (snapshot) => {
      callback(snapshot.exists() ? mapFirestoreToCharacter(snapshot.id, snapshot.data()) : null);
    });
  }

  async setLastSelectedCharacter(characterId: string): Promise<void> {
    const userDoc = doc(db, USERS_COLLECTION, this.userId);
    const now = new Date();
    const snap = await getDoc(userDoc);
    if (!snap.exists()) await setDoc(userDoc, { lastSelectedCharacterId: characterId, updatedAt: now });
    else await updateDoc(userDoc, { lastSelectedCharacterId: characterId, updatedAt: now });
  }

  async getLastSelectedCharacterId(): Promise<string | null> {
    const snap = await getDoc(doc(db, USERS_COLLECTION, this.userId));
    return snap.exists() ? snap.data().lastSelectedCharacterId || null : null;
  }

  async createFolder(name: string, parentId: string | null = null): Promise<string> {
    const id = doc(this.folderCollection).id;
    const docRef = doc(this.folderCollection, id);
    const now = new Date();
    await setDoc(docRef, { id, name, createdAt: now, updatedAt: now, parentId });
    return id;
  }

  async deleteFolder(folderId: string): Promise<void> {
    const folderRef = doc(this.folderCollection, folderId);
    const snapshot = await getDocs(query(this.characterCollection));
    const batchUpdates = snapshot.docs
      .filter(d => d.data().folderId === folderId)
      .map(d => updateDoc(this.getDocRef(d.id), { folderId: null }));

    await Promise.all([...batchUpdates, deleteDoc(folderRef)]);
  }

  async listFolders(): Promise<Folder[]> {
    const snapshot = await getDocs(query(this.folderCollection, orderBy("name", "asc")));
    return snapshot.docs.map(d => ({
      ...d.data(),
      id: d.id,
      createdAt: toDateSafe(d.data().createdAt),
      updatedAt: toDateSafe(d.data().updatedAt),
    } as Folder));
  }

  async moveCharacterToFolder(characterId: string, folderId: string | null): Promise<void> {
    await updateDoc(this.getDocRef(characterId), { folderId, updatedAt: new Date() });
  }

  onFoldersChange(callback: (folders: Folder[]) => void): Unsubscribe {
    return onSnapshot(query(this.folderCollection, orderBy("name", "asc")), (snapshot) => {
      callback(snapshot.docs.map(d => ({
        ...d.data(),
        id: d.id,
        createdAt: toDateSafe(d.data().createdAt),
        updatedAt: toDateSafe(d.data().updatedAt),
      } as Folder)));
    });
  }

  private prepareUpdatePayload(updates: Partial<CharacterData>): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    const updatesRecord = updates as Record<string, unknown>;

    if (updatesRecord.attributes) payload.attributes = serializeAttributes(updates.attributes as Attribute[]);
    if (updatesRecord.skills) payload.skills = serializeSkills(updates.skills as Skill[]);

    Object.keys(updatesRecord).forEach((key) => {
      const val = updatesRecord[key];
      if (val === undefined || key === "attributes" || key === "skills") return;

      if (key === "powers" || key === "customDescriptors") {
        payload[key] = val;
      } else if (key === "status" && typeof val === "object" && val !== null) {
        Object.keys(val).forEach(k => payload[`status.${k}`] = (val as Record<string, unknown>)[k]);
      } else if (key === "identity" && typeof val === "object" && val !== null) {
        Object.keys(val).forEach(k => payload[`identity.${k}`] = (val as Record<string, unknown>)[k]);
      } else if (key.includes(".") || key === "heroName") {
        payload[key === "heroName" ? "identity.heroName" : key] = val;
      } else {
        payload[key] = val;
      }
    });

    return payload;
  }

  listenToFolders(callback: (folders: Folder[]) => void): Unsubscribe {
    return this.onFoldersChange(callback);
  }
}
