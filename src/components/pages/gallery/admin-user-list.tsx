"use client";

import React from "react";
import { User as UserIcon, Check, ChevronRight, ShieldAlert, ShieldCheck, Snowflake, Trash2, MoreVertical } from "lucide-react";
import type { UserProfile } from "@/services/user-service";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/lib/toast";

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
  const { updateUserSettings, deleteUser } = useAdmin();

  const handleToggleAdmin = async (e: React.MouseEvent, user: UserProfile) => {
    e.stopPropagation();
    try {
      await updateUserSettings(user.id, { isAdmin: !user.isAdmin });
      toast.success(user.isAdmin ? "Privilégios de admin removidos" : "Usuário agora é admin");
    } catch {
      toast.error("Erro ao atualizar privilégios");
    }
  };

  const handleToggleFreeze = async (e: React.MouseEvent, user: UserProfile) => {
    e.stopPropagation();
    try {
      await updateUserSettings(user.id, { disabled: !user.disabled });
      toast.success(user.disabled ? "Conta descongelada" : "Conta congelada");
    } catch {
      toast.error("Erro ao alterar status da conta");
    }
  };

  const handleDelete = async (e: React.MouseEvent, user: UserProfile) => {
    e.stopPropagation();
    if (!confirm(`Tem certeza que deseja excluir permanentemente a conta de ${user.displayName || user.email}? Esta ação não pode ser desfeita.`)) {
      return;
    }
    try {
      await deleteUser(user.id);
      toast.success("Usuário excluído com sucesso");
    } catch {
      toast.error("Erro ao excluir usuário");
    }
  };

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
                  <div className="flex items-center gap-1">
                    {u.isAdmin && <ShieldCheck className="w-2.5 h-2.5 text-yellow-500" />}
                    {u.disabled && <Snowflake className="w-2.5 h-2.5 text-blue-400" />}
                    <span className={cn(
                      "text-[9px] truncate max-w-[150px] opacity-70 font-medium",
                      isSelected ? "text-primary-foreground" : "text-muted-foreground"
                    )}>
                      {u.email}
                    </span>
                  </div>
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
                : "border-border hover:border-primary/50 hover:shadow-primary/5",
              u.isAdmin && "border-yellow-600/40 shadow-[0_0_15px_rgba(234,179,8,0.1)]",
              u.disabled && "border-blue-400/30 bg-blue-900/5 grayscale-[0.3]"
            )}
          >
            {/* Admin Glow Effect */}
            {u.isAdmin && (
               <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none mix-blend-overlay animate-pulse duration-[3000ms]" />
            )}

            {/* Frozen Frost Effect */}
            {u.disabled && (
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
            )}

            {/* Glitch & Military Accents */}
            <div className="absolute top-0 right-0 w-8 h-8 opacity-20 pointer-events-none overflow-hidden">
               <div className={cn(
                 "absolute top-0 right-0 w-full h-[1px] animate-pulse",
                 u.isAdmin ? "bg-yellow-500" : u.disabled ? "bg-blue-400" : "bg-primary"
               )} />
               <div className={cn(
                 "absolute top-0 right-0 w-[1px] h-full animate-pulse",
                 u.isAdmin ? "bg-yellow-500" : u.disabled ? "bg-blue-400" : "bg-primary"
               )} />
            </div>
            
            <div className="absolute bottom-0 left-0 w-4 h-4 opacity-10 pointer-events-none">
               <div className={cn(
                 "absolute bottom-0 left-0 w-full h-[2px]",
                 u.isAdmin ? "bg-yellow-500" : u.disabled ? "bg-blue-400" : "bg-primary"
               )} />
               <div className={cn(
                 "absolute bottom-0 left-0 w-[2px] h-full",
                 u.isAdmin ? "bg-yellow-500" : u.disabled ? "bg-blue-400" : "bg-primary"
               )} />
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
                "w-10 h-10 rounded-none border transition-all overflow-hidden flex items-center justify-center p-0.5",
                isSelected 
                  ? "border-primary bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
                  : (u.isAdmin ? "border-yellow-500/50 bg-yellow-500/10" : u.disabled ? "border-blue-500/50 bg-blue-500/10" : "bg-primary/5 border-primary/20 group-hover:border-primary/50")
              )}>
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                   {u.photoURL ? (
                     /* eslint-disable-next-line @next/next/no-img-element */
                     <img 
                       src={u.photoURL} 
                       alt="" 
                       className={cn(
                         "w-full h-full object-cover transition-all",
                         u.disabled ? "grayscale brightness-50" : "grayscale-[0.5] group-hover:grayscale-0"
                       )} 
                       referrerPolicy="no-referrer" 
                     />
                   ) : (
                     <UserIcon className={cn("w-7 h-7 opacity-60", u.isAdmin ? "text-yellow-500" : u.disabled ? "text-blue-500" : "")} />
                   )}
                   {/* Scanline overlay internally */}
                   <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_2px] opacity-20 pointer-events-none" />
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <button className={cn(
                      "h-6 w-6 flex items-center justify-center rounded-none border transition-colors",
                      u.isAdmin ? "border-yellow-500/30 hover:border-yellow-500" : u.disabled ? "border-blue-500/30 hover:border-blue-500" : "border-border hover:border-primary"
                    )}>
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Ações Administrativas</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => handleToggleAdmin(e as unknown as React.MouseEvent, u)}>
                      {u.isAdmin ? <ShieldAlert className="w-4 h-4 mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                      {u.isAdmin ? "Remover Admin" : "Tornar Admin"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleToggleFreeze(e as unknown as React.MouseEvent, u)}>
                      <Snowflake className="w-4 h-4 mr-2" />
                      {u.disabled ? "Descongelar Conta" : "Congelar Conta"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => handleDelete(e as unknown as React.MouseEvent, u)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir Conta
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {isSelected ? (
                  <div className="px-1.5 py-0.5 bg-primary text-[8px] font-black text-primary-foreground uppercase animate-in slide-in-from-right-2">
                    Active
                  </div>
                ) : (
                  <div className="text-[8px] font-mono text-muted-foreground opacity-40 uppercase tracking-widest group-hover:opacity-80 transition-opacity">
                    ID: {u.id.substring(0, 8)}
                  </div>
                )}
                {u.isAdmin && (
                  <div className="px-1.5 py-0.5 bg-yellow-600 text-[8px] font-black text-black uppercase shadow-[0_0_10px_rgba(234,179,8,0.3)] animate-pulse">
                    Admin
                  </div>
                )}
                {u.disabled && (
                  <div className="px-1.5 py-0.5 bg-blue-600 text-[8px] font-black text-white uppercase shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                    Frozen
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
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full animate-pulse",
                  u.isAdmin ? "bg-yellow-500" : u.disabled ? "bg-blue-500" : "bg-primary"
                )} />
                <p className={cn(
                  "text-[8px] font-bold uppercase tracking-widest leading-none",
                  u.isAdmin ? "text-yellow-500" : u.disabled ? "text-blue-500" : "text-primary"
                )}>
                  {u.isAdmin ? "Privileged Access" : u.disabled ? "Account Suspended" : "Accessing Dossier"}
                </p>
              </div>
              <h3 className={cn(
                "font-black text-base leading-tight truncate transition-colors uppercase italic tracking-tighter",
                isSelected ? "text-primary" : (u.isAdmin ? "text-yellow-500" : u.disabled ? "text-blue-400" : "group-hover:text-primary")
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
