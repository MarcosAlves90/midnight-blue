import { Attribute } from "./types"

export const INITIAL_ATTRIBUTES: Attribute[] = [
    { id: "FOR", name: "Força", abbreviation: "FOR", color: "red", value: 0, bonus: 0 },
    { id: "DES", name: "Destreza", abbreviation: "DES", color: "yellow", value: 0, bonus: 0 },
    { id: "VIG", name: "Vigor", abbreviation: "VIG", color: "green", value: 0, bonus: 0 },
    { id: "INT", name: "Inteligência", abbreviation: "INT", color: "blue", value: 0, bonus: 0 },
    { id: "PRE", name: "Presença", abbreviation: "PRE", color: "purple", value: 0, bonus: 0 },
] as const

export const INPUT_LIMITS = {
    MIN_VALUE: 0,
    MAX_VALUE: 9999
} as const
