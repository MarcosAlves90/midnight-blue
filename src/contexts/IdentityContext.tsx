"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface IdentityData {
  name: string;
  player: string;
  alternateIdentity: string;
  identityStatus: string; // Public, Secret
  gender: string;
  age: string;
  height: string;
  weight: string;
  eyes: string;
  hair: string;
  groupAffiliation: string;
  baseOfOperations: string;
  powerOrigin: string;
  motivation: string;
  placeOfBirth: string;
  occupation: string;
  favoriteColor: string;
  profileImage?: string;
  imagePosition?: number;
  history: string;
  complications: Complication[];
}

export interface Complication {
  id: string;
  name: string;
  description: string;
}

const INITIAL_IDENTITY: IdentityData = {
  name: "",
  player: "",
  alternateIdentity: "",
  identityStatus: "Secret",
  gender: "",
  age: "",
  height: "",
  weight: "",
  eyes: "",
  hair: "",
  groupAffiliation: "",
  baseOfOperations: "",
  powerOrigin: "",
  motivation: "",
  placeOfBirth: "",
  occupation: "",
  favoriteColor: "#1e3a8a", // midnight blue theme
  profileImage: "",
  imagePosition: 50, // Center (50%)
  history: "",
  complications: [],
};

interface IdentityContextType {
  identity: IdentityData;
  updateIdentity: <K extends keyof IdentityData>(field: K, value: IdentityData[K]) => void;
  setIdentity: React.Dispatch<React.SetStateAction<IdentityData>>;
}

const IdentityContext = createContext<IdentityContextType | undefined>(undefined);

const STORAGE_KEY = "midnight-identity";

export const IdentityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [identity, setIdentity] = useState<IdentityData>(INITIAL_IDENTITY);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setIdentity({ ...INITIAL_IDENTITY, ...parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
    } catch {
      // ignore
    }
  }, [identity]);

  const updateIdentity = useCallback(<K extends keyof IdentityData>(field: K, value: IdentityData[K]) => {
    setIdentity(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <IdentityContext.Provider value={{ identity, updateIdentity, setIdentity }}>
      {children}
    </IdentityContext.Provider>
  );
};

export const useIdentityContext = () => {
  const context = useContext(IdentityContext);
  if (context === undefined) {
    throw new Error("useIdentityContext must be used within a IdentityProvider");
  }
  return context;
};
