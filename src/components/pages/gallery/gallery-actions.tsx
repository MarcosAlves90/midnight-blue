"use client";

import React from "react";
import { Infinity, FolderPlus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryActionsProps {
  isAdminMode: boolean;
  targetUserId: string | null;
  onNewFolder: () => void;
  onNewCharacter: () => void;
}

export const GalleryActions = React.memo(function GalleryActions({
  onNewFolder,
  onNewCharacter,
  isAdminMode,
  targetUserId,
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
    </div>
  );
});
