"use client";

import React from "react";
import { Folder as FolderIcon, User as UserIcon, Check } from "lucide-react";
import type { UserProfile } from "@/services/user-service";
import { cn } from "@/lib/utils";

interface AdminUserListProps {
  users: UserProfile[];
  onUserClick: (userId: string) => void;
  selectedUserId?: string | null;
  compact?: boolean;
}

export const AdminUserList = React.memo(function AdminUserList({ 
  users, 
  onUserClick,
  selectedUserId,
  compact = false
}: AdminUserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="w-full overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        <div className="flex w-max space-x-3 p-1">
          {users.map((u) => {
            const isSelected = selectedUserId === u.id;
            return (
              <button
                key={`user-compact-${u.id}`}
                onClick={() => onUserClick(u.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all border shrink-0",
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02] ring-2 ring-primary/20" 
                    : "bg-card hover:bg-accent/80 border-border text-card-foreground hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                  isSelected ? "bg-primary-foreground/20" : "bg-muted shadow-inner"
                )}>
                  <UserIcon className={cn("w-4 h-4", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                </div>
                <div className="flex flex-col items-start min-w-[100px]">
                  <span className="text-xs font-bold truncate max-w-[150px] tracking-tight">
                    {(u.displayName || u.email || "Sem Nome").toUpperCase()}
                  </span>
                  <span className={cn(
                    "text-[9px] truncate max-w-[150px] opacity-70 font-medium",
                    isSelected ? "text-primary-foreground" : "text-muted-foreground"
                  )}>
                    {u.email}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 ml-1 animate-in zoom-in duration-300" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {users.map((u) => (
        <div 
          key={`user-${u.id}`}
          onClick={() => onUserClick(u.id)}
          className={cn(
            "flex flex-col items-center justify-center p-6 bg-card hover:bg-accent/50 border rounded-xl cursor-pointer transition-all group",
            selectedUserId === u.id && "ring-2 ring-primary border-primary bg-primary/5"
          )}
        >
          <div className="relative mb-3">
            <FolderIcon className={cn(
              "w-16 h-16 transition-colors",
              selectedUserId === u.id ? "text-primary/40" : "text-blue-500/40 group-hover:text-blue-500/60"
            )} fill="currentColor" />
            <UserIcon className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6",
              selectedUserId === u.id ? "text-primary" : "text-blue-600"
            )} />
          </div>
          <span className="text-sm font-medium text-center line-clamp-1">{u.displayName || "Sem Nome"}</span>
          <span className="text-[10px] text-muted-foreground line-clamp-1">{u.email}</span>
        </div>
      ))}
    </div>
  );
});
