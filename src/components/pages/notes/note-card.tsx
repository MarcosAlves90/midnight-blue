"use client";

import { Note } from "@/lib/note-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MoreVertical, Trash2, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
  return (
    <Card 
      className="group relative hover:border-primary/50 transition-all cursor-pointer overflow-hidden flex flex-col h-40"
      onClick={onClick}
    >
      <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-bold truncate uppercase tracking-tighter">
            {note.title || "Sem título"}
          </CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onClick(); }}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-3 pt-2 flex-1 flex flex-col justify-between overflow-hidden">
        <p className="text-xs text-muted-foreground line-clamp-3 font-mono leading-relaxed">
          {note.content || "Nenhum conteúdo..."}
        </p>
        <div className="text-[10px] text-muted-foreground/50 font-mono mt-2">
          {new Intl.DateTimeFormat('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).format(note.updatedAt)}
        </div>
      </CardContent>
    </Card>
  );
}
