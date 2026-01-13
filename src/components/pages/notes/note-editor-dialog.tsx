"use client";

import { useState, useEffect } from "react";
import { Note } from "@/lib/note-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Trash2, Clock, FileText, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteEditorDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (noteId: string, updates: Partial<Note>) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
}

export function NoteEditorDialog({
  note,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: NoteEditorDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSave = async () => {
    if (!note || !title.trim()) return;
    setIsSaving(true);
    try {
      await onSave(note.id, { title, content });
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    if (confirm("Deseja permanentemente deletar este registro de memória?")) {
      await onDelete(note.id);
      onOpenChange(false);
    }
  };

  if (!note) return null;

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(
    note.updatedAt instanceof Date ? note.updatedAt : new Date(note.updatedAt),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[100vw] sm:max-w-[900px] h-[100dvh] sm:h-[85vh] flex flex-col p-0 gap-0 overflow-hidden border-primary/20 bg-background"
      >
        <VisuallyHidden>
          <DialogTitle>Editor de Nota: {title}</DialogTitle>
        </VisuallyHidden>

        {/* Superior Header / Toolbar */}
        <DialogHeader className="px-4 py-3 border-b border-border/40 flex flex-row items-center justify-between space-y-0 bg-muted/30 backdrop-blur-sm">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex-1 max-w-2xl">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-black uppercase tracking-tighter border-none bg-transparent hover:bg-primary/5 focus:bg-primary/5 transition-all p-2 h-auto focus-visible:ring-0"
                placeholder="TÍTULO DO REGISTRO"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-border/40 ml-4 pl-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-full"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !title.trim()}
              className="gap-2 px-6 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Sincronizando..." : "Salvar"}
            </Button>
          </div>
        </DialogHeader>

        {/* Status Bar */}
        <div className="px-6 py-1.5 border-b border-border/20 bg-muted/10 flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-muted-foreground/60">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-primary/60" />
              <span>Estado: Online / Editável</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-primary/60" />
              <span>Última Sincronização: {formattedDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-3 bg-primary/40" />
            <div className="w-1 h-3 bg-primary/20" />
            <div className="w-1 h-3 bg-primary/10" />
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.02)_0%,transparent_70%)]">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={cn(
              "w-full h-full resize-none border-none bg-transparent p-8 md:p-12",
              "font-mono text-base leading-relaxed focus-visible:ring-0",
              "selection:bg-primary/20 selection:text-primary-foreground",
            )}
            placeholder="Aguardando entrada de dados..."
          />

          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-border/20 flex items-center justify-between text-[9px] font-mono uppercase text-muted-foreground/40">
          <span>Midnight Blue Memory Core v2.0</span>
          <span>End of File</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
