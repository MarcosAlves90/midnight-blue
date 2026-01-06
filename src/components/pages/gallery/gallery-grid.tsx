"use client";

import React from "react";
import { Folder, Move, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolderCard } from "@/components/ui/custom/folder-card";
import { CharacterCard } from "./character-card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { CharacterDocument, Folder as FolderType } from "@/lib/types/character";

interface GalleryGridProps {
  folders: FolderType[];
  allFolders: FolderType[];
  characters: CharacterDocument[];
  onFolderClick: (id: string) => void;
  onFolderDelete: (folder: FolderType) => void;
  onFolderEdit: (folder: FolderType) => void;
  onCharacterSelect: (char: CharacterDocument) => void;
  onCharacterDelete: (id: string) => void;
  onMoveToFolder: (charId: string, folderId: string | null) => void;
  deletingId: string | null;
  isAdminMode: boolean;
  targetUserId: string | null;
  ownUserId: string | null;
  onResetFilters: () => void;
}

export const GalleryGrid = React.memo(function GalleryGrid({
  folders,
  allFolders,
  characters,
  onFolderClick,
  onFolderDelete,
  onFolderEdit,
  onCharacterSelect,
  onCharacterDelete,
  onMoveToFolder,
  deletingId,
  isAdminMode,
  targetUserId,
  ownUserId,
  onResetFilters,
}: GalleryGridProps) {
  const hasItems = folders.length > 0 || characters.length > 0;

  if (!hasItems) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <Search className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
        <h3 className="text-lg font-medium">Nenhum item encontrado</h3>
        <p className="text-muted-foreground">Tente ajustar sua pesquisa ou filtro.</p>
        <Button variant="link" onClick={onResetFilters}>
          Limpar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {/* Folders */}
      {folders.map((folder) => (
        <FolderCard
          key={`folder-${folder.id}`}
          folder={folder}
          onClick={() => onFolderClick(folder.id)}
          onDelete={() => onFolderDelete(folder)}
          onEdit={() => onFolderEdit(folder)}
        />
      ))}

      {/* Characters */}
      {characters.map((character) => (
        <div key={`char-${character.id}`} className="relative group">
          <CharacterCard
            character={character}
            onSelect={() => onCharacterSelect(character)}
            onDelete={() => onCharacterDelete(character.id)}
            isDeleting={deletingId === character.id}
          />
          
          {/* Move to Folder Action */}
          {(!isAdminMode || targetUserId === ownUserId) && (
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 has-[[data-state=open]]:opacity-100 transition-opacity">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-md bg-background/80 backdrop-blur-sm border border-border">
                    <Move className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Mover para...
                  </div>
                  <DropdownMenuItem onClick={() => onMoveToFolder(character.id, null)}>
                    <ChevronRight className={cn("w-4 h-4 mr-2", !character.folderId && "text-primary")} />
                    Sem Pasta
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {allFolders.map((f) => (
                    <DropdownMenuItem 
                      key={`move-${character.id}-${f.id}`} 
                      onClick={() => onMoveToFolder(character.id, f.id)}
                    >
                      <Folder className={cn("w-4 h-4 mr-2", character.folderId === f.id && "text-primary")} />
                      {f.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});
