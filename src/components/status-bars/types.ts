import { ComponentType } from "react"

export interface Stats {
    vida: number
    energia: number
    estresse: number
    sanidade: number
}

export interface StatMaxValues {
    vida: number
    energia: number
    estresse: number
    sanidade: number
}

export type StatKey = keyof Stats

export interface StatConfig {
    key: StatKey
    label: string
    color: string
    icon: ComponentType<{ size?: number; className?: string }>
    description: string
    maxValue: number
}

export interface StatusBarsProps {
    initialStats?: Partial<Stats>
    maxValues?: Partial<StatMaxValues>
    onStatsChange?: (stats: Stats) => void
    disabled?: boolean
    showIcons?: boolean
    compact?: boolean
}

export interface RevivalDotsProps {
    selectedDots: Set<number>
    onToggleDot: (dotValue: number) => void
    disabled?: boolean
}

export interface RevivalButtonProps {
    onRevive: () => void
    disabled?: boolean
}

export interface StatControlsProps {
    label: string
    onUpdate: (change: number) => void
    disabled?: boolean
}

export interface SingleStatBarProps {
    config: StatConfig
    value: number
    onUpdate: (change: number) => void
    showIcons: boolean
    compact: boolean
    disabled: boolean
    selectedDots: Set<number>
    onToggleDot: (dotValue: number) => void
    onRevive: () => void
}
