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
import type { Attribute } from "@/components/status/attributes-grid/types";
import type { Skill } from "@/components/status/skills/types";
import type { Power } from "@/components/status/powers/types";
import { INITIAL_ATTRIBUTES } from "@/components/status/attributes-grid/constants";
import { INITIAL_SKILLS } from "@/components/status/skills/constants";

/**
 * Dados mínimos de atributo para salvar (apenas valores)
 */
export interface SavedAttribute {
  id: string;
  value: number;
}

/**
 * Dados mínimos de perícia para salvar (apenas valores editáveis)
 */
export interface SavedSkill {
  id: string;
  value?: number;
  others?: number;
}

export interface CharacterDocument {
  id: string;
  userId: string;
  name: string;
  heroName: string;
  createdAt: Date;
  updatedAt: Date;
  identity: IdentityData;
  attributes: SavedAttribute[];
  skills: SavedSkill[];
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
 * Otimiza os dados de atributos para salvar (remove dados estáticos)
 */
function optimizeAttributesForStorage(
  attributes: Attribute[],
): SavedAttribute[] {
  return attributes.map((attr) => ({
    id: attr.id,
    value: attr.value,
  }));
}

/**
 * Otimiza os dados de perícias para salvar (remove dados estáticos)
 */
function optimizeSkillsForStorage(skills: Skill[]): SavedSkill[] {
  return skills.map((skill) => ({
    id: skill.id,
    value: skill.value ?? 0,
    others: skill.others ?? 0,
  }));
}

/**
 * Hidrata atributos salvos com dados estáticos (nome, cor, etc)
 */
function hydrateAttributes(saved: SavedAttribute[]): Attribute[] {
  return INITIAL_ATTRIBUTES.map((attr) => {
    const savedAttr = saved.find((s) => s.id === attr.id);
    return {
      ...attr,
      value: savedAttr?.value ?? 0,
    };
  });
}

/**
 * Hidrata perícias salvas com dados estáticos (nome, descrição, etc)
 */
function hydrateSkills(saved: SavedSkill[]): Skill[] {
  return INITIAL_SKILLS.map((skill) => {
    const savedSkill = saved.find((s) => s.id === skill.id);
    return {
      ...skill,
      value: savedSkill?.value ?? 0,
      others: savedSkill?.others ?? 0,
    };
  });
}

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
    const newId = characterId || doc(collection(db, "users", userId, "characters")).id;
    const docRef = doc(db, "users", userId, "characters", newId);

    // Otimizar dados antes de salvar
    const optimizedData = {
      id: newId,
      userId: data.userId,
      name: data.name,
      heroName: data.heroName,
      createdAt: data.createdAt,
      updatedAt: new Date(),
      identity: data.identity,
      attributes: optimizeAttributesForStorage(data.attributes as Attribute[]),
      skills: optimizeSkillsForStorage(data.skills as Skill[]),
      powers: data.powers,
      status: data.status,
    };

    await setDoc(docRef, optimizedData);

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
    
    // Hidratar dados estáticos
    const hydratedAttributes = hydrateAttributes(data.attributes || []);
    const hydratedSkills = hydrateSkills(data.skills || []);

    return {
      id: characterId,
      userId: data.userId,
      name: data.name,
      heroName: data.heroName,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      identity: data.identity,
      attributes: hydratedAttributes,
      skills: hydratedSkills,
      powers: data.powers || [],
      status: data.status,
    };
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
      
      // Hidratar dados estáticos
      const hydratedAttributes = hydrateAttributes(data.attributes || []);
      const hydratedSkills = hydrateSkills(data.skills || []);

      return {
        id: docSnap.id,
        userId: data.userId,
        name: data.name,
        heroName: data.heroName,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        identity: data.identity,
        attributes: hydratedAttributes,
        skills: hydratedSkills,
        powers: data.powers || [],
        status: data.status,
      };
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

    // Otimizar dados antes de salvar
    const optimizedUpdates: Record<string, unknown> = { updatedAt: new Date() };

    if (updates.attributes) {
      optimizedUpdates.attributes = optimizeAttributesForStorage(
        updates.attributes as Attribute[],
      );
    }
    if (updates.skills) {
      optimizedUpdates.skills = optimizeSkillsForStorage(updates.skills as Skill[]);
    }
    if (updates.identity) {
      optimizedUpdates.identity = updates.identity;
    }
    if (updates.powers) {
      optimizedUpdates.powers = updates.powers;
    }
    if (updates.status) {
      optimizedUpdates.status = updates.status;
    }
    if (updates.name) {
      optimizedUpdates.name = updates.name;
    }
    if (updates.heroName) {
      optimizedUpdates.heroName = updates.heroName;
    }

    await updateDoc(docRef, optimizedUpdates);
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
    
    // Verificar se o documento do usuário existe
    const userSnap = await getDoc(userDocRef);
    
    if (!userSnap.exists()) {
      // Criar documento do usuário se não existir
      await setDoc(userDocRef, {
        lastSelectedCharacterId: characterId,
        updatedAt: new Date(),
      });
    } else {
      // Atualizar documento existente
      await updateDoc(userDocRef, {
        lastSelectedCharacterId: characterId,
        updatedAt: new Date(),
      });
    }
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

/**
 * Escuta mudanças em tempo real na lista de personagens do usuário
 * @param userId ID do usuário
 * @param callback Função chamada quando a lista é atualizada
 * @returns Função para desinscrever do listener
 */
export function onCharactersChange(
  userId: string,
  callback: (characters: CharacterDocument[]) => void,
): Unsubscribe {
  const collectionRef = collection(db, "users", userId, "characters");
  const q = query(collectionRef, orderBy("updatedAt", "desc"));

  return onSnapshot(q, (querySnapshot) => {
    const characters = querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();

      const hydratedAttributes = hydrateAttributes(data.attributes || []);
      const hydratedSkills = hydrateSkills(data.skills || []);

      return {
        id: docSnap.id,
        userId: data.userId,
        name: data.name,
        heroName: data.heroName,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        identity: data.identity,
        attributes: hydratedAttributes,
        skills: hydratedSkills,
        powers: data.powers || [],
        status: data.status,
      };
    });

    callback(characters);
  }, (error) => {
    console.error("Erro ao escutar mudanças em personagens:", error);
  });
}
