"use client";

import { useState, useCallback } from "react";
import { Power } from "./types";
import { PowerCard } from "./power-card";
import { PowerBuilderModal } from "./power-builder-modal";
import { Plus, Edit3, Lock, AlertTriangle } from "lucide-react";
import { useStatusContext } from "@/contexts/StatusContext";

interface PowersSectionProps {}

export default function PowersSection({}: PowersSectionProps) {
  const { powerLevel } = useStatusContext();
  const [powers, setPowers] = useState<Power[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPower, setEditingPower] = useState<Power | undefined>();

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  const handleAddPower = (power: Power) => {
    if (editingPower) {
      // Update existing power
      setPowers((prev) => prev.map((p) => (p.id === power.id ? power : p)));
      setEditingPower(undefined);
    } else {
      // Add new power
      setPowers((prev) => [...prev, power]);
    }
  };

  const handleEditPower = useCallback((power: Power) => {
    setEditingPower(power);
    setIsModalOpen(true);
  }, []);

  const handleDeletePower = (id: string) => {
    setPowers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPower(undefined);
  };

  // Check for powers that exceed power level limits
  const powersExceedingLimit = powers.filter((power) => {
    // Effects with attack roll: rank + attack bonus <= PL * 2
    // Effects without attack (perception/save): rank <= PL
    const hasAttack = power.effects.some((e) => e.range !== "percepcao");
    const maxRank = hasAttack ? powerLevel * 2 : powerLevel;
    return power.rank > maxRank;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold">Poderes</h2>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <button
              onClick={() => setIsModalOpen(true)}
              className={`p-2 rounded-lg cursor-pointer transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90`}
              title="Adicionar Poder"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={toggleEditMode}
            className={`p-2 rounded cursor-pointer transition-all duration-200 ${
              isEditMode
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30"
            }`}
            title={
              isEditMode ? "Desativar modo de edição" : "Ativar modo de edição"
            }
            aria-label={
              isEditMode ? "Desativar modo de edição" : "Ativar modo de edição"
            }
            aria-pressed={isEditMode}
          >
            {isEditMode ? (
              <Edit3 className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {powersExceedingLimit.length > 0 && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <strong>Aviso:</strong> {powersExceedingLimit.length} poder(es)
            excedem o limite de NP {powerLevel}.
          </div>
        </div>
      )}

      <div className="space-y-2">
        {powers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum poder criado
          </div>
        ) : (
          powers.map((power) => (
            <PowerCard
              key={power.id}
              power={power}
              onDelete={handleDeletePower}
              onEdit={handleEditPower}
              isEditMode={isEditMode}
            />
          ))
        )}
      </div>

      {isModalOpen && (
        <PowerBuilderModal
          onClose={handleCloseModal}
          onSave={handleAddPower}
          editingPower={editingPower}
        />
      )}
    </>
  );
}
