import { CharacterDocument } from "@/lib/types/character";
import { setItemAsync, removeItemAsync, setStringItemAsync } from "@/lib/local-storage-async";

const KEYS = {
  CURRENT_ID: "midnight-current-character-id",
  CURRENT_OWNER: "midnight-current-character-owner-id",
  LAST_OWN_ID: "midnight-last-own-character-id",
  DOC_PREFIX: "midnight-current-character-doc"
} as const;

export class CharacterStorageService {
  static saveSelection(char: CharacterDocument, isOwn: boolean) {
    if (typeof window === "undefined") return;
    
    setStringItemAsync(KEYS.CURRENT_ID, char.id);
    setStringItemAsync(KEYS.CURRENT_OWNER, char.userId);
    
    if (isOwn) {
      setStringItemAsync(KEYS.LAST_OWN_ID, char.id);
    }
    
    // Cache do documento para carregamento instantâneo
    setItemAsync(`${KEYS.DOC_PREFIX}:${char.id}`, char);
  }

  static clearSelection() {
    if (typeof window === "undefined") return;
    
    removeItemAsync(KEYS.CURRENT_ID);
    removeItemAsync(KEYS.CURRENT_OWNER);
  }

  static getStoredOwnerId = () => typeof window !== "undefined" ? localStorage.getItem(KEYS.CURRENT_OWNER) : null;

  static getStoredLastOwnId = () => typeof window !== "undefined" ? localStorage.getItem(KEYS.LAST_OWN_ID) : null;

  static getStoredCurrentId = () => typeof window !== "undefined" ? localStorage.getItem(KEYS.CURRENT_ID) : null;
}
