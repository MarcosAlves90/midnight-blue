import { useState, useCallback } from "react"
import { clampValue } from "./constants"
import type { Stats, StatKey, UseStatusBarsReturn } from "./types"

const DEFAULT_STATS: Stats = {
    vida: 85,
    energia: 60,
    estresse: 30,
    sanidade: 75
} as const

export const useStatusBars = (
    initialStats: Partial<Stats> = {},
    onStatsChange?: (stats: Stats) => void,
    disabled = false
): UseStatusBarsReturn => {
    const [stats, setStats] = useState<Stats>({
        ...DEFAULT_STATS,
        ...initialStats
    })

    const [selectedDots, setSelectedDots] = useState<Set<number>>(new Set())

    const updateStat = useCallback((statName: StatKey, change: number) => {
        if (disabled) return
        
        const currentValue = stats[statName]
        const newValue = clampValue(currentValue + change)
        
        const newStats = {
            ...stats,
            [statName]: newValue
        }
        setStats(newStats)
        onStatsChange?.(newStats)
    }, [stats, onStatsChange, disabled])

    const handleRevive = useCallback(() => {
        if (disabled) return
        
        const newStats = {
            ...stats,
            vida: 1
        }
        setStats(newStats)
        onStatsChange?.(newStats)
        setSelectedDots(new Set())
    }, [stats, onStatsChange, disabled])

    const toggleDotSelection = useCallback((dotValue: number) => {
        if (disabled) return
        
        setSelectedDots(prev => {
            const newSet = new Set(prev)
            if (newSet.has(dotValue)) {
                newSet.delete(dotValue)
            } else {
                newSet.add(dotValue)
            }
            return newSet
        })
    }, [disabled])

    return {
        stats,
        selectedDots,
        updateStat,
        handleRevive,
        toggleDotSelection
    }
}
