import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Power,
  Effect,
  Modifier,
  ModifierInstance,
  EffectOptions,
} from "./types";
import {
  COMMON_EXTRAS,
  COMMON_FLAWS,
  EFFECT_SPECIFIC_EXTRAS,
  EFFECT_SPECIFIC_FLAWS,
} from "@/lib/powers";
import { calculatePowerCost, filterModifiers } from "@/lib/powers/utils";

export function usePowerBuilder(editingPower?: Power) {
  const [step, setStep] = useState(1);

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
  const [notes, setNotes] = useState(editingPower?.notes || "");
  const [effectOptions, setEffectOptions] = useState<
    Record<string, EffectOptions>
  >(editingPower?.effectOptions || {});
  const [alternatives, setAlternatives] = useState<Power[]>(
    editingPower?.alternatives || [],
  );
  const [image, setImage] = useState<{ url: string; publicId: string } | undefined>(
    editingPower?.image,
  );
  const [pendingImageFile, setPendingImageFile] = useState<File | undefined>();

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
  const filteredExtras = useMemo(() => {
    const common = filterModifiers(COMMON_EXTRAS, "", selectedEffects);
    const specific = filterModifiers(
      EFFECT_SPECIFIC_EXTRAS || [],
      "",
      selectedEffects,
    );

    const map = new Map<string, Modifier>();
    [...common, ...specific].forEach((m) => map.set(m.id, m));
    return Array.from(map.values());
  }, [selectedEffects]);

  const filteredFlaws = useMemo(() => {
    const common = filterModifiers(COMMON_FLAWS, "", selectedEffects);
    const specific = filterModifiers(
      EFFECT_SPECIFIC_FLAWS || [],
      "",
      selectedEffects,
    );

    const map = new Map<string, Modifier>();
    [...common, ...specific].forEach((m) => map.set(m.id, m));
    return Array.from(map.values());
  }, [selectedEffects]);

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

  const addModifierInstance = useCallback(
    (modifier: Modifier, effectId?: string) => {
      const newInstance: ModifierInstance = {
        id: crypto.randomUUID(),
        modifierId: modifier.id,
        modifier,
        customDescription: undefined,
        appliesTo: effectId ? [effectId] : undefined,
      };
      setSelectedModifierInstances((prev) => [...prev, newInstance]);
    },
    [],
  );

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
    const primaryCost = calculatePowerCost(
      selectedEffects,
      selectedModifierInstances,
      effectOptions,
      rank,
    );
    return primaryCost + (alternatives?.length || 0);
  }, [
    selectedEffects,
    selectedModifierInstances,
    effectOptions,
    rank,
    alternatives,
  ]);

  const previewPower: Power = useMemo(
    () => ({
      id: editingPower?.id || "temp-preview-id",
      name: name.trim() || "Novo Poder",
      effects: selectedEffects,
      rank,
      descriptors: selectedDescriptors,
      modifiers: selectedModifierInstances,
      notes: notes.trim() || "",
      effectOptions,
      alternatives,
      image: pendingImageFile 
        ? { url: URL.createObjectURL(pendingImageFile), publicId: 'temp' } 
        : image,
    }),
    [
      editingPower?.id,
      name,
      selectedEffects,
      rank,
      selectedDescriptors,
      selectedModifierInstances,
      notes,
      effectOptions,
      alternatives,
      image,
      pendingImageFile,
    ],
  );

  const addAlternative = useCallback(() => {
    const newAlt: Power = {
      id: crypto.randomUUID(),
      name: "",
      effects: [],
      rank: 1,
      descriptors: [],
      modifiers: [],
    };
    setAlternatives((prev) => [...prev, newAlt]);
  }, []);

  const removeAlternative = useCallback((id: string) => {
    setAlternatives((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAlternative = useCallback(
    (id: string, updates: Partial<Power>) => {
      setAlternatives((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a)),
      );
    },
    [],
  );

  const canProceed = useCallback(() => {
    return selectedEffects.length > 0 && !!name.trim();
  }, [selectedEffects.length, name]);

  return {
    step,
    setStep,
    name,
    setName,
    selectedEffects,
    toggleEffect,
    rank,
    selectedModifierInstances,
    addModifierInstance,
    removeModifierInstance,
    updateModifierDescription,
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
  };
}
