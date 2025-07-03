import { memo } from "react"
import { getStatusClass, STYLE_CONSTANTS } from "./constants"
import { RevivalDots } from "./revival-dots"
import { RevivalButton } from "./revival-button"
import { StatControls } from "./stat-controls"
import { EditableStatValue } from "./editable-stat-value"
import type { SingleStatBarProps } from "./types"

export const SingleStatBar = memo(function SingleStatBar({
    config,
    value,
    onUpdate,
    showIcons,
    compact,
    disabled,
    selectedDots,
    onToggleDot,
    onRevive
}: SingleStatBarProps) {
    const { key, label, color, icon: Icon, description, maxValue } = config
    const isKnockedOut = key === 'vida' && value === 0
    const statusClass = getStatusClass(value, maxValue)
    const barHeight = compact ? STYLE_CONSTANTS.COMPACT_HEIGHT : STYLE_CONSTANTS.NORMAL_HEIGHT
    const spacing = compact ? STYLE_CONSTANTS.COMPACT_SPACING : STYLE_CONSTANTS.NORMAL_SPACING
    
    const progressWidth = Math.min(100, Math.max(2, (value / maxValue) * 100))
    const minBarWidth = value > 0 ? STYLE_CONSTANTS.MIN_BAR_WIDTH : '0px'
    
    return (
        <div className={`${spacing}`}>
            {/* Header */}
            <div className="flex items-center justify-center gap-2">
                {showIcons && <Icon size={16} className="text-muted-foreground" />}
                <h3 
                    className={`text-sm font-medium text-center ${compact ? 'text-xs' : 'text-sm'}`}
                    title={description}
                >
                    {label}
                </h3>
            </div>
            
            {/* Status Bar */}
            <div 
                className={`w-full bg-background rounded flex items-center relative transition-all ${STYLE_CONSTANTS.TRANSITION_DURATION} ${barHeight} ${statusClass}`}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={maxValue}
                aria-label={`${label}: ${value} de ${maxValue}`}
            >
                {/* Progress Bar */}
                <div 
                    className={`${color} h-full rounded transition-all duration-500 ease-out ${statusClass}`} 
                    style={{ 
                        width: `${progressWidth}%`,
                        minWidth: minBarWidth
                    }}
                    aria-hidden="true"
                />

                {/* Knocked Out State */}
                {isKnockedOut ? (
                    <>
                        <RevivalDots 
                            selectedDots={selectedDots}
                            onToggleDot={onToggleDot}
                            disabled={disabled}
                        />
                        
                        <RevivalButton 
                            onRevive={onRevive}
                            disabled={disabled}
                        />

                        <span className="absolute right-2 inset-y-0 flex items-center text-sm font-medium">
                            <EditableStatValue 
                                value={value}
                                onUpdate={onUpdate}
                                disabled={disabled}
                            />/{maxValue}
                        </span>
                    </>
                ) : (
                    <>
                        {/* Value Display */}
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                            <EditableStatValue 
                                value={value}
                                onUpdate={onUpdate}
                                disabled={disabled}
                            />/{maxValue}
                        </span>

                        <StatControls 
                            label={label}
                            onUpdate={onUpdate}
                            disabled={disabled}
                        />
                    </>
                )}
            </div>
        </div>
    )
})
