"use client";

import { Folder as FolderIcon, MoreVertical, Trash2, ChevronRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderCardProps {
  folder: {
    id: string;
    name: string;
  };
  onClick: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  label?: string;
}

export function FolderCard({ folder, onClick, onDelete, onEdit, label = "Acessar Arquivos" }: FolderCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-all duration-300 flex flex-col gap-3 shadow-md hover:shadow-primary/5 cursor-pointer overflow-hidden"
    >
      {/* Decorative background icon */}
      <FolderIcon className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 -rotate-12 group-hover:text-primary/10 transition-colors" />

      <div className="flex justify-between items-start relative z-10">
        <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <FolderIcon className="w-5 h-5" />
        </div>
        
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Editar Nome
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Pasta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1 relative z-10">
        <p className="text-[8px] text-primary font-bold uppercase tracking-tight opacity-80">Diretório / Seção</p>
        <h3 className="font-bold text-sm leading-tight truncate group-hover:text-primary transition-colors uppercase italic tracking-tighter">
          {folder.name}
        </h3>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50 relative z-10">
        <span className="text-[9px] font-mono text-muted-foreground uppercase">{label}</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}
