"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewCharacterForm } from "@/components/pages/gallery/new-character-form";
import { Shield } from "lucide-react";

interface NewCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCharacterCreated?: () => void;
}

export function NewCharacterDialog({ open, onOpenChange, onCharacterCreated }: NewCharacterDialogProps) {
  const router = useRouter();

  const handleSuccess = (characterId: string) => {
    onOpenChange(false);
    onCharacterCreated?.();
    router.push(`/dashboard/personagem/individual/${characterId}`);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[450px] p-0 overflow-hidden border-primary/20 bg-card"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/50" />
        
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded bg-primary/10 text-primary">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Departamento de Registro de Super-Humanos
            </span>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic">
            Novo Dossiê
          </DialogTitle>
          <DialogDescription className="sr-only">
            Iniciando processo de catalogação de novo indivíduo.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4">
          <NewCharacterForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>

        {/* Decorative footer */}
        <div className="px-6 py-3 border-t border-primary/5 flex justify-between items-center opacity-30 bg-muted/10">
          <span className="text-[8px] font-mono uppercase tracking-tighter">Status: Aguardando Entrada de Dados</span>
          <span className="text-[8px] font-mono uppercase tracking-tighter">Ref: REG-{Math.random().toString(36).substring(2, 6).toUpperCase()}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
