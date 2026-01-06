"use client";

import * as React from "react";
import { getClientAuth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { UserService } from "@/services/user-service";

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const auth = getClientAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      
      if (u) {
        // Sincroniza perfil em background
        UserService.syncUserProfile(u).catch(console.error);

        // Verifica claims de admin (forçando refresh para detectar mudanças imediatas)
        try {
          const token = await u.getIdTokenResult(true);
          setIsAdmin(!!token.claims.admin);
        } catch (err) {
          console.error("Erro ao verificar claims de admin:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signOut() {
    const auth = getClientAuth();
    try {
      // Clear character-related data from localStorage
      const keysToClear = [
        "midnight-current-character-id",
        "midnight-current-character-owner-id",
        "midnight-identity",
        "midnight-attributes",
        "midnight-skills",
        "midnight-status",
        "midnight-powers",
        "customDescriptors"
      ];
      
      keysToClear.forEach(key => {
        try { localStorage.removeItem(key); } catch {}
      });

      // Clear character document cache from localStorage
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("midnight-current-character-doc:")) {
            localStorage.removeItem(key);
          }
        }
      } catch {}

    } catch (err) {
      console.error("Error clearing localStorage on signOut:", err);
    }

    await firebaseSignOut(auth);
  }

  function refreshUser() {
    const auth = getClientAuth();
    const current = auth.currentUser;
    // Forçar nova referência para garantir que React detecte a mudança
    setUser(current ? ({ ...current } as User) : null);
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
