"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Carregando fichas...</p>
      </div>
    </div>
  );
}

export function UnauthenticatedState() {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Você precisa estar autenticado</p>
        <Link href="/login" className="text-primary hover:underline">
          Fazer login →
        </Link>
      </div>
    </div>
  );
}

export function ErrorState({ error }: { error: string }) {
  return (
    <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
      {error}
    </div>
  );
}

export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-lg border border-dashed p-12 text-center">
      <p className="text-muted-foreground mb-4">Nenhuma ficha criada ainda</p>
      <Button onClick={onCreate}>Criar Primeira Ficha</Button>
    </div>
  );
}
