"use client";

import { POWER_TIPS } from "@/lib/powers";
import { Tip } from "@/components/ui/tip";
import { Input } from "@/components/ui/input";
import { memo, useState } from "react";
import { useCustomDescriptors } from "@/contexts/CustomDescriptorsContext";
import { Plus, X } from "lucide-react";

const TipContent = memo(({ content }: { content: string }) => (
  <div className="max-w-xs text-xs">{content}</div>
));
TipContent.displayName = "TipContent";

interface PowerBuilderStepDetailsProps {
  name: string;
  onNameChange: (name: string) => void;
  selectedDescriptors: string[];
  onToggleDescriptor: (descriptor: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const PowerBuilderStepDetails = memo(
  ({
    name,
    onNameChange,
    selectedDescriptors,
    onToggleDescriptor,
    notes,
    onNotesChange,
  }: PowerBuilderStepDetailsProps) => {
    const { customDescriptors, addCustomDescriptor, removeCustomDescriptor } =
      useCustomDescriptors();
    const [newDescriptor, setNewDescriptor] = useState("");
    const [showNewDescriptorInput, setShowNewDescriptorInput] = useState(false);

    const handleAddDescriptor = () => {
      if (newDescriptor.trim()) {
        const normalized = newDescriptor.trim().toLowerCase();
        addCustomDescriptor(normalized);
        onToggleDescriptor(normalized);
        setNewDescriptor("");
        setShowNewDescriptorInput(false);
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Detalhes Finais
          </h3>
          <p className="text-sm text-muted-foreground">
            Dê um nome e personalize seu poder.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nome do Poder *
            </label>
            <Input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Ex: Rajada de Fogo, Escudo Mental..."
              className="bg-background/50 border-purple-500/30 text-lg"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Tip content={<TipContent content={POWER_TIPS.descriptors} />}>
              <label className="text-sm font-medium text-foreground cursor-help underline decoration-dotted underline-offset-2">
                Descritores
              </label>
            </Tip>

            <div className="space-y-2 p-2 bg-muted/5 rounded-md border border-border/40">
              {/* Descritores Customizados */}
              {customDescriptors.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Seus Descritores:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {customDescriptors.map((descriptor) => (
                      <div
                        key={descriptor}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-md transition-colors ${
                          selectedDescriptors.includes(descriptor)
                            ? "bg-green-500/10 text-green-300 border border-green-500/30"
                            : "bg-background border border-border/20 hover:border-green-500/40"
                        }`}
                      >
                        <button
                          onClick={() => onToggleDescriptor(descriptor)}
                          className="hover:font-semibold transition-all flex-1"
                        >
                          {descriptor}
                        </button>
                        <button
                          onClick={() => {
                            removeCustomDescriptor(descriptor);
                            if (selectedDescriptors.includes(descriptor)) {
                              onToggleDescriptor(descriptor);
                            }
                          }}
                          className="hover:text-red-400 transition-colors p-0.5 ml-1"
                          title="Remover descritor"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input para Novo Descritor */}
              <div>
                {!showNewDescriptorInput ? (
                  <button
                    onClick={() => setShowNewDescriptorInput(true)}
                    className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Criar novo
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={newDescriptor}
                      onChange={(e) => setNewDescriptor(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddDescriptor();
                        if (e.key === "Escape")
                          setShowNewDescriptorInput(false);
                      }}
                      placeholder="Digite o novo descritor..."
                      className="h-7 text-sm"
                      autoFocus
                    />
                    <button
                      onClick={handleAddDescriptor}
                      disabled={!newDescriptor.trim()}
                      className="px-2 py-0.5 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-purple-300 border border-purple-500/50 rounded text-xs transition-colors"
                    >
                      Adicionar
                    </button>
                    <button
                      onClick={() => {
                        setShowNewDescriptorInput(false);
                        setNewDescriptor("");
                      }}
                      className="px-2 py-0.5 bg-muted/50 hover:bg-muted text-muted-foreground rounded text-xs transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Descrição adicional, limitações narrativas..."
              className="w-full h-32 px-3 py-2 text-sm bg-background/50 border border-purple-500/30 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    );
  },
);

PowerBuilderStepDetails.displayName = "PowerBuilderStepDetails";
