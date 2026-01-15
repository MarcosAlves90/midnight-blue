"use client";

import { useState, useCallback, useMemo } from "react";
import { Power } from "./types";
import { PowerCard } from "./power-card";
import { PowerBuilderModal } from "./power-builder-modal";
import { EditToggle } from "@/components/ui/edit-toggle";
import { Plus, AlertTriangle, Sparkles } from "lucide-react";
import { useStatusContext } from "@/contexts/StatusContext";
import { usePowersContext } from "@/contexts/PowersContext";
import { checkPowerLimit } from "@/lib/powers/utils";

export default function PowersSection() {
  const { powerLevel } = useStatusContext();
  const { powers, addPower, updatePower, deletePower } = usePowersContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPower, setEditingPower] = useState<Power | undefined>();

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  const handleAddPower = (power: Power) => {
    // Fail-safe: garantir que o ID não seja temporário ao salvar no estado real
    const powerToSave = {
      ...power,
      id: (power.id === "preview" || power.id === "temp-preview-id") 
        ? crypto.randomUUID() 
        : power.id
    };

    if (editingPower) {
      // Update existing power
      updatePower(powerToSave);
      setEditingPower(undefined);
    } else {
      // Add new power
      addPower(powerToSave);
    }
  };

  const handleEditPower = useCallback((power: Power) => {
    setEditingPower(power);
    setIsModalOpen(true);
  }, []);

  const handleDeletePower = (id: string) => {
    deletePower(id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPower(undefined);
  };

  // Check for powers that exceed power level limits
  const powersExceedingLimit = powers.filter((power) =>
    checkPowerLimit(power, powerLevel),
  );

  // Sanitização de dados: remover IDs duplicados ou temporários que podem ter sido salvos
  // Isso evita o erro de "two children with the same key"
  const sanitizedPowers = useMemo(() => {
    const seenIds = new Set<string>();
    return powers.map(p => {
      const isTempId = p.id === "preview" || p.id === "temp-preview-id";
      if (isTempId || seenIds.has(p.id)) {
        const newId = crypto.randomUUID();
        seenIds.add(newId);
        return { ...p, id: newId };
      }
      seenIds.add(p.id);
      return p;
    });
  }, [powers]);

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h2 className="text-lg font-semibold">
          Poderes
        </h2>
        
        <div className="flex items-center gap-2">
          {isEditMode && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/30 transition-all active:scale-95"
            >
              <Plus className="h-3 w-3" />
              Injetar
            </button>
          )}
          <EditToggle 
            isActive={isEditMode} 
            onToggle={toggleEditMode}
            activeTitle="Trancar Modificações"
            inactiveTitle="Hackear Poderes"
          />
        </div>
      </div>

      {powersExceedingLimit.length > 0 && (
        <div className="mb-6 p-3 bg-amber-500/5 border border-amber-500/20 rounded flex items-start gap-3">
          <div className="p-1 bg-amber-500/20 rounded">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/80">
              Protocolo de Segurança Violado
            </p>
            <p className="text-[11px] text-amber-200/60 leading-tight">
              {powersExceedingLimit.length} entradas estão operando acima do limite nominal (NP {powerLevel}).
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {sanitizedPowers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-white/5 bg-zinc-900/20 backdrop-blur-sm rounded-lg">
            <Sparkles className="h-8 w-8 text-zinc-700 mb-3" />
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
              Nenhuma Habilidade Detectada
            </p>
          </div>
        ) : (
          sanitizedPowers.map((power) => (
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
