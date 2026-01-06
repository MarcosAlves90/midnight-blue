"use client";

import React from "react";
import { Folder as FolderIcon, User as UserIcon } from "lucide-react";
import type { UserProfile } from "@/services/user-service";

interface AdminUserListProps {
  users: UserProfile[];
  onUserClick: (userId: string) => void;
}

export function AdminUserList({ users, onUserClick }: AdminUserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {users.map((u) => (
        <div 
          key={`user-${u.id}`}
          onClick={() => onUserClick(u.id)}
          className="flex flex-col items-center justify-center p-6 bg-card hover:bg-accent/50 border rounded-xl cursor-pointer transition-all group"
        >
          <div className="relative mb-3">
            <FolderIcon className="w-16 h-16 text-blue-500/40 group-hover:text-blue-500/60 transition-colors" fill="currentColor" />
            <UserIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-center line-clamp-1">{u.displayName || "Sem Nome"}</span>
          <span className="text-[10px] text-muted-foreground line-clamp-1">{u.email}</span>
        </div>
      ))}
    </div>
  );
}
