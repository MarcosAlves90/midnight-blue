"use client";

import * as React from "react";
import { useAuth } from "./AuthContext";

type AdminContextValue = {
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  targetUserId: string | null;
  setTargetUserId: (id: string | null) => void;
  targetUserLabel: string | null;
  setTargetUserLabel: (label: string | null) => void;
  resetAdmin: () => void;
  isAdminRestored: boolean;
};

const AdminContext = React.createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading: authLoading } = useAuth();
  const [isAdminMode, setIsAdminMode] = React.useState(false);
  const [targetUserId, setTargetUserId] = React.useState<string | null>(null);
  const [targetUserLabel, setTargetUserLabel] = React.useState<string | null>(null);
  const [isAdminRestored, setIsAdminRestored] = React.useState(false);

  // Recupera estado do Admin do LocalStorage para suportar F5
  React.useEffect(() => {
    if (authLoading) return;

    const savedMode = localStorage.getItem("admin_mode") === "true";
    const savedTarget = localStorage.getItem("admin_target_id");
    const savedLabel = localStorage.getItem("admin_target_label");

    if (savedMode && isAdmin) {
      setIsAdminMode(true);
      setTargetUserId(savedTarget);
      setTargetUserLabel(savedLabel);
    }
    setIsAdminRestored(true);
  }, [isAdmin, authLoading]);

  // Persiste mudanças no LocalStorage
  React.useEffect(() => {
    if (!isAdminRestored) return;

    if (isAdminMode) {
      localStorage.setItem("admin_mode", "true");
      if (targetUserId) localStorage.setItem("admin_target_id", targetUserId);
      if (targetUserLabel) localStorage.setItem("admin_target_label", targetUserLabel);
    } else {
      localStorage.removeItem("admin_mode");
      localStorage.removeItem("admin_target_id");
      localStorage.removeItem("admin_target_label");
    }
  }, [isAdminMode, targetUserId, targetUserLabel, isAdminRestored]);

  const resetAdmin = React.useCallback(() => {
    setTargetUserId(null);
    setTargetUserLabel(null);
    localStorage.removeItem("admin_target_id");
    localStorage.removeItem("admin_target_label");
  }, []);

  // Desativa modo admin se o usuário perder permissão de admin (apenas após carregar auth)
  React.useEffect(() => {
    if (!authLoading && !isAdmin) {
      setIsAdminMode(false);
      resetAdmin();
    }
  }, [isAdmin, authLoading, resetAdmin]);

  return (
    <AdminContext.Provider 
      value={{ 
        isAdminMode, 
        setIsAdminMode,
        targetUserId,
        setTargetUserId,
        targetUserLabel,
        setTargetUserLabel,
        resetAdmin,
        isAdminRestored
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
