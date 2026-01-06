"use client";

import * as React from "react";
import { useAuth } from "./AuthContext";
import { UserService, type UserProfile } from "@/services/user-service";

type AdminContextValue = {
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  targetUserId: string | null;
  setTargetUserId: (id: string | null) => void;
  targetUserLabel: string | null;
  setTargetUserLabel: (label: string | null) => void;
  resetAdmin: () => void;
  isAdminRestored: boolean;
  users: UserProfile[];
  fetchUsers: () => Promise<void>;
  updateUserSettings: (userId: string, data: { isAdmin?: boolean, disabled?: boolean }) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  isLoadingUsers: boolean;
};

const AdminContext = React.createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading: authLoading } = useAuth();
  const [isAdminMode, setIsAdminMode] = React.useState(false);
  const [targetUserId, setTargetUserId] = React.useState<string | null>(null);
  const [targetUserLabel, setTargetUserLabel] = React.useState<string | null>(null);
  const [isAdminRestored, setIsAdminRestored] = React.useState(false);
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);

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

  const fetchUsers = React.useCallback(async () => {
    if (!isAdmin) return;
    setIsLoadingUsers(true);
    try {
      const allUsers = await UserService.listAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [isAdmin]);

  const resetAdmin = React.useCallback(() => {
    setTargetUserId(null);
    setTargetUserLabel(null);
    localStorage.removeItem("admin_target_id");
    localStorage.removeItem("admin_target_label");
  }, []);

  const updateUserSettings = React.useCallback(async (userId: string, data: { isAdmin?: boolean, disabled?: boolean }) => {
    try {
      await UserService.updateAdminSettings(userId, data);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    } catch (err) {
      console.error("Erro ao atualizar configurações do usuário:", err);
      throw err;
    }
  }, []);

  const deleteUser = React.useCallback(async (userId: string) => {
    try {
      await UserService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      if (targetUserId === userId) {
        resetAdmin();
      }
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      throw err;
    }
  }, [targetUserId, resetAdmin]);

  // Carrega usuários automaticamente se entrar no modo admin e a lista estiver vazia
  React.useEffect(() => {
    if (isAdminMode && users.length === 0 && !isLoadingUsers) {
      fetchUsers();
    }
  }, [isAdminMode, users.length, isLoadingUsers, fetchUsers]);

  // Desativa modo admin se o usuário perder permissão de admin (apenas após carregar auth)
  React.useEffect(() => {
    if (!authLoading && !isAdmin) {
      setIsAdminMode(false);
      resetAdmin();
      setUsers([]);
    }
  }, [isAdmin, authLoading, resetAdmin]);

  const value = React.useMemo(() => ({ 
    isAdminMode, 
    setIsAdminMode,
    targetUserId,
    setTargetUserId,
    targetUserLabel,
    setTargetUserLabel,
    resetAdmin,
    isAdminRestored,
    users,
    fetchUsers,
    updateUserSettings,
    deleteUser,
    isLoadingUsers
  }), [
    isAdminMode, 
    setIsAdminMode,
    targetUserId, 
    setTargetUserId,
    targetUserLabel, 
    setTargetUserLabel,
    resetAdmin, 
    isAdminRestored,
    users,
    fetchUsers,
    updateUserSettings,
    deleteUser,
    isLoadingUsers
  ]);

  return (
    <AdminContext.Provider value={value}>
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
