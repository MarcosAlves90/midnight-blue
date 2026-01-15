"use client";

import { memo, useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Power } from "./types";
import { PowerBuilderPreview } from "./power-builder-preview";
import { usePowerBuilder } from "./use-power-builder";
import { PowerCompositionHub } from "./power-composition-hub";
import { useAuth } from "@/contexts/AuthContext";
import { PowerService } from "@/services/power-service";
import { toast } from "@/lib/toast";

interface PowerBuilderModalProps {
  onClose: () => void;
  onSave: (power: Power) => void;
  editingPower?: Power;
}

function PowerBuilderModalContent({
  onClose,
  onSave,
  editingPower,
}: PowerBuilderModalProps) {
  const isEditing = !!editingPower;
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const {
    name,
    setName,
    selectedEffects,
    toggleEffect,
    rank,
    selectedModifierInstances,
    addModifierInstance,
    removeModifierInstance,
    updateModifierOptions,
    selectedDescriptors,
    toggleDescriptor,
    notes,
    setNotes,
    effectOptions,
    updateEffectOptions,
    alternatives,
    addAlternative,
    removeAlternative,
    updateAlternative,
    filteredExtras,
    filteredFlaws,
    calculateCost,
    previewPower,
    canProceed,
    image,
    setImage,
    pendingImageFile,
    setPendingImageFile,
  } = usePowerBuilder(editingPower);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSave = async () => {
    if (selectedEffects.length === 0 || !name.trim()) return;
    
    setIsSaving(true);
    try {
      let finalImage = image;

      // 1. Lógica de Imagem (Cloudinary)
      // Se há um novo arquivo pendente, faz upload dele (e deleta o antigo se existir)
      if (pendingImageFile) {
        const uploadResult = await PowerService.uploadPowerCover(
          pendingImageFile,
          editingPower?.image?.publicId
        );
        if (uploadResult) {
          finalImage = uploadResult;
        }
      } 
      // Se não há novo arquivo, mas o usuário removeu a imagem existente
      else if (!image && editingPower?.image?.publicId) {
        await PowerService.rollbackImage(editingPower.image.publicId);
      }

      // 2. Garantir que um novo poder tenha um ID único
      const powerToSave: Power = {
        ...previewPower,
        id: editingPower?.id || crypto.randomUUID(),
        image: finalImage
      };

      // 3. Se o usuário está logado, tenta salvar na biblioteca
      if (user) {
        const result = await PowerService.savePowerToLibrary(user.uid, powerToSave);
        if (!result.success) {
          console.warn("Poder salvo na ficha, mas falhou ao salvar na biblioteca:", result.error);
        }
      }

      onSave(powerToSave);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar poder:", error);
      toast.error("Erro ao finalizar a construção do poder.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-background w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col ring-1 ring-white/10 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-2 z-[60] p-2 hover:bg-white/10 text-zinc-500 hover:text-white transition-all border border-white/5 opacity-0 lg:opacity-100"
          title="Fechar (Esc)"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Composition Workbench */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4">
          {/* Main Workspace */}
          <div className="lg:col-span-3 flex flex-col overflow-hidden border-r border-white/5">
            <div className="flex-1 overflow-hidden">
              <PowerCompositionHub
                name={name}
                onNameChange={setName}
                selectedEffects={selectedEffects}
                onToggleEffect={toggleEffect}
                effectOptions={effectOptions}
                onUpdateEffectOptions={updateEffectOptions}
                rank={rank}
                selectedModifierInstances={selectedModifierInstances}
                onAddModifier={addModifierInstance}
                onRemoveModifier={removeModifierInstance}
                onUpdateModifierOptions={updateModifierOptions}
                availableExtras={filteredExtras}
                availableFlaws={filteredFlaws}
                selectedDescriptors={selectedDescriptors}
                onToggleDescriptor={toggleDescriptor}
                notes={notes}
                onNotesChange={setNotes}
                alternatives={alternatives}
                onAddAlternative={addAlternative}
                onRemoveAlternative={removeAlternative}
                onUpdateAlternative={updateAlternative}
                image={image}
                onImageChange={setImage}
                pendingImageFile={pendingImageFile}
                onPendingImageChange={setPendingImageFile}
              />
            </div>

            {/* Global Actions Bar */}
            <div className="p-4 bg-black/60 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-bold cursor-pointer text-zinc-500 hover:text-white transition-colors"
              >
                DESCARTAR ALTERAÇÕES
              </button>

              <button
                onClick={handleSave}
                disabled={!canProceed() || isSaving}
                className="px-8 py-2.5 bg-purple-600 cursor-pointer hover:bg-purple-500 disabled:opacity-30 disabled:grayscale text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20 active:scale-95 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  isEditing ? "Atualizar Poder" : "Finalizar Construção"
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Context & Preview */}
          <div className="hidden lg:flex flex-col overflow-hidden bg-muted/50">
            <div className="max-h-16 h-full px-2 flex items-center border-b border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Preview Operacional
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              <PowerBuilderPreview
                power={previewPower}
                calculateCost={calculateCost}
                selectedModifierInstances={selectedModifierInstances}
                selectedEffects={selectedEffects}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const PowerBuilderModal = memo(PowerBuilderModalContent);
