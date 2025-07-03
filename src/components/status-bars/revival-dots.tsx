import { memo } from "react"
import { STAT_CONFIG } from "./constants"
import type { RevivalDotsProps } from "./types"

export const RevivalDots = memo(function RevivalDots({ 
    selectedDots, 
    onToggleDot, 
    disabled = false 
}: RevivalDotsProps) {
    return (
        <div className="absolute left-2 inset-y-0 flex items-center gap-1">
            {STAT_CONFIG.REVIVAL_DOTS.map((dotValue) => (
                <button
                    key={dotValue}
                    onClick={() => onToggleDot(dotValue)}
                    disabled={disabled}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        selectedDots.has(dotValue)
                            ? 'bg-primary border-primary shadow-lg scale-110' 
                            : 'bg-transparent border-primary/60 hover:border-primary hover:scale-105'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    aria-label={`${selectedDots.has(dotValue) ? 'Desselecionar' : 'Selecionar'} ${dotValue} ponto${dotValue > 1 ? 's' : ''} de vida`}
                    aria-pressed={selectedDots.has(dotValue)}
                />
            ))}
        </div>
    )
})
