import {
  Effect,
  Modifier,
  ModifierInstance,
  Power,
  EffectOptions,
} from "@/components/pages/status/powers/types";

export const calculatePowerCost = (
  rank: number,
  selectedEffects: Effect[],
  selectedModifierInstances: ModifierInstance[],
  effectOptions: Record<string, EffectOptions>,
): number => {
  if (selectedEffects.length === 0) return 0;

  // Calcular custo base dos efeitos, considerando effectOptions (ex: ppCost para Ambiente)
  const baseEffect = selectedEffects.reduce((acc, e) => {
    const opts = effectOptions[e.id];
    const ppCost = typeof opts?.ppCost === "number" ? opts.ppCost : e.baseCost;
    return acc + ppCost;
  }, 0);

  const extrasTotal = selectedModifierInstances
    .filter((m) => m.modifier.type === "extra" && !m.modifier.isFlat)
    .reduce(
      (acc, m) =>
        acc + ((m.options?.costPerRank as number) ?? m.modifier.costPerRank),
      0,
    );

  const flawsTotal = selectedModifierInstances
    .filter((m) => m.modifier.type === "falha" && !m.modifier.isFlat)
    .reduce(
      (acc, m) =>
        acc + ((m.options?.costPerRank as number) ?? m.modifier.costPerRank),
      0,
    );

  const flatModifiers = selectedModifierInstances
    .filter((m) => m.modifier.isFlat)
    .reduce(
      (acc, m) =>
        acc + ((m.options?.costPerRank as number) ?? m.modifier.costPerRank),
      0,
    );

  const costPerRank = baseEffect + extrasTotal + flawsTotal;
  let totalCost: number;

  if (costPerRank <= 0) {
    const ranksPerPoint = Math.min(5, Math.abs(costPerRank - 1) + 1);
    totalCost = Math.ceil(rank / ranksPerPoint);
  } else {
    totalCost = Math.ceil(costPerRank * rank);
  }

  return Math.max(1, totalCost + flatModifiers);
};

export const filterModifiers = (
  modifiers: Modifier[],
  searchTerm: string,
  selectedEffects: Effect[],
): Modifier[] => {
  const q = searchTerm.toLowerCase();
  return modifiers.filter((m) => {
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
};

export const getPowerDefaults = (selectedEffects: Effect[]) => {
  return {
    action: selectedEffects[0]?.action || "padrao",
    range: selectedEffects[0]?.range || "perto",
    duration: selectedEffects[0]?.duration || "instantaneo",
  };
};

export const checkPowerLimit = (power: Power, powerLevel: number): boolean => {
  // Effects with attack roll: rank + attack bonus <= PL * 2
  // Effects without attack (perception/save): rank <= PL
  const hasAttack = power.effects.some((e) => e.range !== "percepcao");
  const maxRank = hasAttack ? powerLevel * 2 : powerLevel;
  return power.rank > maxRank;
};
