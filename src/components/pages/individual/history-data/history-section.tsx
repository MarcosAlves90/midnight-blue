import React from "react";
import { BookOpen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useIdentityActions } from "@/contexts/IdentityContext";
import { useFieldLocalState } from "@/hooks/use-field-local-state";
import { useIdentityField } from "@/hooks/use-identity-field";

function HistorySectionInner() {
  const { markFieldDirty, updateIdentity } = useIdentityActions();
  const ext = useIdentityField("history");
  const { value, handleChange, handleBlur } = useFieldLocalState(
    ext || "",
    (v: string) => updateIdentity("history", v),
    {
      debounceMs: 300,
      fieldName: "history",
      onDirty: () => markFieldDirty("history"),
    },
  );

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug("[dev-history-section] render");
    }
  });

  return (
    <div className="bg-muted/50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/40">
        <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Análise de Monitoramento
        </h3>
      </div>

      <div className="space-y-1.5">
        <Textarea
          id="history"
          name="history"
          value={value}
          onChange={(e) => handleChange(e)}
          onBlur={handleBlur}
          className="bg-muted/20 border-transparent focus:bg-background min-h-[200px] resize-y"
          placeholder="Escreva sua história aqui..."
          aria-label="História do personagem"
        />
      </div>
    </div>
  );
}

export const HistorySection = React.memo(HistorySectionInner);
