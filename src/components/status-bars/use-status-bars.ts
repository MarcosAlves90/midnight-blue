import { useState, useCallback } from "react"
import { Stats, StatKey } from "./types"

export const useStatusBars = (
    initialStats: Partial<Stats> = {},
    onStatsChange?: (stats: Stats) => void,
    disabled: boolean = false
) => {
    const [stats, setStats] = useState<Stats>({
        vida: 85,
        energia: 60,
        estresse: 30,
        sanidade: 75,
        ...initialStats
    })

    const [selectedDots, setSelectedDots] = useState<Set<number>>(new Set())

    // Função otimizada para atualizar status
    const updateStat = useCallback((statName: StatKey, change: number) => {
        if (disabled) return
        
        const newValue = Math.max(0, Math.min(9999, stats[statName] + change)) // Mínimo 0, máximo 9999
        const newStats = {
            ...stats,
            [statName]: newValue
        }
        setStats(newStats)
        onStatsChange?.(newStats)
    }, [stats, onStatsChange, disabled])

    // Função para reviver personagem
    const handleRevive = useCallback(() => {
        if (disabled) return
        
        const newStats = {
            ...stats,
            vida: 1 // Sempre revive com 1 ponto de vida
        }
        setStats(newStats)
        onStatsChange?.(newStats)
        setSelectedDots(new Set()) // Limpa as bolinhas selecionadas
    }, [stats, onStatsChange, disabled])

    // Função para alternar seleção de bolinhas
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
