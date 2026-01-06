"use client";

import * as React from "react";
import { useAuth } from "./AuthContext";

type AdminContextValue = {
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  targetUserId: string | null;
  setTargetUserId: (id: string | null) => void;
};

const AdminContext = React.createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const [isAdminMode, setIsAdminMode] = React.useState(false);
  const [targetUserId, setTargetUserId] = React.useState<string | null>(null);

  // Desativa modo admin se o usuário perder permissão de admin
  React.useEffect(() => {
    if (!isAdmin) {
      setIsAdminMode(false);
      setTargetUserId(null);
    }
  }, [isAdmin]);

  return (
    <AdminContext.Provider 
      value={{ 
        isAdminMode, 
        setIsAdminMode,
        targetUserId,
        setTargetUserId
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = React.useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
