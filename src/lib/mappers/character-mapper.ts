import type { IdentityData } from "@/contexts/IdentityContext";
import type { Attribute } from "@/components/pages/status/attributes-grid/types";
import type { Skill } from "@/components/pages/status/skills/types";
import type { Power } from "@/components/pages/status/powers/types";
import { INITIAL_ATTRIBUTES } from "@/components/pages/status/attributes-grid/constants";
import { INITIAL_SKILLS } from "@/components/pages/status/skills/constants";
import type { CharacterDocument, SavedAttribute, SavedSkill } from "@/lib/types/character";

/**
 * Converte valores do Firestore (que podem ser Timestamps) para objetos Date.
 */
export function toDateSafe(value: unknown): Date {
  const candidate = value as { toDate?: () => Date } | undefined;
  if (candidate && typeof candidate.toDate === "function") return candidate.toDate();
  if (value instanceof Date) return value;
  return new Date();
}

/**
 * Normaliza os dados de identidade, garantindo que campos obrigatórios existam.
 */
export function normalizeIdentity(raw: Partial<IdentityData> | Record<string, unknown> = {}): IdentityData {
  const r = raw as Record<string, unknown>;
  const name = (r.name as string) || (r.displayName as string) || "";
  const heroName = (r.heroName as string) || (r.hero as string) || "";
  return { ...(raw as IdentityData), name, heroName } as IdentityData;
}

/**
 * Serializa atributos para salvamento no Firestore.
 */
export function serializeAttributes(attributes: Attribute[] = INITIAL_ATTRIBUTES): SavedAttribute[] {
  return attributes.map((a) => ({ id: a.id, value: a.value }));
}

/**
 * Serializa perícias para salvamento no Firestore.
 */
export function serializeSkills(skills: Skill[] = INITIAL_SKILLS): SavedSkill[] {
  return skills.map((s) => {
    const saved: SavedSkill = {
      id: s.id,
      value: s.value ?? 0,
      others: s.others ?? 0,
    };
    if (s.parentId) saved.parentId = s.parentId;
    if (s.specialization) saved.specialization = s.specialization;
    return saved;
  });
}

/**
 * Hidrata atributos salvos com as definições iniciais.
 */
function hydrateAttributes(saved: SavedAttribute[] = []): Attribute[] {
  return INITIAL_ATTRIBUTES.map((base) => ({ ...base, value: saved.find((s) => s.id === base.id)?.value ?? 0 }));
}

/**
 * Hidrata perícias salvas com as definições iniciais e trata especializações.
 */
function hydrateSkills(saved: SavedSkill[] = []): Skill[] {
  // 1. Get base skills from INITIAL_SKILLS
  const baseSkills = INITIAL_SKILLS.map((base) => {
    const savedSkill = saved.find((s) => s.id === base.id);
    return {
      ...base,
      value: savedSkill?.value ?? 0,
      others: savedSkill?.others ?? 0,
    };
  });

  // 2. Get specializations (skills that have a parentId)
  const specializations = saved
    .filter((s) => s.parentId)
    .map((s): Skill | null => {
      const template = INITIAL_SKILLS.find((t) => t.id === s.parentId);
      if (!template) return null;
      return {
        ...template,
        id: s.id,
        parentId: s.parentId,
        specialization: s.specialization,
        name: `${template.abbreviation || template.name}: ${s.specialization}`,
        value: s.value ?? 0,
        others: s.others ?? 0,
        isTemplate: false,
      };
    })
    .filter((s): s is Skill => s !== null);

  return [...baseSkills, ...specializations];
}

/**
 * Mapeia um documento bruto do Firestore para o modelo CharacterDocument do domínio.
 */
export function mapFirestoreToCharacter(id: string, data: Record<string, unknown>): CharacterDocument {
  const perfKey = `mapFirestoreToCharacter:${id}`;
  try {
    performance.mark(`${perfKey}-start`);
  } catch {
    // ignore
  }

  const identity = normalizeIdentity((data.identity as Record<string, unknown>) || data);

  const result: CharacterDocument = {
    id,
    userId: String(data.userId),
    createdAt: toDateSafe(data.createdAt),
    updatedAt: toDateSafe(data.updatedAt),
    version: Number((data.version as number) ?? 0),
    identity,
    attributes: hydrateAttributes((data.attributes as unknown) as SavedAttribute[] || []),
    skills: hydrateSkills((data.skills as unknown) as SavedSkill[] || []),
    powers: (data.powers as Power[]) || [],
    status: {
      powerLevel: 10,
      extraPoints: 0,
      ...((data.status as Record<string, unknown>) || {}),
    },
    customDescriptors: (data.customDescriptors as string[]) || [],
    folderId: data.folderId ? String(data.folderId) : undefined,
  };

  try {
    performance.mark(`${perfKey}-end`);
    performance.measure(perfKey, `${perfKey}-start`, `${perfKey}-end`);
    performance.clearMarks(`${perfKey}-start`);
    performance.clearMarks(`${perfKey}-end`);
    performance.clearMeasures(perfKey);
  } catch {
    // ignore
  }

  return result;
}
