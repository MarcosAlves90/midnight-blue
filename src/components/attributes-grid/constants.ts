import { Attribute } from "./types"

export const INITIAL_ATTRIBUTES: Attribute[] = [
    { id: "FOR", name: "Força", abbreviation: "FOR", color: "red-500", value: 0, bonus: 0 },
    { id: "DES", name: "Destreza", abbreviation: "DES", color: "yellow-500", value: 0, bonus: 0 },
    { id: "VIG", name: "Vigor", abbreviation: "VIG", color: "green-500", value: 0, bonus: 0 },
    { id: "INT", name: "Inteligência", abbreviation: "INT", color: "blue-500", value: 0, bonus: 0 },
    { id: "PRE", name: "Presença", abbreviation: "PRE", color: "purple-500", value: 0, bonus: 0 },
] as const

export const COLOR_CLASSES = {
    'red-500': {
        border: 'border-t-red-500',
        bg: 'bg-red-500/30',
        focusBg: 'focus:bg-red-500/40'
    },
    'yellow-500': {
        border: 'border-t-yellow-500',
        bg: 'bg-yellow-500/30',
        focusBg: 'focus:bg-yellow-500/40'
    },
    'green-500': {
        border: 'border-t-green-500',
        bg: 'bg-green-500/30',
        focusBg: 'focus:bg-green-500/40'
    },
    'blue-500': {
        border: 'border-t-blue-500',
        bg: 'bg-blue-500/30',
        focusBg: 'focus:bg-blue-500/40'
    },
    'purple-500': {
        border: 'border-t-purple-500',
        bg: 'bg-purple-500/30',
        focusBg: 'focus:bg-purple-500/40'
    }
} as const

export const DEFAULT_COLOR_CLASSES = {
    border: 'border-t-gray-500',
    bg: 'bg-gray-500/30',
    focusBg: 'focus:bg-gray-500/40'
} as const

export const INPUT_LIMITS = {
    MIN_VALUE: 0,
    MAX_VALUE: 9999
} as const
