"use client";

import * as React from "react";
import { useIdentityContext } from "@/contexts/IdentityContext";
import { Button } from "@/components/ui/button";

export function ConflictBanner() {
  const { conflict, openConflictModal, resolveKeepLocal, resolveUseServer } = useIdentityContext();
  if (!conflict) return null;

  return (
    <div className="bg-amber-900 text-amber-50 p-3 rounded-md flex items-center justify-between gap-3">
      <div>
        <strong className="font-semibold">Conflito de Salvamento</strong>
        <div className="text-xs">Alterações recentes no servidor conflitaram com suas edições locais.</div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={openConflictModal} className="text-amber-50">Ver diferenças</Button>
        <Button size="sm" onClick={resolveUseServer} className="bg-amber-800">Aceitar servidor</Button>
        <Button size="sm" variant="outline" onClick={resolveKeepLocal}>Manter minhas alterações</Button>
      </div>
    </div>
  );
}
