import { FirebaseCharacterRepository } from "@/services/repository/character-repo";
import { backgroundPersistence } from "@/services/background-persistence";
import { getCheapFingerprint } from "@/lib/utils";
import type { CharacterData, CharacterDocument } from "@/lib/types/character";

export interface PersistenceResult {
  fingerprint: string;
  savedFields: string[];
}

/**
 * Serviço para gerenciar a persistência de dados do personagem.
 * Isola a lógica de fila (background persistence), tratamento de conflitos e retentativas.
 */
export class PersistenceManager {
  private repo: FirebaseCharacterRepository;

  constructor(userId: string) {
    this.repo = new FirebaseCharacterRepository(userId);
  }

  /**
   * Executa o salvamento dos dados usando a fila de persistência em background.
   */
  async save(
    characterId: string,
    data: Partial<CharacterData>,
    pendingFields: Set<string>
  ): Promise<PersistenceResult> {
    // Calcula fingerprint ANTES do salvamento
    const fingerprint = getCheapFingerprint(data);

    // Extrai campos que foram agendados para limpeza de dirtyFields
    const savedFields = this.extractSavedFields(data, pendingFields);

    // Enfileira a tarefa de persistência
    const res = await backgroundPersistence.enqueue(
      characterId,
      async () => {
        // Tenta usar patch (mais leve) se disponível
        if (typeof this.repo.patchCharacter === "function") {
          await this.repo.patchCharacter(characterId, data as Partial<CharacterData>);
          return { success: true } as const;
        }

        // Fallback para update completo
        return this.repo.updateCharacter(characterId, data as Partial<CharacterData>);
      },
      {
        priority: 5,
        maxRetries: 3,
        initialBackoffMs: 400,
        coalesceKey: "autosave-patch",
        shouldRetry: (err: unknown) => this.shouldRetrySave(err),
      }
    );

    // Trata resultado de conflito
    if (res && typeof res === "object") {
      const asObj = res as Record<string, unknown>;
      if (asObj["success"] === false) {
        const err = new Error("conflict") as Error & { conflict?: CharacterDocument };
        err.conflict = asObj["conflict"] as CharacterDocument | undefined;
        throw err;
      }
    }

    return { fingerprint, savedFields };
  }

  /**
   * Determina quais campos foram salvos para notificar a UI.
   */
  private extractSavedFields(data: Partial<CharacterData>, pendingFields: Set<string>): string[] {
    const savedFields: string[] = Array.from(pendingFields);
    
    // Fallback: se pendingFields estiver vazio, tenta extrair da identidade
    if (savedFields.length === 0 && data.identity && typeof data.identity === "object") {
      const identityFields = data.identity as unknown as Record<string, unknown>;
      Object.keys(identityFields).forEach((key) => {
        if (!savedFields.includes(key)) {
          savedFields.push(key);
        }
      });
    }

    return savedFields;
  }

  /**
   * Lógica para decidir se uma falha de salvamento deve ser retentada.
   */
  private shouldRetrySave(err: unknown): boolean {
    if (!err || typeof err !== "object") return true;
    try {
      const asObj = err as Record<string, unknown>;
      // Se for um erro de conflito (sucesso=false), NÃO retenta automaticamente
      if (asObj["success"] === false) return false;
      if (Object.prototype.hasOwnProperty.call(asObj, "conflict")) return false;
    } catch {
      // ignore
    }
    return true;
  }
}
