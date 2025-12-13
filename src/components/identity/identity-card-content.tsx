import React from "react"
import { Input } from "@/components/ui/input"
import { useIsMobile } from "@/hooks/use-mobile"

interface IdentityCardContentProps {
  alternateIdentity: string
  onChange: (value: string) => void
  favoriteColor: string
}

export const IdentityCardContent: React.FC<IdentityCardContentProps> = ({ alternateIdentity, onChange, favoriteColor }) => {
  const isMobile = useIsMobile()

  return (
    <div
      className={`${isMobile ? 'p-3' : 'p-4'} flex-1 bg-gradient-to-b from-black/40 to-black/60 ${isMobile ? 'min-h-[80px]' : 'min-h-[120px]'} flex flex-col gap-3 font-mono text-xs`}
      style={{
        borderLeftColor: `${favoriteColor}4d`,
      }}
    >
      <div className="space-y-1.5 border-l-2 pl-2" style={{ borderColor: `${favoriteColor}4d` }}>
        <div style={{ color: `${favoriteColor}99` }}>
          <span style={{ color: favoriteColor }}>root@</span>
          <span>identity</span>
          <span style={{ color: favoriteColor }}>:</span>
          <span style={{ color: `${favoriteColor}66` }}>~</span>
          <span style={{ color: favoriteColor }}>$</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span style={{ color: `${favoriteColor}80` }}>civil_id</span>
          <span style={{ color: favoriteColor }}>=</span>
          <Input
            value={alternateIdentity}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono text-xs bg-transparent border-none px-0 h-auto focus-visible:ring-0 flex-1"
            placeholder="[ENCRYPTED]"
            aria-label="Nome civil verdadeiro"
            style={{
              color: favoriteColor,
              caretColor: favoriteColor,
            }}
          />
        </div>
      </div>

      <div
        className={`${isMobile ? 'mt-auto pt-2' : 'mt-auto pt-3'} border-t text-center font-mono`}
        style={{
          borderColor: `${favoriteColor}33`,
          color: `${favoriteColor}66`,
        }}
      >
        <p className={`${isMobile ? 'text-[8px]' : 'text-[9px]'}`}>
          &gt; midnight_blue.exe --running
        </p>
      </div>
    </div>
  )
}
