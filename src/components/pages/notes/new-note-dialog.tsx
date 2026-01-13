"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Plus } from "lucide-react";

interface NewNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (
    title: string,
    content: string,
    folderId: string | null,
  ) => Promise<void>;
  currentFolderId: string | null;
}

export function NewNoteDialog({
  open,
  onOpenChange,
  onCreate,
  currentFolderId,
}: NewNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreate(title, content, currentFolderId);
      setTitle("");
      setContent("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-primary/20 bg-background/95 backdrop-blur-md">
        <DialogHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <StickyNote className="w-12 h-12 rotate-12" />
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="uppercase font-black tracking-tighter text-xl">
                Novo Registro
              </DialogTitle>
              <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest mt-0.5">
                Criar nova entrada no banco de dados
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2 group">
            <Label
              htmlFor="title"
              className="text-[10px] uppercase font-bold text-primary/70 tracking-widest ml-1"
            >
              Título da Nota
            </Label>
            <Input
              id="title"
              placeholder="Ex: Teoria sobre o Incidente, Contatos do submundo..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted/10 border-transparent focus:border-primary/50 focus:bg-muted/20 transition-all font-bold uppercase tracking-tight h-11"
              autoFocus
            />
          </div>

          <div className="space-y-2 group">
            <Label
              htmlFor="content"
              className="text-[10px] uppercase font-bold text-primary/70 tracking-widest ml-1"
            >
              Conteúdo Inicial
            </Label>
            <Textarea
              id="content"
              placeholder="Inicie o registro das informações aqui..."
              className="min-h-[200px] bg-muted/10 border-transparent focus:border-primary/50 focus:bg-muted/20 transition-all font-mono text-sm resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="uppercase font-bold text-[11px] tracking-widest"
            >
              Abortar
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="min-w-[120px] uppercase font-black tracking-widest shadow-[0_0_15px_rgba(var(--primary),0.2)]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Salvando
                </div>
              ) : (
                "Gerar Registro"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
