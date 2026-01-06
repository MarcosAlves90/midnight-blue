"use client";

import React from "react";
import { ShieldCheck, ChevronLeft, FolderPlus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryActionsProps {
  isAdmin: boolean;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  targetUserId: string | null;
  onNewFolder: () => void;
  onNewCharacter: () => void;
}

export const GalleryActions = React.memo(function GalleryActions({
  isAdmin,
  isAdminMode,
  onToggleAdminMode,
  targetUserId,
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

      <Button 
        variant="outline" 
        size="sm" 
        onClick={onNewFolder} 
        className={cn("h-9 transition-all", isAdminMode && !targetUserId && "opacity-40 grayscale-[0.5] pointer-events-none")}
        disabled={isAdminMode && !targetUserId}
      >
        <FolderPlus className="w-4 h-4 mr-2" />
        Nova Pasta
      </Button>
      <Button 
        size="sm" 
        onClick={onNewCharacter} 
        className={cn("h-9 transition-all", isAdminMode && !targetUserId && "opacity-40 grayscale-[0.5] pointer-events-none")}
        disabled={isAdminMode && !targetUserId}
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Nova Ficha
      </Button>
    </div>
  );
});
