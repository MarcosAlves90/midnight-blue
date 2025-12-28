"use client";

import Link from "next/link";
import { Info, PlusCircle } from "lucide-react";
import React from "react";

export default function NoCharacterSelected({
  message,
  showCreate = true,
}: {
  message?: string;
  showCreate?: boolean;
}) {
  return (
    <div className="rounded-lg border p-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 rounded-full bg-muted-foreground/10">
          <Info className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>

      <h3 className="text-lg font-semibold">Nenhuma ficha selecionada</h3>
      <p className="text-sm text-muted-foreground mt-2">
        {message ?? "Esta página requer que você tenha uma ficha selecionada."}
      </p>

      <div className="mt-4 flex items-center justify-center gap-3">
        <Link
          href="/dashboard/galeria"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Ir para Galeria
        </Link>

        {showCreate && (
          <Link
            href="/dashboard/personagem/novo"
            className="px-3 py-2 border rounded-lg text-sm hover:bg-muted-foreground/10 transition-colors"
          >
            <PlusCircle className="inline w-4 h-4 mr-2 align-middle" />
            Nova Ficha
          </Link>
        )}
      </div>
    </div>
  );
}
