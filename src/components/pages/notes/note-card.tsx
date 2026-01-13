"use client";

import { Note } from "@/lib/note-service";
import {
  StickyNote,
  MoreVertical,
  Trash2,
  ExternalLink,
  Clock,
  FileText,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(
    note.updatedAt instanceof Date ? note.updatedAt : new Date(note.updatedAt),
  );

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-lg border border-border/40 bg-card/40 backdrop-blur-sm p-4 hover:border-primary/50 transition-all duration-300 flex flex-col gap-3 shadow-md hover:shadow-[0_0_20px_rgba(var(--primary),0.05)] cursor-pointer overflow-hidden h-48",
      )}
    >
      {/* Decorative background icon */}
      <StickyNote className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 -rotate-12 group-hover:text-primary/10 transition-colors pointer-events-none" />

      <div className="flex justify-between items-start relative z-10">
        <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <FileText className="w-5 h-5" />
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-all"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir Registro
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1 relative z-10">
        <div className="flex items-center gap-2">
          <p className="text-[8px] text-primary font-bold uppercase tracking-tight opacity-80">
            Memorando / Registro
          </p>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-primary/30 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-primary/20" />
          </div>
        </div>
        <h3 className="font-bold text-sm leading-tight truncate group-hover:text-primary transition-colors uppercase italic tracking-tighter">
          {note.title || "Sem título"}
        </h3>
        <p className="text-[10px] text-muted-foreground/80 line-clamp-2 font-mono leading-tight mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
          {note.content || "Nenhum conteúdo registrado..."}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/20 relative z-10">
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground uppercase">
          <Clock className="w-3 h-3" />
          {formattedDate}
        </div>
        <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}
