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
import { db } from "./firebase";
import type { IdentityData } from "@/contexts/IdentityContext";
import type { Attribute } from "@/components/pages/status/attributes-grid/types";
import type { Skill } from "@/components/pages/status/skills/types";
import type { Power } from "@/components/pages/status/powers/types";
import { INITIAL_ATTRIBUTES } from "@/components/pages/status/attributes-grid/constants";
import { INITIAL_SKILLS } from "@/components/pages/status/skills/constants";

const USERS_COLLECTION = "users";
const CHARACTERS_SUBCOLLECTION = "characters";

export interface SavedAttribute {
  id: string;
  value: number;
}

export interface SavedSkill {
  id: string;
  value?: number;
  others?: number;
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
  status: Record<string, unknown>;
}

export type CharacterData = Omit<CharacterDocument, "id">;

export type UpdateResult =
  | { success: true; newVersion: number }
  | { success: false; conflict: CharacterDocument };


/* --------------------------- Helpers pequenos --------------------------- */

function toDateSafe(value: unknown): Date {
  const candidate = value as { toDate?: () => Date } | undefined;
  if (candidate && typeof candidate.toDate === "function") return candidate.toDate();
  if (value instanceof Date) return value;
  return new Date();
}

function normalizeIdentity(raw: Partial<IdentityData> | Record<string, unknown> = {}): IdentityData {
  const r = raw as Record<string, unknown>;
  const name = (r.name as string) || (r.displayName as string) || "";
  const heroName = (r.heroName as string) || (r.hero as string) || "";
  return { ...(raw as IdentityData), name, heroName } as IdentityData;
}

function serializeAttributes(attributes: Attribute[] = INITIAL_ATTRIBUTES): SavedAttribute[] {
  return attributes.map((a) => ({ id: a.id, value: a.value }));
}

function serializeSkills(skills: Skill[] = INITIAL_SKILLS): SavedSkill[] {
  return skills.map((s) => ({ id: s.id, value: s.value ?? 0, others: s.others ?? 0 }));
}

function hydrateAttributes(saved: SavedAttribute[] = []): Attribute[] {
  return INITIAL_ATTRIBUTES.map((base) => ({ ...base, value: saved.find((s) => s.id === base.id)?.value ?? 0 }));
}

function hydrateSkills(saved: SavedSkill[] = []): Skill[] {
  return INITIAL_SKILLS.map((base) => ({ ...base, value: (saved.find((s) => s.id === base.id)?.value) ?? 0, others: (saved.find((s) => s.id === base.id)?.others) ?? 0 }));
}

function mapFirestoreToCharacter(id: string, data: Record<string, unknown>): CharacterDocument {
  const identity = normalizeIdentity((data.identity as Record<string, unknown>) || data);

  return {
    id,
    userId: String(data.userId),
    createdAt: toDateSafe(data.createdAt),
    updatedAt: toDateSafe(data.updatedAt),
    version: Number((data.version as number) ?? 0),
    identity,
    attributes: hydrateAttributes((data.attributes as unknown) as SavedAttribute[] || []),
    skills: hydrateSkills((data.skills as unknown) as SavedSkill[] || []),
    powers: (data.powers as Power[]) || [],
    status: (data.status as Record<string, unknown>) || {},
  };
}

/**
 * Salva ou cria um novo personagem no Firestore
 * @param userId ID do usuário (autenticado)
 * @param characterId ID único do personagem (gerado automaticamente se não fornecido)
 * @param data Dados do personagem
 */
export async function saveCharacter(userId: string, data: CharacterData, characterId?: string): Promise<string> {
  const id = characterId ?? doc(collection(db, USERS_COLLECTION, userId, CHARACTERS_SUBCOLLECTION)).id;
  const docRef = doc(db, USERS_COLLECTION, userId, CHARACTERS_SUBCOLLECTION, id);

  const now = new Date();

  const payload = {
    id,
    userId,
    createdAt: data.createdAt ?? now,
    updatedAt: now,
    // initial version for newly created documents
    version: 1,
    identity: normalizeIdentity(data.identity),
    attributes: serializeAttributes((data.attributes as Attribute[]) ?? INITIAL_ATTRIBUTES),
    skills: serializeSkills((data.skills as Skill[]) ?? INITIAL_SKILLS),
    powers: data.powers ?? [],
    status: data.status ?? {},
  };

  try {
    await setDoc(docRef, payload);
    return id;
  } catch (err) {
    console.error("saveCharacter failed:", err);
    throw err;
  }
}

/**
 * Carrega um personagem específico do Firestore
 * @param userId ID do usuário
 * @param characterId ID do personagem
 */
export async function getCharacter(userId: string, characterId: string): Promise<CharacterDocument | null> {
  const docRef = doc(db, USERS_COLLECTION, userId, CHARACTERS_SUBCOLLECTION, characterId);
  try {
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return mapFirestoreToCharacter(snap.id, snap.data());
  } catch (err) {
    console.error("getCharacter failed:", err);
    throw err;
  }
}

/**
 * Lista todos os personagens do usuário ordenados por data de atualização (mais recente primeiro)
 * @param userId ID do usuário
 */
export async function listCharacters(userId: string): Promise<CharacterDocument[]> {
  const collectionRef = collection(db, USERS_COLLECTION, userId, CHARACTERS_SUBCOLLECTION);
  const q = query(collectionRef, orderBy("updatedAt", "desc"));

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => mapFirestoreToCharacter(d.id, d.data()));
  } catch (err) {
    console.error("listCharacters failed:", err);
    throw err;
  }
}

/**
 * Atualiza campos específicos de um personagem
 * @param userId ID do usuário
 * @param characterId ID do personagem
 * @param updates Campos a atualizar
 */
export async function updateCharacter(userId: string, characterId: string, updates: Partial<CharacterData>, baseVersion?: number): Promise<UpdateResult> {
  const docRef = doc(db, USERS_COLLECTION, userId, CHARACTERS_SUBCOLLECTION, characterId);

  const payload: Record<string, unknown> = {};

  const updatesRecord = updates as Record<string, unknown>;

  // Handle attributes / skills as full arrays (serialized)
  if (Object.prototype.hasOwnProperty.call(updatesRecord, "attributes")) {
    payload.attributes = serializeAttributes(updates.attributes as Attribute[]);
  }
  if (Object.prototype.hasOwnProperty.call(updatesRecord, "skills")) {
    payload.skills = serializeSkills(updates.skills as Skill[]);
  }

  // If caller provided dotted keys (e.g., 'identity.name') or top-level primitive keys (e.g., 'heroName'), copy them through
  Object.keys(updatesRecord).forEach((key) => {
    const val = updatesRecord[key];

    // Skip handled structured keys
    if (key === "attributes" || key === "skills") return;
    if (key === "powers") {
      payload.powers = val;
      return;
    }
    if (key === "status") {
      payload.status = val;
      return;
    }

    // Support dotted updates (identity.name) — copy as-is so Firestore will update nested field
    if (key.includes(".")) {
      payload[key] = val;
      return;
    }

    // Identity partial: convert to dotted keys to avoid replacing the entire identity object
    if (key === "identity" && typeof val === "object" && val !== null) {
      try {
        const identityPart = val as Record<string, unknown>;
        Object.keys(identityPart).forEach((k) => {
          // Avoid deep-normalization here; keep values verbatim so single-field updates are cheap
          payload[`identity.${k}`] = identityPart[k as keyof typeof identityPart];
        });
      } catch {
        // fallback: if something goes wrong, replace entire identity
        payload.identity = normalizeIdentity(updates.identity as Partial<IdentityData>);
      }
      return;
    }

    // Compatibility: allow updating heroName from top-level (legacy callers)
    if (key === "heroName") {
      payload[`identity.heroName`] = String(val);
      return;
    }

    // Fallback: set top-level fields
    payload[key] = val;
  });

  // Use transaction to perform optimistic locking based on numeric 'version'
  try {
    const res = await (async () => {
      try {
        const result = await import("firebase/firestore").then(({ runTransaction, serverTimestamp }) =>
          runTransaction(db, async (t) => {
            const snap = await t.get(docRef);
            if (!snap.exists()) throw new Error("Document does not exist");

            const serverData = snap.data();
            const serverVersion = Number((serverData.version as number) ?? 0);

            if (typeof baseVersion === "number" && baseVersion !== serverVersion) {
              // return conflict
              return { success: false as const, conflict: mapFirestoreToCharacter(snap.id, serverData) } as UpdateResult;
            }

            const newVersion = serverVersion + 1;
            const updated = { ...payload, updatedAt: serverTimestamp(), version: newVersion };
            t.update(docRef, updated);
            return { success: true as const, newVersion } as UpdateResult;
          }),
        );
        return result;
      } catch (err) {
        throw err;
      }
    })();

    return res;
  } catch (err) {
    console.error("updateCharacter failed:", err);
    throw err;
  }
}

/**
 * Deleta um personagem do Firestore
 * @param userId ID do usuário
 * @param characterId ID do personagem
 */
export async function deleteCharacter(userId: string, characterId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, userId, CHARACTERS_SUBCOLLECTION, characterId));
  } catch (err) {
    console.error("deleteCharacter failed:", err);
    throw err;
  }
}

/**
 * Auto-salva os dados do personagem periodicamente
 * Ideal para usar com hooks em componentes
 */
export async function autoSaveCharacter(userId: string, characterId: string, data: Partial<CharacterData>): Promise<void> {
  try {
    console.debug("[autoSaveCharacter] calling updateCharacter", { userId, characterId });
    await updateCharacter(userId, characterId, data);
  } catch (err) {
    console.error("autoSaveCharacter failed:", err);
  }
}

/**
 * Salva qual personagem foi selecionado por último
 * @param userId ID do usuário
 * @param characterId ID do personagem selecionado
 */
export async function setLastSelectedCharacter(userId: string, characterId: string): Promise<void> {
  const userDoc = doc(db, USERS_COLLECTION, userId);
  const now = new Date();

  try {
    const snap = await getDoc(userDoc);
    if (!snap.exists()) await setDoc(userDoc, { lastSelectedCharacterId: characterId, updatedAt: now });
    else await updateDoc(userDoc, { lastSelectedCharacterId: characterId, updatedAt: now });
  } catch (err) {
    console.error("setLastSelectedCharacter failed:", err);
  }
}

/**
 * Recupera o ID do último personagem selecionado pelo usuário
 * @param userId ID do usuário
 * @returns ID do personagem ou null se nenhum foi selecionado
 */
export async function getLastSelectedCharacterId(userId: string): Promise<string | null> {
  try {
    const snap = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (!snap.exists()) return null;
    return snap.data().lastSelectedCharacterId || null;
  } catch (err) {
    console.error("getLastSelectedCharacterId failed:", err);
    return null;
  }
}

/**
 * Recupera o último personagem selecionado com todos os dados
 * @param userId ID do usuário
 * @returns Documento do personagem ou null se nenhum foi selecionado
 */
export async function getLastSelectedCharacter(userId: string): Promise<CharacterDocument | null> {
  try {
    const id = await getLastSelectedCharacterId(userId);
    if (!id) return null;
    return getCharacter(userId, id);
  } catch (err) {
    console.error("getLastSelectedCharacter failed:", err);
    return null;
  }
}

/**
 * Escuta mudanças em tempo real na lista de personagens do usuário
 * @param userId ID do usuário
 * @param callback Função chamada quando a lista é atualizada
 * @returns Função para desinscrever do listener
 */
export function onCharactersChange(userId: string, callback: (characters: CharacterDocument[]) => void): Unsubscribe {
  const collectionRef = collection(db, USERS_COLLECTION, userId, CHARACTERS_SUBCOLLECTION);
  const q = query(collectionRef, orderBy("updatedAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const chars = snapshot.docs.map((d) => mapFirestoreToCharacter(d.id, d.data()));
    callback(chars);
  }, (err) => {
    console.error("onCharactersChange failed:", err);
  });
}
