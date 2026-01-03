import { useEffect, useRef } from "react";
import { useIdentityContext, IdentityData } from "@/contexts/IdentityContext";
import { useSelectedCharacter } from "@/hooks/use-selected-character";
import { deepEqual } from "@/lib/deep-equal";

/**
 * Hook para sincronizar o estado da identidade com o personagem selecionado.
 * Isola a lógica de comparação e atualização para evitar poluição no componente de UI.
 */
export function useCharacterSync() {
  const { setIdentity, setCurrentCharacterId, dirtyFields } = useIdentityContext();
  const { character, isLoading, error } = useSelectedCharacter();
  
  const characterIdRef = useRef<string | null>(null);
  const lastSyncedIdentityRef = useRef<string | null>(null);

  useEffect(() => {
    if (!character?.identity || !character.id) return;

    // Serializa identity atual para comparação
    let currentIdentityHash: string;
    try {
      currentIdentityHash = JSON.stringify(character.identity);
    } catch {
      currentIdentityHash = "";
    }

    // Se o ID mudou, sempre sincroniza
    const idChanged = characterIdRef.current !== character.id;
    
    // Se o ID é o mesmo mas a identity mudou (dados atualizados), também sincroniza
    const identityChanged = lastSyncedIdentityRef.current !== currentIdentityHash;

    if (!idChanged && !identityChanged) {
      return;
    }

    // Atualiza refs
    characterIdRef.current = character.id;
    lastSyncedIdentityRef.current = currentIdentityHash;

    // Apenas sincroniza para IdentityContext (sem disparar auto-save)
    setCurrentCharacterId?.(character.id);

    // Atualiza o estado da identidade carregada
    setIdentity((prev) => {
      let hasChanged = false;
      const changedEntries: [string, unknown][] = [];

      Object.entries(character.identity).forEach(([key, val]) => {
        const k = key as keyof IdentityData;
        const newVal = val as IdentityData[typeof k];
        const curVal = prev[k];

        const changed =
          typeof newVal === "object" && newVal !== null
            ? !deepEqual(newVal, curVal)
            : newVal !== curVal;

        if (changed) {
          changedEntries.push([key, newVal]);
          hasChanged = true;
        }
      });

      if (!hasChanged) return prev;

      // Filtra campos que estão sendo editados localmente (dirty) para não sobrescrever
      const patch = Object.fromEntries(
        changedEntries.filter(([k]) => !dirtyFields.has(k)),
      ) as Partial<IdentityData>;

      if (Object.keys(patch).length === 0) return prev;

      console.debug("[useCharacterSync] Syncing identity from character", { 
        idChanged, 
        identityChanged, 
        fieldsChanged: changedEntries.length,
        dirtyFieldsCount: dirtyFields.size 
      });

      return { ...prev, ...patch } as IdentityData;
    });
  }, [character?.id, character?.identity, setCurrentCharacterId, setIdentity, dirtyFields]);

  return { character, isLoading, error };
}
