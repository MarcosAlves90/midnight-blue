"use client";

import React from "react";
import { User as UserIcon, Check, ChevronRight } from "lucide-react";
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
                  "flex items-center justify-center w-8 h-8 rounded-full shrink-0 overflow-hidden",
                  isSelected ? "bg-primary-foreground/20" : "bg-muted shadow-inner"
                )}>
                  {u.photoURL ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={u.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className={cn("w-4 h-4", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                  )}
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
              "group relative border bg-card p-4 transition-all duration-300 flex flex-col gap-3 shadow-md cursor-pointer overflow-hidden",
              isSelected 
                ? "border-primary bg-primary/5 ring-1 ring-primary" 
                : "border-border hover:border-primary/50 hover:shadow-primary/5"
            )}
          >
            {/* Glitch & Military Accents */}
            <div className="absolute top-0 right-0 w-8 h-8 opacity-20 pointer-events-none overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-[1px] bg-primary animate-pulse" />
               <div className="absolute top-0 right-0 w-[1px] h-full bg-primary animate-pulse" />
            </div>
            
            <div className="absolute bottom-0 left-0 w-4 h-4 opacity-10 pointer-events-none">
               <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
               <div className="absolute bottom-0 left-0 w-[2px] h-full bg-primary" />
            </div>

            {/* Decorative background icon */}
            {u.photoURL ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={u.photoURL} 
                alt="" 
                referrerPolicy="no-referrer"
                className={cn(
                  "absolute -right-2 -bottom-2 w-24 h-24 opacity-[0.03] grayscale transition-all duration-500 object-cover rounded-full blur-[1px] group-hover:scale-110 group-hover:opacity-[0.1] group-hover:grayscale-0",
                  isSelected && "opacity-[0.1] grayscale-0 scale-110"
                )} 
              />
            ) : (
              <UserIcon className={cn(
                "absolute -right-2 -bottom-2 w-20 h-20 text-primary/5 -rotate-12 group-hover:text-primary/10 transition-colors",
                isSelected && "text-primary/10"
              )} />
            )}

            <div className="flex justify-between items-start relative z-10">
              <div className={cn(
                "w-10 h-10 rounded-none border border-primary/20 transition-all overflow-hidden flex items-center justify-center p-0.5",
                isSelected 
                  ? "border-primary bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
                  : "bg-primary/5 group-hover:border-primary/50"
              )}>
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                   {u.photoURL ? (
                     /* eslint-disable-next-line @next/next/no-img-element */
                     <img src={u.photoURL} alt="" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0" referrerPolicy="no-referrer" />
                   ) : (
                     <UserIcon className="w-7 h-7 opacity-60" />
                   )}
                   {/* Scanline overlay internally */}
                   <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_2px] opacity-20 pointer-events-none" />
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                {isSelected ? (
                  <div className="px-1.5 py-0.5 bg-primary text-[8px] font-black text-primary-foreground uppercase animate-in slide-in-from-right-2">
                    Active
                  </div>
                ) : (
                  <div className="text-[8px] font-mono text-muted-foreground opacity-40 uppercase tracking-widest group-hover:opacity-80 transition-opacity">
                    ID: {u.id.substring(0, 8)}
                  </div>
                )}
                {isSelected && (
                  <div className="h-6 w-6 flex items-center justify-center rounded-none border border-primary text-primary animate-in zoom-in">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1 relative z-10">
              <div className="flex items-center gap-1.5 opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[8px] text-primary font-bold uppercase tracking-widest leading-none">Accessing Dossier</p>
              </div>
              <h3 className={cn(
                "font-black text-base leading-tight truncate transition-colors uppercase italic tracking-tighter",
                isSelected ? "text-primary" : "group-hover:text-primary"
              )}>
                {u.displayName || "Sem Nome"}
              </h3>
              <p className="text-[9px] font-mono text-muted-foreground truncate opacity-70 group-hover:opacity-100 transition-opacity">
                {u.email}
              </p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-primary/10 relative z-10">
              <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                [ Protocol: Open_File ]
              </span>
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
