"use client"

import { statConfigs } from "./status-bars/stat-configs"
import { SingleStatBar } from "./status-bars/single-stat-bar"
import { useStatusBars } from "./status-bars/use-status-bars"
import { StatusBarsProps } from "./status-bars/types"

export default function StatusBars({
    initialStats = {},
    maxValues,
    onStatsChange,
    disabled = false,
    showIcons = true,
    compact = false
}: StatusBarsProps) {
    const {
        stats,
        selectedDots,
        updateStat,
        handleRevive,
        toggleDotSelection
    } = useStatusBars(initialStats, onStatsChange, disabled)

    return (
        <div 
            className={`bg-muted/50 rounded-xl p-6 flex flex-col justify-center ${
                compact ? 'space-y-2' : 'space-y-4'
            } ${disabled ? 'opacity-60' : ''}`}
            role="group"
            aria-label="Status do personagem"
        >
            {statConfigs.map((config) => (
                <SingleStatBar
                    key={config.key}
                    config={{
                        ...config,
                        maxValue: maxValues?.[config.key] ?? config.maxValue
                    }}
                    value={stats[config.key]}
                    onUpdate={(change) => updateStat(config.key, change)}
                    showIcons={showIcons}
                    compact={compact}
                    disabled={disabled}
                    selectedDots={selectedDots}
                    onToggleDot={toggleDotSelection}
                    onRevive={handleRevive}
                />
            ))}
        </div>
    )
}
