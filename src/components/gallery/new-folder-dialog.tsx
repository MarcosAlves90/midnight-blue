"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderPlus, Loader2, Folder as FolderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, parentId: string | null) => Promise<void>;
  parentId: string | null;
}

export function NewFolderDialog({ open, onOpenChange, onCreate, parentId }: NewFolderDialogProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setName("");
      setError(null);
      setIsLoading(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("O nome da pasta é obrigatório");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onCreate(name.trim(), parentId);
      setName("");
      onOpenChange(false);
    } catch {
      setError("Erro ao criar pasta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[400px] p-0 overflow-hidden border-primary/20 bg-card"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/50" />
        
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded bg-primary/10 text-primary">
              <FolderPlus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Sistema de Arquivamento
            </span>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic">
            Nova Seção
          </DialogTitle>
          <DialogDescription className="sr-only">
            Criando novo diretório para organização de dossiês.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary/70 flex items-center gap-1.5">
              <FolderIcon className="w-3 h-3" />
              Identificador da Pasta
            </label>
            <Input
              placeholder="EX: COLIGAÇÃO MELLÍFERA"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className={cn(
                "bg-muted/20 border-primary/10 font-mono uppercase placeholder:opacity-30 focus-visible:ring-primary/30",
                error && "border-destructive/50"
              )}
              autoFocus
              disabled={isLoading}
            />
            {error && (
              <p className="text-[10px] font-mono text-destructive uppercase mt-1">{error}</p>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 font-mono text-[10px] uppercase tracking-widest border-primary/10 hover:bg-primary/5"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 font-mono text-[10px] uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Criando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </div>
        </form>

        {/* Decorative footer */}
        <div className="px-6 py-3 border-t border-primary/5 flex justify-between items-center opacity-30 bg-muted/10">
          <span className="text-[8px] font-mono uppercase tracking-tighter">Indexação: Automática</span>
          <span className="text-[8px] font-mono uppercase tracking-tighter">Ref: DIR-{Math.random().toString(36).substring(2, 6).toUpperCase()}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
