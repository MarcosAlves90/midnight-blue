import { Attribute } from "./types"

export const INITIAL_ATTRIBUTES: Attribute[] = [
    { id: "FOR", name: "Força", abbreviation: "FOR", color: "red", value: 0, bonus: 0, type: "attribute" },
    { id: "VIG", name: "Vigor", abbreviation: "VIG", color: "green", value: 0, bonus: 0, type: "attribute" },
    { id: "AGI", name: "Agilidade", abbreviation: "AGI", color: "amber", value: 0, bonus: 0, type: "attribute" },
    { id: "DES", name: "Destreza", abbreviation: "DES", color: "yellow", value: 0, bonus: 0, type: "attribute" },
    { id: "LUT", name: "Luta", abbreviation: "LUT", color: "maroon", value: 0, bonus: 0, type: "attribute" },
    { id: "INT", name: "Intelecto", abbreviation: "INT", color: "blue", value: 0, bonus: 0, type: "attribute" },
    { id: "PRO", name: "Prontidão", abbreviation: "PRO", color: "indigo", value: 0, bonus: 0, type: "attribute" },
    { id: "PRE", name: "Presença", abbreviation: "PRE", color: "purple", value: 0, bonus: 0, type: "attribute" },
] as const

export const DEFAULT_INPUT_LIMITS = {
    MIN_VALUE: 0,
    MAX_VALUE: 9999
} as const

export function getInputLimits(customLimits?: { MIN_VALUE?: number, MAX_VALUE?: number }) {
    return {
        MIN_VALUE: customLimits?.MIN_VALUE ?? DEFAULT_INPUT_LIMITS.MIN_VALUE,
        MAX_VALUE: customLimits?.MAX_VALUE ?? DEFAULT_INPUT_LIMITS.MAX_VALUE
    }
}
