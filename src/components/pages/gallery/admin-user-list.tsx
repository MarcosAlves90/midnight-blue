"use client";

import React from "react";
import { Folder as FolderIcon, User as UserIcon, Check, ChevronRight } from "lucide-react";
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
      {users.map((u) => {
        const isSelected = selectedUserId === u.id;
        return (
          <div 
            key={`user-${u.id}`}
            onClick={() => onUserClick(u.id)}
            className={cn(
              "group relative rounded-lg border bg-card p-4 transition-all duration-300 flex flex-col gap-3 shadow-md cursor-pointer overflow-hidden",
              isSelected 
                ? "border-primary bg-primary/5 ring-1 ring-primary" 
                : "border-border hover:border-primary/50 hover:shadow-primary/5"
            )}
          >
            {/* Decorative background icon */}
            <UserIcon className={cn(
              "absolute -right-2 -bottom-2 w-20 h-20 text-primary/5 -rotate-12 group-hover:text-primary/10 transition-colors",
              isSelected && "text-primary/10"
            )} />

            <div className="flex justify-between items-start relative z-10">
              <div className={cn(
                "p-2 rounded-md transition-colors",
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
              )}>
                <UserIcon className="w-5 h-5" />
              </div>
              
              {isSelected && (
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/20 text-primary animate-in zoom-in">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1 relative z-10">
              <p className="text-[8px] text-primary font-bold uppercase tracking-tight opacity-80">Conta / Usuário</p>
              <h3 className={cn(
                "font-bold text-sm leading-tight truncate transition-colors uppercase italic tracking-tighter",
                isSelected ? "text-primary" : "group-hover:text-primary"
              )}>
                {u.displayName || "Sem Nome"}
              </h3>
              <p className="text-[10px] text-muted-foreground truncate opacity-70 font-medium">
                {u.email}
              </p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50 relative z-10">
              <span className="text-[9px] font-mono text-muted-foreground uppercase">Explorar Fichas</span>
              <ChevronRight className={cn(
                "w-3 h-3 text-muted-foreground transition-all",
                isSelected ? "text-primary translate-x-1" : "group-hover:text-primary group-hover:translate-x-1"
              )} />
            </div>
          </div>
        );
      })}
    </div>
  );
});
