import { memo } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { STAT_CONFIG } from "./constants"
import type { StatControlsProps } from "./types"

export const StatControls = memo(function StatControls({ 
    label, 
    onUpdate, 
    disabled = false 
}: StatControlsProps) {
    const baseClasses = "p-0.5 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
    const activeClasses = "text-primary/80 hover:text-primary hover:bg-primary/10 cursor-pointer"
    const disabledClasses = "opacity-50 cursor-not-allowed"
    
    const buttonClasses = disabled ? `${baseClasses} ${disabledClasses}` : `${baseClasses} ${activeClasses}`

    return (
        <>
            {/* Decrease Controls */}
            <div className="absolute left-1 inset-y-0 flex items-center gap-1">
                <button
                    onClick={() => onUpdate(-STAT_CONFIG.LARGE_INCREMENT)}
                    disabled={disabled}
                    className={buttonClasses}
                    aria-label={`Diminuir ${label} em ${STAT_CONFIG.LARGE_INCREMENT}`}
                >
                    <ChevronsLeft size={20} />
                </button>
                <button
                    onClick={() => onUpdate(-STAT_CONFIG.SMALL_INCREMENT)}
                    disabled={disabled}
                    className={buttonClasses}
                    aria-label={`Diminuir ${label} em ${STAT_CONFIG.SMALL_INCREMENT}`}
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            {/* Increase Controls */}
            <div className="absolute right-1 inset-y-0 flex items-center gap-1">
                <button
                    onClick={() => onUpdate(STAT_CONFIG.SMALL_INCREMENT)}
                    disabled={disabled}
                    className={buttonClasses}
                    aria-label={`Aumentar ${label} em ${STAT_CONFIG.SMALL_INCREMENT}`}
                >
                    <ChevronRight size={20} />
                </button>
                <button
                    onClick={() => onUpdate(STAT_CONFIG.LARGE_INCREMENT)}
                    disabled={disabled}
                    className={buttonClasses}
                    aria-label={`Aumentar ${label} em ${STAT_CONFIG.LARGE_INCREMENT}`}
                >
                    <ChevronsRight size={20} />
                </button>
            </div>
        </>
    )
})
