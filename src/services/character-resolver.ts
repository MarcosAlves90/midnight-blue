import { CharacterDocument } from "@/lib/types/character";
import { CharacterStorageService } from "@/services/character-storage";

/**
 * Service especializado em decidir qual personagem deve ser carregado inicialmente
 * seguindo as regras de prioridade de negócio.
 */
export class CharacterResolver {
  static async resolveInitial({
    activeContextId,
    isAdminMode,
    userId,
    loadCharacter,
    loadLastSelected,
  }: {
    activeContextId: string;
    isAdminMode: boolean;
    userId?: string;
    loadCharacter: (id: string) => Promise<CharacterDocument | null>;
    loadLastSelected: () => Promise<CharacterDocument | null>;
  }): Promise<CharacterDocument | null> {
    const currentId = CharacterStorageService.getStoredCurrentId();
    const storedOwnerId = CharacterStorageService.getStoredOwnerId();

    // Prioridade 1: Cache local se pertencer ao contexto atual
    if (currentId && storedOwnerId === activeContextId) {
      const char = await loadCharacter(currentId);
      if (char) return char;
    }

    // Prioridade 2: Modo Usuário - Recuperar última própria
    if (!isAdminMode) {
      const lastOwnId = CharacterStorageService.getStoredLastOwnId();
      if (lastOwnId) {
        const char = await loadCharacter(lastOwnId);
        if (char && char.userId === userId) return char;
      }

      const lastGlobal = await loadLastSelected();
      if (lastGlobal && lastGlobal.userId === userId) return lastGlobal;
    }

    return null;
  }
}
