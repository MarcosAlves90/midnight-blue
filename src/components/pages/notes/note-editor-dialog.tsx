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
import { Save, Trash2, X } from "lucide-react";

interface NoteEditorDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (noteId: string, updates: Partial<Note>) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
}

export function NoteEditorDialog({ note, open, onOpenChange, onSave, onDelete }: NoteEditorDialogProps) {
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
    if (confirm("Tem certeza que deseja excluir esta nota?")) {
      await onDelete(note.id);
      onOpenChange(false);
    }
  };

  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        showCloseButton={false}
        className="sm:max-w-[800px] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden border-primary/20"
      >
        <VisuallyHidden>
          <DialogTitle>Editor de Nota: {title}</DialogTitle>
        </VisuallyHidden>
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-muted/30">
          <div className="flex-1 mr-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-none bg-transparent text-lg font-bold uppercase tracking-tighter focus-visible:ring-0 p-0 h-auto"
              placeholder="Título da nota"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving || !title.trim()} className="gap-2">
              <Save className="w-4 h-4" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden p-4 bg-background/50">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full resize-none border-none bg-transparent focus-visible:ring-0 p-0 font-mono text-sm leading-relaxed"
            placeholder="Comece a escrever..."
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
