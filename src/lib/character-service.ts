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
} from "firebase/firestore";
import { db } from "./firebase";
import type { IdentityData } from "@/contexts/IdentityContext";
import type { Attribute } from "@/components/status/attributes-grid/types";
import type { Skill } from "@/components/status/skills/types";
import type { Power } from "@/components/status/powers/types";

export interface CharacterDocument {
  id: string;
  userId: string;
  name: string;
  player: string;
  createdAt: Date;
  updatedAt: Date;
  identity: IdentityData;
  attributes: Attribute[];
  skills: Skill[];
  powers: Power[];
  status: {
    powerLevel: number;
    extraPoints: number;
    defenses: {
      apararPoints: number;
      esquivaPoints: number;
      fortitudePoints: number;
      resistenciaPoints: number;
      vontadePoints: number;
      deslocamento: number;
    };
  };
}

export type CharacterData = Omit<CharacterDocument, "id">;

/**
 * Salva ou cria um novo personagem no Firestore
 * @param userId ID do usuário (autenticado)
 * @param characterId ID único do personagem (gerado automaticamente se não fornecido)
 * @param data Dados do personagem
 */
export async function saveCharacter(
  userId: string,
  data: CharacterData,
  characterId?: string,
): Promise<string> {
  try {
    const newId = characterId || doc(collection(db, "temp")).id;
    const docRef = doc(db, "users", userId, "characters", newId);

    await setDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });

    return newId;
  } catch (error) {
    console.error("Erro ao salvar personagem:", error);
    throw error;
  }
}

/**
 * Carrega um personagem específico do Firestore
 * @param userId ID do usuário
 * @param characterId ID do personagem
 */
export async function getCharacter(
  userId: string,
  characterId: string,
): Promise<CharacterDocument | null> {
  try {
    const docRef = doc(db, "users", userId, "characters", characterId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: characterId,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as CharacterDocument;
  } catch (error) {
    console.error("Erro ao carregar personagem:", error);
    throw error;
  }
}

/**
 * Lista todos os personagens do usuário ordenados por data de atualização (mais recente primeiro)
 * @param userId ID do usuário
 */
export async function listCharacters(
  userId: string,
): Promise<CharacterDocument[]> {
  try {
    const collectionRef = collection(db, "users", userId, "characters");
    const q = query(collectionRef, orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as CharacterDocument;
    });
  } catch (error) {
    console.error("Erro ao listar personagens:", error);
    throw error;
  }
}

/**
 * Atualiza campos específicos de um personagem
 * @param userId ID do usuário
 * @param characterId ID do personagem
 * @param updates Campos a atualizar
 */
export async function updateCharacter(
  userId: string,
  characterId: string,
  updates: Partial<CharacterData>,
): Promise<void> {
  try {
    const docRef = doc(db, "users", userId, "characters", characterId);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Erro ao atualizar personagem:", error);
    throw error;
  }
}

/**
 * Deleta um personagem do Firestore
 * @param userId ID do usuário
 * @param characterId ID do personagem
 */
export async function deleteCharacter(
  userId: string,
  characterId: string,
): Promise<void> {
  try {
    const docRef = doc(db, "users", userId, "characters", characterId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Erro ao deletar personagem:", error);
    throw error;
  }
}

/**
 * Auto-salva os dados do personagem periodicamente
 * Ideal para usar com hooks em componentes
 */
export async function autoSaveCharacter(
  userId: string,
  characterId: string,
  data: Partial<CharacterData>,
): Promise<void> {
  try {
    await updateCharacter(userId, characterId, data);
  } catch (error) {
    console.error("Erro no auto-save:", error);
    // Não lança erro para não interromper a experiência do usuário
  }
}

/**
 * Salva qual personagem foi selecionado por último
 * @param userId ID do usuário
 * @param characterId ID do personagem selecionado
 */
export async function setLastSelectedCharacter(
  userId: string,
  characterId: string,
): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      lastSelectedCharacterId: characterId,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Erro ao salvar último personagem selecionado:", error);
    // Não lança erro para não interromper a UX
  }
}

/**
 * Recupera o ID do último personagem selecionado pelo usuário
 * @param userId ID do usuário
 * @returns ID do personagem ou null se nenhum foi selecionado
 */
export async function getLastSelectedCharacterId(
  userId: string,
): Promise<string | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      return null;
    }

    return userSnap.data().lastSelectedCharacterId || null;
  } catch (error) {
    console.error("Erro ao recuperar último personagem selecionado:", error);
    return null;
  }
}

/**
 * Recupera o último personagem selecionado com todos os dados
 * @param userId ID do usuário
 * @returns Documento do personagem ou null se nenhum foi selecionado
 */
export async function getLastSelectedCharacter(
  userId: string,
): Promise<CharacterDocument | null> {
  try {
    const characterId = await getLastSelectedCharacterId(userId);
    if (!characterId) {
      return null;
    }
    return getCharacter(userId, characterId);
  } catch (error) {
    console.error("Erro ao recuperar último personagem:", error);
    return null;
  }
}
