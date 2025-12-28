"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIdentityContext } from "@/contexts/IdentityContext";
import { Button } from "@/components/ui/button";

export function ConflictModal() {
  const { conflict, closeConflictModal, resolveKeepLocal, resolveUseServer } = useIdentityContext();
  const [open, setOpen] = React.useState(!!conflict);

  React.useEffect(() => setOpen(!!conflict), [conflict]);

  if (!conflict) return null;

  const local = (conflict.attempted?.identity ?? {}) as Record<string, unknown>;
  const server = (conflict.server?.identity ?? {}) as unknown as Record<string, unknown>;

  // Build a simple diff list (shallow) for display
  const keys = Array.from(new Set([...Object.keys(server), ...Object.keys(local)])).sort();

  return (
    <Sheet open={open} onOpenChange={(v) => { setOpen(v); if (!v) closeConflictModal(); }}>
      <SheetContent side="right" className="sm:max-w-[560px]">
        <SheetHeader>
          <SheetTitle>Resolver Conflito de Salvamento</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="text-sm">Aqui estão as diferenças entre sua versão local e a versão do servidor.</div>

          <div className="grid grid-cols-1 gap-2">
            {keys.map((k) => {
              const lv = local[k];
              const sv = server[k];
              const changed = lv !== sv;
              if (!changed) return null;
              return (
                <div key={k} className="p-2 rounded-md bg-muted/30">
                  <div className="text-xs text-muted-foreground">{k}</div>
                  <div className="flex gap-4 mt-1">
                    <div className="flex-1">
                      <div className="text-[12px] font-medium">Local</div>
                      <pre className="text-xs whitespace-pre-wrap">{String(lv)}</pre>
                    </div>
                    <div className="flex-1">
                      <div className="text-[12px] font-medium">Servidor</div>
                      <pre className="text-xs whitespace-pre-wrap">{String(sv)}</pre>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button variant="outline" onClick={resolveUseServer}>Aceitar servidor</Button>
            <Button variant="destructive" onClick={resolveKeepLocal}>Manter minhas alterações</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
