import React from "react"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface IdentityCardHeaderProps {
  name: string
  onChange: (value: string) => void
  favoriteColor: string
  onSave: () => void
}

export const IdentityCardHeader: React.FC<IdentityCardHeaderProps> = ({ name, onChange, favoriteColor, onSave }) => {
  const isMobile = useIsMobile()

  return (
    <div
      className={`${isMobile ? 'p-2' : 'p-3'} border-b-2 bg-gradient-to-b from-black/80 to-black/60 flex justify-between items-center relative z-10 font-mono ${isMobile ? 'text-xs' : 'text-sm'}`}
      style={{
        borderColor: `${favoriteColor}50`,
      }}
    >
      <div className="flex items-center gap-2 flex-1">
        <span style={{ color: favoriteColor }}>$</span>
        <span style={{ color: `${favoriteColor}99` }}>identity</span>
        <span style={{ color: `${favoriteColor}66` }}>::</span>
        <span style={{ color: `${favoriteColor}99` }}>name</span>
        <span style={{ color: favoriteColor }}>=</span>
      </div>
      <div className="flex items-center gap-1">
        <Input
          value={name}
          onChange={(e) => onChange(e.target.value)}
          className={`font-mono bg-transparent border-none h-6 px-1 focus-visible:ring-0 w-auto ${isMobile ? 'max-w-[120px] text-xs' : 'max-w-[150px] text-xs'} text-right`}
          placeholder="HERO_NAME"
          aria-label="Nome do personagem"
          style={{
            color: favoriteColor,
            caretColor: favoriteColor,
          }}
        />
        <button
          onClick={onSave}
          className="hide-on-capture p-1 hover:bg-white/10 rounded transition-colors"
          title="Salvar Card"
          type="button"
        >
          <Download className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} style={{ color: favoriteColor }} />
        </button>
      </div>
    </div>
  )
}
