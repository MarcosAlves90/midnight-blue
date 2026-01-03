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
import { Loader2, Folder, Trash2 } from "lucide-react";

interface DeleteFolderDialogProps {
  open: boolean;
  folderName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function DeleteFolderDialog({ open, folderName, onOpenChange, onConfirm }: DeleteFolderDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset error state when dialog closes
  useEffect(() => {
    if (!open) {
      setError(null);
      setIsLoading(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      setError("Erro ao excluir pasta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[400px] p-0 overflow-hidden border-destructive/20 bg-card"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-destructive/50" />
        
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded bg-destructive/10 text-destructive">
              <Trash2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Ação Irreversível
            </span>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic">
            Excluir Pasta
          </DialogTitle>
          <DialogDescription className="sr-only">
            Confirme a exclusão da pasta {folderName}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-4">
          <div className="bg-muted/30 rounded border border-destructive/20 p-4">
            <div className="flex items-start gap-3">
              <Folder className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-mono font-bold uppercase text-foreground">{folderName}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  Os personagens nesta pasta não serão excluídos.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-[10px] font-mono text-destructive uppercase bg-destructive/10 p-3 rounded border border-destructive/20">
              {error}
            </p>
          )}

          <div className="space-y-2 pt-2">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              Deseja realmente excluir a pasta &quot;{folderName}&quot;?
            </p>
          </div>

          <div className="flex gap-3">
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
              type="button"
              disabled={isLoading}
              onClick={handleConfirm}
              className="flex-1 font-mono text-[10px] uppercase tracking-widest bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Confirmar Exclusão"
              )}
            </Button>
          </div>
        </div>

        {/* Decorative footer */}
        <div className="px-6 py-3 border-t border-destructive/5 flex justify-between items-center opacity-30 bg-muted/10">
          <span className="text-[8px] font-mono uppercase tracking-tighter">Status: Aguardando Confirmação</span>
          <span className="text-[8px] font-mono uppercase tracking-tighter">Ref: DEL-{Math.random().toString(36).substring(2, 6).toUpperCase()}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
