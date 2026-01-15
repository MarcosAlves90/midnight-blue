import {
  Effect,
  Modifier,
  ModifierInstance,
  Power,
  EffectOptions,
} from "@/components/pages/status/powers/types";

export const calculatePowerCost = (
  selectedEffects: Effect[],
  selectedModifierInstances: ModifierInstance[],
  effectOptions: Record<string, EffectOptions>,
  fallbackRank: number = 1,
): number => {
  if (selectedEffects.length === 0) return 0;

  // Calcular o custo de cada efeito individualmente
  const effectsCost = selectedEffects.reduce((acc, effect) => {
    const opts = effectOptions[effect.id] || {};
    const effectRank = opts.rank ?? fallbackRank;
    const effectBaseCost =
      typeof opts.ppCost === "number" ? opts.ppCost : effect.baseCost;

    // Modificadores que se aplicam a este efeito (ou a todos)
    const costPerRankFromModifiers = selectedModifierInstances
      .filter((inst) => {
        if (inst.modifier.isFlat) return false;

        // Se a instância tiver alvos específicos, usa eles
        const targets = inst.appliesTo || inst.modifier.appliesTo;
        if (!targets || targets.length === 0) return true;
        return targets.includes(effect.id);
      })
      .reduce((sum, inst) => {
        return (
          sum +
          ((inst.options?.costPerRank as number) ?? inst.modifier.costPerRank)
        );
      }, 0);

    const totalCostPerRank = effectBaseCost + costPerRankFromModifiers;
    let effectTotal: number;

    if (totalCostPerRank <= 0) {
      const ranksPerPoint = Math.min(5, Math.abs(totalCostPerRank - 1) + 1);
      effectTotal = Math.ceil(effectRank / ranksPerPoint);
    } else {
      effectTotal = Math.ceil(totalCostPerRank * effectRank);
    }

    return acc + effectTotal;
  }, 0);

  // Modificadores fixos (Flat) são somados uma única vez ao total do poder
  const flatModifiersTotal = selectedModifierInstances
    .filter((inst) => inst.modifier.isFlat)
    .reduce((sum, inst) => {
      return (
        sum +
        ((inst.options?.costPerRank as number) ?? inst.modifier.costPerRank)
      );
    }, 0);

  return Math.max(1, effectsCost + flatModifiersTotal);
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

export const checkPowerLimit = (power: Power, powerLevel: number): boolean => {
  // Para cada efeito, verificar se sua graduação respeita o limite do nível de poder
  return power.effects.some((effect) => {
    const opts = power.effectOptions?.[effect.id] || {};
    const effectRank = opts.rank ?? power.rank; // Fallback para a graduação antiga se necessário
    const hasAttack = effect.range !== "percepcao";
    const maxRank = hasAttack ? powerLevel * 2 : powerLevel;
    return effectRank > maxRank;
  });
};
