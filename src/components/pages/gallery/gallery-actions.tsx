"use client";

import React from "react";
import { Infinity, FolderPlus, PlusCircle } from "lucide-react";
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
      {isAdmin && (
        <Button 
          variant="secondary"
          size="sm" 
          onClick={onToggleAdminMode}
          className={cn(
            "rounded-r-none h-9 px-4 font-mono uppercase tracking-[0.15em] text-[10px] transition-all duration-300 border",
            isAdminMode
              ? "bg-white text-black border-white hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              : "bg-primary/5 text-muted-foreground border-primary/10 hover:border-primary/30 hover:bg-primary/10"
          )}
        >
          <Infinity className={cn("w-3.5 h-3.5 mr-2", isAdminMode ? "text-black" : "text-primary")} />
          <span>Infinity Corp</span>
        </Button>
      )}
    </div>
  );
});
