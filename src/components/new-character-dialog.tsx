"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NewCharacterForm } from "@/components/new-character-form";

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
    router.push(`/dashboard/personagem/individual?id=${characterId}`);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-[400px]">
        <SheetHeader>
          <SheetTitle>Nova Ficha de Personagem</SheetTitle>
          <SheetDescription>
            Crie uma nova ficha de personagem com um nome de herói.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <NewCharacterForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
