import { getStatusClass } from "./constants"
import { RevivalDots } from "./revival-dots"
import { RevivalButton } from "./revival-button"
import { StatControls } from "./stat-controls"
import { EditableStatValue } from "./editable-stat-value"
import { SingleStatBarProps } from "./types"

export const SingleStatBar = ({
    config,
    value,
    onUpdate,
    showIcons,
    compact,
    disabled,
    selectedDots,
    onToggleDot,
    onRevive
}: SingleStatBarProps) => {
    const { key, label, color, icon: Icon, description, maxValue } = config
    const isKnockedOut = key === 'vida' && value === 0
    const statusClass = getStatusClass(value, maxValue)
    
    return (
        <div className={`space-y-2 ${compact ? 'space-y-1' : 'space-y-2'}`}>
            {/* Header com ícone e label */}
            <div className="flex items-center justify-center gap-2">
                {showIcons && <Icon size={16} className="text-muted-foreground" />}
                <h3 
                    className={`text-sm font-medium text-center ${compact ? 'text-xs' : 'text-sm'}`}
                    title={description}
                >
                    {label}
                </h3>
            </div>
            
            {/* Barra de status */}
            <div 
                className={`w-full bg-background rounded flex items-center relative transition-all duration-300 ${
                    compact ? 'h-6' : 'h-8'
                } ${statusClass}`}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={maxValue}
                aria-label={`${label}: ${value} de ${maxValue}`}
            >
                {/* Barra de progresso */}
                <div 
                    className={`${color} h-full rounded transition-all duration-500 ease-out ${statusClass}`} 
                    style={{ 
                        width: `${Math.min(100, Math.max(2, (value / maxValue) * 100))}%`,
                        minWidth: value > 0 ? '2px' : '0px'
                    }}
                    aria-hidden="true"
                />

                {/* Estado especial quando vida está em 0 */}
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

                        {/* Valor do status na direita */}
                        <span className={`absolute right-2 inset-y-0 flex items-center text-sm font-medium`}>
                            <EditableStatValue 
                                value={value}
                                maxValue={maxValue}
                                onUpdate={onUpdate}
                                disabled={disabled}
                            />/{maxValue}
                        </span>
                    </>
                ) : (
                    <>
                        {/* Valor do status no centro */}
                        <span className={`absolute inset-0 flex items-center justify-center text-sm font-medium`}>
                            <EditableStatValue 
                                value={value}
                                maxValue={maxValue}
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
}
