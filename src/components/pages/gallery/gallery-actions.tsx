"use client";

import React from "react";
import { ShieldCheck, ChevronLeft, FolderPlus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryActionsProps {
  isAdmin: boolean;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  targetUserId: string | null;
  onBackToUsers: () => void;
  onNewFolder: () => void;
  onNewCharacter: () => void;
}

export function GalleryActions({
  isAdmin,
  isAdminMode,
  onToggleAdminMode,
  targetUserId,
  onBackToUsers,
  onNewFolder,
  onNewCharacter,
}: GalleryActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Button 
          variant={isAdminMode ? "destructive" : "secondary"} 
          size="sm" 
          onClick={onToggleAdminMode}
          className="h-9"
        >
          <ShieldCheck className="w-4 h-4 mr-2" />
          {isAdminMode ? "Sair Admin" : "Modo Admin"}
        </Button>
      )}

      {isAdminMode && targetUserId && (
        <Button variant="outline" size="sm" onClick={onBackToUsers} className="h-9">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      )}

      {!isAdminMode && (
        <>
          <Button variant="outline" size="sm" onClick={onNewFolder} className="h-9">
            <FolderPlus className="w-4 h-4 mr-2" />
            Nova Pasta
          </Button>
          <Button size="sm" onClick={onNewCharacter} className="h-9">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova Ficha
          </Button>
        </>
      )}
    </div>
  );
}
