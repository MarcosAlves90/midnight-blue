"use client";

import { memo, useEffect } from "react";
import { X } from "lucide-react";
import { Power } from "./types";
import { getPowerDefaults } from "@/lib/powers/utils";
import { PowerBuilderPreview } from "./power-builder-preview";
import { usePowerBuilder } from "./use-power-builder";
import { PowerCompositionHub } from "./power-composition-hub";

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
    customAction,
    setCustomAction,
    customRange,
    setCustomRange,
    customDuration,
    setCustomDuration,
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
  } = usePowerBuilder(editingPower);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSave = () => {
    if (selectedEffects.length === 0 || !name.trim()) return;
    onSave(previewPower);
    onClose();
  };

  const {
    action: defaultAction,
    range: defaultRange,
    duration: defaultDuration,
  } = getPowerDefaults(selectedEffects);

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
          className="absolute top-4 right-4 z-[60] p-2 hover:bg-white/10 text-zinc-500 hover:text-white transition-all border border-white/5 opacity-0 lg:opacity-100"
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
                customAction={customAction}
                onActionChange={setCustomAction}
                customRange={customRange}
                onRangeChange={setCustomRange}
                customDuration={customDuration}
                onDurationChange={setCustomDuration}
                defaultAction={defaultAction}
                defaultRange={defaultRange}
                defaultDuration={defaultDuration}
                alternatives={alternatives}
                onAddAlternative={addAlternative}
                onRemoveAlternative={removeAlternative}
                onUpdateAlternative={updateAlternative}
              />
            </div>

            {/* Global Actions Bar */}
            <div className="p-4 bg-black/60 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
              >
                DESCARTAR ALTERAÇÕES
              </button>

              <button
                onClick={handleSave}
                disabled={!canProceed()}
                className="px-8 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:grayscale text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-purple-500/20 active:scale-95"
              >
                {isEditing ? "Atualizar Poder" : "Finalizar Construção"}
              </button>
            </div>
          </div>

          {/* Right Column: Live Context & Preview */}
          <div className="hidden lg:flex flex-col overflow-hidden bg-muted/50">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Preview Operacional
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
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
