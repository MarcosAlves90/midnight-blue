import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Power,
  Effect,
  Modifier,
  ModifierInstance,
  ActionType,
  RangeType,
  DurationType,
  EffectOptions,
} from "./types";
import {
  EFFECTS,
  COMMON_EXTRAS,
  COMMON_FLAWS,
  EFFECT_SPECIFIC_EXTRAS,
  EFFECT_SPECIFIC_FLAWS,
} from "@/lib/powers";
import { calculatePowerCost, filterModifiers } from "@/lib/powers/utils";

export function usePowerBuilder(editingPower?: Power) {
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
  const [effectOptions, setEffectOptions] = useState<
    Record<string, EffectOptions>
  >(editingPower?.effectOptions || {});

  // O rank global agora reflete a maior graduação entre os efeitos para compatibilidade
  const maxRank = useMemo(() => {
    const ranks = Object.values(effectOptions)
      .map((opt) => (opt.rank as number) || 0)
      .filter((r) => r > 0);
    if (ranks.length === 0) return editingPower?.rank || 1;
    return Math.max(...ranks);
  }, [effectOptions, editingPower?.rank]);

  useEffect(() => {
    setRank(maxRank);
  }, [maxRank]);

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
    const common = filterModifiers(COMMON_EXTRAS, searchTerm, selectedEffects);
    const specific = filterModifiers(
      EFFECT_SPECIFIC_EXTRAS || [],
      searchTerm,
      selectedEffects,
    );

    const map = new Map<string, Modifier>();
    [...common, ...specific].forEach((m) => map.set(m.id, m));
    return Array.from(map.values());
  }, [searchTerm, selectedEffects]);

  const filteredFlaws = useMemo(() => {
    const common = filterModifiers(COMMON_FLAWS, searchTerm, selectedEffects);
    const specific = filterModifiers(
      EFFECT_SPECIFIC_FLAWS || [],
      searchTerm,
      selectedEffects,
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

  const addModifierInstance = useCallback((modifier: Modifier, effectId?: string) => {
    const newInstance: ModifierInstance = {
      id: crypto.randomUUID(),
      modifierId: modifier.id,
      modifier,
      customDescription: undefined,
      appliesTo: effectId ? [effectId] : undefined,
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

  const updateModifierOptions = useCallback(
    (instanceId: string, options: Record<string, unknown>) => {
      setSelectedModifierInstances((prev) =>
        prev.map((m) => (m.id === instanceId ? { ...m, options } : m)),
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

  const updateEffectOptions = useCallback(
    (effectId: string, opts: EffectOptions) => {
      setEffectOptions((prev) => ({ ...prev, [effectId]: opts }));
    },
    [],
  );

  const calculateCost = useCallback(() => {
    return calculatePowerCost(
      selectedEffects,
      selectedModifierInstances,
      effectOptions,
      rank,
    );
  }, [selectedEffects, selectedModifierInstances, effectOptions, rank]);

  const previewPower: Power = useMemo(
    () => ({
      id: editingPower?.id || "preview",
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
    }),
    [
      editingPower?.id,
      name,
      selectedEffects,
      rank,
      selectedDescriptors,
      selectedModifierInstances,
      customAction,
      customRange,
      customDuration,
      notes,
      effectOptions,
    ],
  );

  const canProceed = useCallback(() => {
    if (step === 1) return selectedEffects.length > 0;
    if (step === 2) return rank >= 1;
    if (step === 3) return !!name.trim();
    return false;
  }, [step, selectedEffects.length, rank, name]);

  return {
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
    updateModifierDescription,
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
    filteredEffects,
    filteredExtras,
    filteredFlaws,
    calculateCost,
    previewPower,
    canProceed,
  };
}
