"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { useStatusContext } from "@/contexts/StatusContext";
import {
  Power,
  Effect,
  Modifier,
  ModifierInstance,
  ActionType,
  RangeType,
  DurationType,
} from "./types";
import {
  EFFECTS,
  COMMON_EXTRAS,
  COMMON_FLAWS,
  EFFECT_SPECIFIC_EXTRAS,
  EFFECT_SPECIFIC_FLAWS,
} from "@/lib/powers";
import { PowerBuilderHeader } from "./power-builder-header";
import { PowerBuilderStepEffects } from "./power-builder-step-effects";
import { PowerBuilderStepParameters } from "./power-builder-step-parameters";
import { PowerBuilderStepModifiers } from "./power-builder-step-modifiers";
import { PowerBuilderStepDetails } from "./power-builder-step-details";
import { PowerBuilderFooter } from "./power-builder-footer";
import { PowerBuilderPreview } from "./power-builder-preview";

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
  const { powerLevel } = useStatusContext();
  
  const isEditing = !!editingPower;
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [name, setName] = useState(editingPower?.name || "");
  const [selectedEffects, setSelectedEffects] = useState<Effect[]>(
    editingPower?.effects || [],
  );
  const [rank, setRank] = useState(editingPower?.rank || 1);
  const [selectedModifierInstances, setSelectedModifierInstances] = useState<
    ModifierInstance[]
  >(editingPower?.modifiers || []);
  const [selectedDescriptors, setSelectedDescriptors] = useState<string[]>(
    editingPower?.descriptors || [],
  );
  const [customAction, setCustomAction] = useState<ActionType | null>(
    editingPower?.customAction || null,
  );
  const [customRange, setCustomRange] = useState<RangeType | null>(
    editingPower?.customRange || null,
  );
  const [customDuration, setCustomDuration] = useState<DurationType | null>(
    editingPower?.customDuration || null,
  );
  const [notes, setNotes] = useState(editingPower?.notes || "");
  // Effect-specific options (seleções que são parte do efeito, não modificadores)
  const [effectOptions, setEffectOptions] = useState<Record<string, import("./types").EffectOptions>>(
    editingPower?.effectOptions || {},
  );


  // Filtered Lists
  const filteredEffects = useMemo(
    () =>
      EFFECTS.filter(
        (e) =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  );

  const filteredExtras = useMemo(() => {
    const q = searchTerm.toLowerCase();
    // Incluir apenas COMMON extras que correspondem à pesquisa e, se tiver appliesTo, só se um efeito correspondente estiver selecionado
    const common = COMMON_EXTRAS.filter((m) => {
      const matchesQuery =
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q);
      const appliesOk =
        !m.appliesTo ||
        m.appliesTo.some((effectId) =>
          selectedEffects.some((e) => e.id === effectId),
        );
      return matchesQuery && appliesOk;
    });

    // incluir extras específicos quando aplicáveis aos efeitos selecionados
    // Protege contra referências indefinidas caso a constante não esteja carregada (HMR / build stale)
    const specific = (
      typeof EFFECT_SPECIFIC_EXTRAS !== "undefined"
        ? EFFECT_SPECIFIC_EXTRAS
        : []
    ).filter(
      (m) =>
        (m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)) &&
        !!m.appliesTo &&
        m.appliesTo.some((effectId) =>
          selectedEffects.some((e) => e.id === effectId),
        ),
    );

    // deduplicar por id, preferindo specific (que podem ter appliesTo)
    const map = new Map<string, Modifier>();
    [...common, ...specific].forEach((m) => map.set(m.id, m));
    return Array.from(map.values());
  }, [searchTerm, selectedEffects]);

  const filteredFlaws = useMemo(() => {
    const q = searchTerm.toLowerCase();
    const common = COMMON_FLAWS.filter((m) => {
      const matchesQuery =
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q);
      const appliesOk =
        !m.appliesTo ||
        m.appliesTo.some((effectId) =>
          selectedEffects.some((e) => e.id === effectId),
        );
      return matchesQuery && appliesOk;
    });
    // Protege contra referências indefinidas (veja nota acima)
    const specific = (
      typeof EFFECT_SPECIFIC_FLAWS !== "undefined" ? EFFECT_SPECIFIC_FLAWS : []
    ).filter(
      (m) =>
        (m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)) &&
        !!m.appliesTo &&
        m.appliesTo.some((effectId) =>
          selectedEffects.some((e) => e.id === effectId),
        ),
    );

    const map = new Map<string, Modifier>();
    [...common, ...specific].forEach((m) => map.set(m.id, m));
    return Array.from(map.values());
  }, [searchTerm, selectedEffects]);

  // Handlers
  const toggleEffect = useCallback((effect: Effect) => {
    setSelectedEffects((prev) => {
      const isSelected = prev.some((e) => e.id === effect.id);
      const next = isSelected
        ? prev.filter((e) => e.id !== effect.id)
        : [...prev, effect];

      // Remover modificadores específicos que não se aplicam mais a nenhum efeito selecionado
      setSelectedModifierInstances((current) =>
        current.filter((inst) => {
          const applies = inst.modifier.appliesTo;
          if (!applies || applies.length === 0) return true;
          return applies.some((effectId) =>
            next.some((e) => e.id === effectId),
          );
        }),
      );

      return next;
    });
  }, []);

  const addModifierInstance = useCallback((modifier: Modifier) => {
    const newInstance: ModifierInstance = {
      id: crypto.randomUUID(),
      modifierId: modifier.id,
      modifier,
      customDescription: undefined,
    };
    setSelectedModifierInstances((prev) => [...prev, newInstance]);
  }, []);

  const removeModifierInstance = useCallback((instanceId: string) => {
    setSelectedModifierInstances((prev) =>
      prev.filter((m) => m.id !== instanceId),
    );
  }, []);

  const updateModifierDescription = useCallback(
    (instanceId: string, description: string) => {
      setSelectedModifierInstances((prev) =>
        prev.map((m) =>
          m.id === instanceId
            ? { ...m, customDescription: description || undefined }
            : m,
        ),
      );
    },
    [],
  );

  const toggleDescriptor = useCallback((descriptor: string) => {
    setSelectedDescriptors((prev) =>
      prev.includes(descriptor)
        ? prev.filter((d) => d !== descriptor)
        : [...prev, descriptor],
    );
  }, []);

  // Calculations
  const calculateCost = (): number => {
    if (selectedEffects.length === 0) return 0;

    // Calcular custo base dos efeitos, considerando effectOptions (ex: ppCost para Ambiente)
    const baseEffect = selectedEffects.reduce((acc, e) => {
      const opts = effectOptions[e.id];
      const ppCost = opts?.ppCost ?? e.baseCost;
      return acc + ppCost;
    }, 0);
    const extrasTotal = selectedModifierInstances
      .filter((m) => m.modifier.type === "extra" && !m.modifier.isFlat)
      .reduce((acc, m) => acc + m.modifier.costPerRank, 0);
    const flawsTotal = selectedModifierInstances
      .filter((m) => m.modifier.type === "falha" && !m.modifier.isFlat)
      .reduce((acc, m) => acc + m.modifier.costPerRank, 0);
    const flatModifiers = selectedModifierInstances
      .filter((m) => m.modifier.isFlat)
      .reduce((acc, m) => acc + m.modifier.costPerRank, 0);

    const costPerRank = baseEffect + extrasTotal + flawsTotal;
    let totalCost: number;
    if (costPerRank <= 0) {
      const ranksPerPoint = Math.min(5, Math.abs(costPerRank - 1) + 1);
      totalCost = Math.ceil(rank / ranksPerPoint);
    } else {
      totalCost = costPerRank * rank;
    }
    return Math.max(1, totalCost + flatModifiers);
  };

  const previewPower: Power = {
    id: "preview",
    name: name.trim() || "Novo Poder",
    effects: selectedEffects,
    rank,
    descriptors: selectedDescriptors,
    modifiers: selectedModifierInstances,
    customAction: customAction || undefined,
    customRange: customRange || undefined,
    customDuration: customDuration || undefined,
    notes: notes.trim() || undefined,
    effectOptions,
  };

  const handleSave = () => {
    if (selectedEffects.length === 0 || !name.trim()) return;
    const powerToSave = isEditing
      ? { ...previewPower, id: editingPower.id }
      : { ...previewPower, id: crypto.randomUUID() };
    // incluir effectOptions no objeto final salvo
    const powerWithOptions = { ...powerToSave, effectOptions };
    onSave(powerWithOptions);
    onClose();
  };

  const canProceed = () => {
    if (step === 1) return selectedEffects.length > 0;
    if (step === 2) return rank >= 1;
    if (step === 3) return true;
    if (step === 4) return !!name.trim();
    return false;
  };

  const defaultAction = selectedEffects[0]?.action || "padrao";
  const defaultRange = selectedEffects[0]?.range || "perto";
  const defaultDuration = selectedEffects[0]?.duration || "instantaneo";

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
                  onUpdateEffectOptions={(effectId, opts) =>
                    setEffectOptions((prev) => ({ ...prev, [effectId]: opts }))
                  }
                  rank={rank}
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
                />
              )}

              {step === 3 && (
                <PowerBuilderStepModifiers
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedModifierInstances={selectedModifierInstances}
                  onUpdateDescription={updateModifierDescription}
                  onRemoveInstance={removeModifierInstance}
                  filteredExtras={filteredExtras}
                  filteredFlaws={filteredFlaws}
                  onAddModifier={addModifierInstance}
                />
              )}

              {step === 4 && (
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
