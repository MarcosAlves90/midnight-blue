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
import { Trash2, ShieldAlert } from "lucide-react";

interface DeleteCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  heroName: string;
  isDeleting?: boolean;
}

export function DeleteCharacterDialog({
  open,
  onOpenChange,
  onConfirm,
  heroName,
  isDeleting = false,
}: DeleteCharacterDialogProps) {
  const [refId, setRefId] = useState("");

  useEffect(() => {
    setRefId(Math.random().toString(36).substring(2, 6).toUpperCase());
  }, [open]);

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
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Protocolo de Expurgo
            </span>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic">
            Eliminar Dossiê
          </DialogTitle>
          <DialogDescription className="sr-only">
            Confirmação de exclusão permanente do registro de {heroName}.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-4">
          <div className="bg-muted/30 rounded border border-destructive/20 p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-mono font-bold uppercase text-foreground">[{heroName}]</p>
                <p className="text-xs text-muted-foreground font-mono">
                  Esta ação removerá permanentemente todos os dados, atributos e histórico deste indivíduo do banco de dados central.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              Deseja realmente executar o expurgo deste arquivo?
            </p>
          </div>

          <div className="flex gap-3 sm:space-x-0">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChange(false);
              }}
              className="flex-1 font-mono text-[10px] uppercase tracking-widest border-primary/10 hover:bg-primary/5"
            >
              Abortar
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onConfirm();
              }}
              disabled={isDeleting}
              className="flex-1 font-mono text-[10px] uppercase tracking-widest bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? "Processando..." : "Executar Expurgo"}
            </Button>
          </div>
        </div>

        {/* Decorative footer */}
        <div className="px-6 py-3 border-t border-destructive/5 flex justify-between items-center opacity-30 bg-muted/10">
          <span className="text-[8px] font-mono uppercase tracking-tighter">Status: Aguardando Confirmação</span>
          <span className="text-[8px] font-mono uppercase tracking-tighter">Ref: EXP-{refId}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
