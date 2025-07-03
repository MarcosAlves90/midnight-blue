import { memo } from "react"
import type { RevivalButtonProps } from "./types"

export const RevivalButton = memo(function RevivalButton({ 
    onRevive, 
    disabled = false 
}: RevivalButtonProps) {
    return (
        <button
            onClick={onRevive}
            disabled={disabled}
            className={`absolute cursor-pointer inset-x-0 mx-auto w-20 h-6 text-xs font-bold rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                disabled
                    ? 'bg-gray-500 text-primary cursor-not-allowed'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-primary shadow-lg hover:shadow-xl'
            }`}
            aria-label="Curar personagem"
            title="Curar personagem"
        >
            CURAR
        </button>
    )
})
