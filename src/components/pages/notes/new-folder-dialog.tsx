"use client";

import { useState, useEffect } from "react";
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
import { NoteFolder } from "@/lib/note-service";

interface NewFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, parentId: string | null) => Promise<void>;
  onUpdate?: (folderId: string, name: string) => Promise<void>;
  parentId: string | null;
  folderToEdit?: NoteFolder | null;
}

export function NewFolderDialog({
  open,
  onOpenChange,
  onCreate,
  onUpdate,
  parentId,
  folderToEdit,
}: NewFolderDialogProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
    } else {
      setName("");
    }
  }, [folderToEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (folderToEdit && onUpdate) {
        await onUpdate(folderToEdit.id, name);
      } else {
        await onCreate(name, parentId);
      }
      setName("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="uppercase font-bold tracking-tighter">
            {folderToEdit ? "Editar Pasta" : "Nova Pasta"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Pasta</Label>
            <Input
              id="name"
              placeholder="Ex: Campanha X, NPCs, Lore..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : folderToEdit
                  ? "Salvar Alterações"
                  : "Criar Pasta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
