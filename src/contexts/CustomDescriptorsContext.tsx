"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import { useCharacter } from "./CharacterContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";

interface CustomDescriptorsContextType {
  customDescriptors: string[];
  addCustomDescriptor: (descriptor: string) => void;
  removeCustomDescriptor: (descriptor: string) => void;
  isSyncing: boolean;
}

const CustomDescriptorsContext = createContext<
  CustomDescriptorsContextType | undefined
>(undefined);

export function CustomDescriptorsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [customDescriptors, setCustomDescriptorsState] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const lastVersionRef = useRef<number>(0);

  const { user } = useAuth();
  const { selectedCharacter } = useCharacter();
  const { scheduleAutoSave, setOnSaveSuccess } = useCharacterPersistence(
    user?.uid ?? null,
    selectedCharacter?.id
  );

  // Inbound Sync: Listen to selectedCharacter changes from server
  useEffect(() => {
    if (selectedCharacter && selectedCharacter.customDescriptors) {
      // Only update if server version is newer than what we last processed
      if (selectedCharacter.version > lastVersionRef.current) {
        console.debug("[CustomDescriptorsContext] Inbound sync", { 
          version: selectedCharacter.version, 
          prevVersion: lastVersionRef.current 
        });
        setCustomDescriptorsState(selectedCharacter.customDescriptors);
        lastVersionRef.current = selectedCharacter.version;
      }
    } else if (!selectedCharacter) {
      setCustomDescriptorsState([]);
      lastVersionRef.current = 0;
    }
  }, [selectedCharacter]);

  // Setup save success callback
  useEffect(() => {
    setOnSaveSuccess((fields) => {
      if (fields.includes("customDescriptors")) {
        setIsSyncing(false);
      }
    });
    return () => setOnSaveSuccess(null);
  }, [setOnSaveSuccess]);

  // Carregar descritores do localStorage ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("customDescriptors");
      if (saved) {
        setCustomDescriptorsState(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Erro ao carregar descritores customizados:", error);
    }
    setIsLoaded(true);
  }, []);

  // Salvar descritores no localStorage quando mudam (async/idle to avoid blocking)
  useEffect(() => {
    if (isLoaded) {
      try {
        import("@/lib/local-storage-async").then((m) => m.setItemAsync("customDescriptors", customDescriptors)).catch(() => {});
      } catch (error) {
        console.error("Erro ao salvar descritores customizados:", error);
      }
    }
  }, [customDescriptors, isLoaded]);

  const setCustomDescriptors = useCallback((action: React.SetStateAction<string[]>) => {
    setCustomDescriptorsState((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      
      // Schedule auto-save if we have a character selected
      if (selectedCharacter?.id) {
        setIsSyncing(true);
        scheduleAutoSave({ customDescriptors: next });
      }
      
      return next;
    });
  }, [selectedCharacter?.id, scheduleAutoSave]);

  const addCustomDescriptor = useCallback(
    (descriptor: string) => {
      const trimmed = descriptor.trim().toLowerCase();
      if (trimmed && !customDescriptors.includes(trimmed)) {
        setCustomDescriptors((prev) => [...prev, trimmed]);
      }
    },
    [customDescriptors, setCustomDescriptors],
  );

  const removeCustomDescriptor = useCallback((descriptor: string) => {
    setCustomDescriptors((prev) => prev.filter((d) => d !== descriptor));
  }, [setCustomDescriptors]);

  return (
    <CustomDescriptorsContext.Provider
      value={{ customDescriptors, addCustomDescriptor, removeCustomDescriptor, isSyncing }}
    >
      {children}
    </CustomDescriptorsContext.Provider>
  );
}

export function useCustomDescriptors() {
  const context = useContext(CustomDescriptorsContext);
  if (context === undefined) {
    throw new Error(
      "useCustomDescriptors deve ser usado dentro de CustomDescriptorsProvider",
    );
  }
  return context;
}
