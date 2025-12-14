import React, { useCallback } from "react"
import { IdentityData } from "@/contexts/IdentityContext"
import { ROTATION_MULTIPLIER, SCALE_MULTIPLIER } from "./constants"
import { IdentityCardHeader } from "./identity-card-header"
import { ImageArea } from "./image-area"
import { IdentityCardContent } from "./identity-card-content"
import { useIsMobile } from "@/hooks/use-mobile"

interface IdentityCardContainerProps {
  identity: IdentityData
  cardRef: React.RefObject<HTMLDivElement | null>
  onFieldChange: <K extends keyof IdentityData>(field: K, value: IdentityData[K]) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onImageUpload: () => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
}

export const IdentityCardContainer: React.FC<IdentityCardContainerProps> = ({
  identity,
  cardRef,
  onFieldChange,
  fileInputRef,
  onImageUpload,
  onFileSelect,
  onSave,
}) => {
  const isMobile = useIsMobile()

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const x = (e.clientX - centerX) / (rect.width / 2)
      const y = (e.clientY - centerY) / (rect.height / 2)

      const rotateX = y * ROTATION_MULTIPLIER
      const rotateY = x * -ROTATION_MULTIPLIER
      const scale = 1 + Math.abs(x) * SCALE_MULTIPLIER

      requestAnimationFrame(() => {
        if (cardRef.current) {
          cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
        }
      })
    },
    [isMobile, cardRef]
  )

  const handleMouseLeave = useCallback(() => {
    if (isMobile || !cardRef.current) return
    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'none'
      }
    })
  }, [isMobile, cardRef])

  const boxShadow = isMobile ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(0, 0, 0, 0.5)'

  return (
    <div
      className="w-full max-w-[380px] mx-auto"
      style={{
        perspective: isMobile ? "none" : "1000px",
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={isMobile ? undefined : handleMouseMove}
        onMouseLeave={isMobile ? undefined : handleMouseLeave}
        className={`relative ${isMobile ? '' : 'transform transition-transform duration-300 ease-out'}`}
        style={{
          pointerEvents: "auto",
        }}
        role="region"
        aria-label="Cartão de identidade do personagem"
      >
        {/* CardGlowEffect removido para simplificar o design */}

        {/* Card Border/Background */}
        <div
          className={`${isMobile ? 'p-0.5 shadow-lg' : 'p-0.5 shadow-2xl'} relative group`}
          style={{
            backgroundColor: `var(--identity-theme-color, ${identity.favoriteColor || "#1a1a1a"})`,
            boxShadow: isMobile ? '0 8px 16px rgba(0, 0, 0, 0.3)' : boxShadow,
          }}
        >
          {/* Card Content Container */}
          <div
            className="bg-card overflow-hidden h-full flex flex-col relative border-4"
            style={{
              borderColor: `rgba(var(--identity-theme-rgb), 0.2)`,
            }}
          >
            <IdentityCardHeader
              name={identity.name}
              onChange={(v) => onFieldChange("name", v)}
              favoriteColor={identity.favoriteColor}
              onSave={onSave}
            />

            <ImageArea
              profileImage={identity.profileImage}
              imagePosition={identity.imagePosition}
              onPositionChange={(val) => onFieldChange("imagePosition", val)}
              onImageUpload={onImageUpload}
              onFileSelect={onFileSelect}
              fileInputRef={fileInputRef}
              favoriteColor={identity.favoriteColor}
            />

            {/* Terminal Separator Line */}
            <div
              className={`${isMobile ? 'px-2 py-1' : 'px-3 py-2'} bg-gradient-to-r border-b flex items-center gap-2 shadow-sm z-10 font-mono text-[8px]`}
              style={{
                background: `linear-gradient(90deg, rgba(var(--identity-theme-rgb), 0), rgba(var(--identity-theme-rgb), 0.5), rgba(var(--identity-theme-rgb), 0))`,
                borderColor: `rgba(var(--identity-theme-rgb), 0.3)`,
                color: `rgba(var(--identity-theme-rgb), 0.6)`,
              }}
            >
              <span className={`${isMobile ? 'hidden' : ''} sys-scan-line`}>├─ SYS.SCAN() </span>
              <span className={`${isMobile ? '' : 'hidden'} sys-scan-line`}>├─ SCAN() </span>
            </div>

            <IdentityCardContent
              alternateIdentity={identity.alternateIdentity}
              onChange={(v) => onFieldChange("alternateIdentity", v)}
              favoriteColor={identity.favoriteColor}
            />
          </div>
        </div>
      </div>

      {/* Global Styles for Animation */}
      <style jsx>{`
        @keyframes dash-pulse {
          0%,
          100% {
            transform: scaleX(1);
          }
          50% {
            transform: scaleX(1.3);
          }
        }

        .sys-scan-line::after {
          content: ${isMobile ? "'──────┤'" : "'────────────────────┤'"};
          display: inline-block;
          transform-origin: left;
          animation: dash-pulse 2s infinite ease-in-out;
        }

        :global(.identity-form-3d) {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}
