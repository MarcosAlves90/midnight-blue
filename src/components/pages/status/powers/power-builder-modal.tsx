"use client";

import { memo } from "react";
import { Power } from "./types";
import { getPowerDefaults } from "@/lib/powers/utils";
import { PowerBuilderHeader } from "./power-builder-header";
import { PowerBuilderStepEffects } from "./power-builder-step-effects";
import { PowerBuilderStepParameters } from "./power-builder-step-parameters";
import { PowerBuilderStepDetails } from "./power-builder-step-details";
import { PowerBuilderFooter } from "./power-builder-footer";
import { PowerBuilderPreview } from "./power-builder-preview";
import { usePowerBuilder } from "./use-power-builder";

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
    step,
    setStep,
    searchTerm,
    setSearchTerm,
    name,
    setName,
    selectedEffects,
    toggleEffect,
    rank,
    setRank,
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
    filteredEffects,
    filteredExtras,
    filteredFlaws,
    calculateCost,
    previewPower,
    canProceed,
  } = usePowerBuilder(editingPower);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card border border-purple-500/20 rounded-xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <PowerBuilderHeader
          isEditing={isEditing}
          step={step}
          onClose={onClose}
        />

        {/* Main Content Grid */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
          {/* Left Column: Steps */}
          <div className="lg:col-span-2 flex flex-col overflow-hidden border-r border-border/50">
            <div className="flex-1 overflow-y-auto p-6">
              {step === 1 && (
                <PowerBuilderStepEffects
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  filteredEffects={filteredEffects}
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
                  alternatives={alternatives}
                  onAddAlternative={addAlternative}
                  onRemoveAlternative={removeAlternative}
                  onUpdateAlternative={updateAlternative}
                />
              )}

              {step === 2 && (
                <PowerBuilderStepParameters
                  rank={rank}
                  onRankChange={setRank}
                  customAction={customAction}
                  onActionChange={setCustomAction}
                  customRange={customRange}
                  onRangeChange={setCustomRange}
                  customDuration={customDuration}
                  onDurationChange={setCustomDuration}
                  defaultAction={defaultAction}
                  defaultRange={defaultRange}
                  defaultDuration={defaultDuration}
                  effectOptions={effectOptions}
                />
              )}

              {step === 3 && (
                <PowerBuilderStepDetails
                  name={name}
                  onNameChange={setName}
                  selectedDescriptors={selectedDescriptors}
                  onToggleDescriptor={toggleDescriptor}
                  notes={notes}
                  onNotesChange={setNotes}
                />
              )}
            </div>

            {/* Footer Navigation */}
            <PowerBuilderFooter
              step={step}
              isEditing={isEditing}
              canProceed={canProceed()}
              onPrevious={() => setStep((prev) => prev - 1)}
              onNext={() => setStep((prev) => prev + 1)}
              onSave={handleSave}
              onClose={onClose}
            />
          </div>

          {/* Right Column: Preview */}
          <PowerBuilderPreview
            power={previewPower}
            calculateCost={calculateCost}
            selectedModifierInstances={selectedModifierInstances}
            selectedEffects={selectedEffects}
          />
        </div>
      </div>
    </div>
  );
}

export const PowerBuilderModal = memo(PowerBuilderModalContent);
