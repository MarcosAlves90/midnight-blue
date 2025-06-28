import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { STAT_CONFIG } from "./constants"
import { StatControlsProps } from "./types"

export const StatControls = ({ label, onUpdate, disabled = false }: StatControlsProps) => (
    <>
        {/* Controles de diminuir */}
        <div className="absolute left-1 inset-y-0 flex items-center gap-1">
            <button
                onClick={() => onUpdate(-STAT_CONFIG.LARGE_INCREMENT)}
                disabled={disabled}
                className={`p-0.5 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'text-primary/80 hover:text-primary hover:bg-primary/10 cursor-pointer'
                }`}
                aria-label={`Diminuir ${label} em ${STAT_CONFIG.LARGE_INCREMENT}`}
            >
                <ChevronsLeft size={20} />
            </button>
            <button
                onClick={() => onUpdate(-STAT_CONFIG.SMALL_INCREMENT)}
                disabled={disabled}
                className={`p-0.5 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'text-primary/80 hover:text-primary hover:bg-primary/10 cursor-pointer'
                }`}
                aria-label={`Diminuir ${label} em ${STAT_CONFIG.SMALL_INCREMENT}`}
            >
                <ChevronLeft size={20} />
            </button>
        </div>

        {/* Controles de aumentar */}
        <div className="absolute right-1 inset-y-0 flex items-center gap-1">
            <button
                onClick={() => onUpdate(STAT_CONFIG.SMALL_INCREMENT)}
                disabled={disabled}
                className={`p-0.5 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'text-primary/80 hover:text-primary hover:bg-primary/10 cursor-pointer'
                }`}
                aria-label={`Aumentar ${label} em ${STAT_CONFIG.SMALL_INCREMENT}`}
            >
                <ChevronRight size={20} />
            </button>
            <button
                onClick={() => onUpdate(STAT_CONFIG.LARGE_INCREMENT)}
                disabled={disabled}
                className={`p-0.5 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'text-primary/80 hover:text-primary hover:bg-primary/10 cursor-pointer'
                }`}
                aria-label={`Aumentar ${label} em ${STAT_CONFIG.LARGE_INCREMENT}`}
            >
                <ChevronsRight size={20} />
            </button>
        </div>
    </>
)
