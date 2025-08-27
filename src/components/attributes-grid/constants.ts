import { Attribute } from "./types"

export const INITIAL_ATTRIBUTES: Attribute[] = [
    { id: "FOR", name: "Força", abbreviation: "FOR", color: "red", value: 0, bonus: 0, type: "attribute" },
    { id: "DES", name: "Destreza", abbreviation: "DES", color: "yellow", value: 0, bonus: 0, type: "attribute" },
    { id: "VIG", name: "Vigor", abbreviation: "VIG", color: "green", value: 0, bonus: 0, type: "attribute" },
    { id: "INT", name: "Inteligência", abbreviation: "INT", color: "blue", value: 0, bonus: 0, type: "attribute" },
    { id: "PRE", name: "Presença", abbreviation: "PRE", color: "purple", value: 0, bonus: 0, type: "attribute" },
] as const

export const INITIAL_BIOTYPES: Attribute[] = [
    { id: "VID", name: "Vida", abbreviation: "VID", color: "pink", value: 0, type: "biotype" },
    { id: "NRG", name: "Energia", abbreviation: "NRG", color: "cyan", value: 0, type: "biotype" },
    { id: "PER", name: "Perícias", abbreviation: "PER", color: "orange", value: 0, type: "biotype" },
    { id: "CRO", name: "Cromos", abbreviation: "CRO", color: "lime", value: 0, type: "biotype" },
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
