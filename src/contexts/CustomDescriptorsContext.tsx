"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useCharacterSheet } from "./CharacterSheetContext";

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
  const {
    state,
    updateCustomDescriptors: updateSheet,
    isSyncing,
  } = useCharacterSheet();

  const customDescriptors = useMemo(
    () => state?.customDescriptors ?? [],
    [state?.customDescriptors],
  );

  const addCustomDescriptor = useCallback(
    (descriptor: string) => {
      const trimmed = descriptor.trim().toLowerCase();
      if (trimmed) {
        updateSheet((prev) =>
          prev.includes(trimmed) ? prev : [...prev, trimmed],
        );
      }
    },
    [updateSheet],
  );

  const removeCustomDescriptor = useCallback(
    (descriptor: string) => {
      updateSheet((prev) => prev.filter((d) => d !== descriptor));
    },
    [updateSheet],
  );

  const value = useMemo(
    () => ({
      customDescriptors,
      addCustomDescriptor,
      removeCustomDescriptor,
      isSyncing,
    }),
    [customDescriptors, addCustomDescriptor, removeCustomDescriptor, isSyncing],
  );

  return (
    <CustomDescriptorsContext.Provider value={value}>
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
