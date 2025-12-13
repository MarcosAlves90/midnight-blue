import React, { useCallback } from "react"
import { IdentityData } from "@/contexts/IdentityContext"
import { MousePosition } from "./types"
import { ROTATION_MULTIPLIER, SCALE_MULTIPLIER } from "./constants"
import { IdentityCardHeader } from "./identity-card-header"
import { ImageArea } from "./image-area"
import { IdentityCardContent } from "./identity-card-content"
import { useIsMobile } from "@/hooks/use-mobile"

interface IdentityCardContainerProps {
  identity: IdentityData
  mousePosition: MousePosition
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: () => void
  cardRef: React.RefObject<HTMLDivElement | null>
  onFieldChange: (field: keyof IdentityData, value: string) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onImageUpload: () => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
}

export const IdentityCardContainer: React.FC<IdentityCardContainerProps> = ({
  identity,
  mousePosition,
  onMouseMove,
  onMouseLeave,
  cardRef,
  onFieldChange,
  fileInputRef,
  onImageUpload,
  onFileSelect,
  onSave,
}) => {
  const isMobile = useIsMobile()

  const calculateTransform = useCallback(() => {
    if (isMobile) return 'none'
    const rotateX = mousePosition.y * ROTATION_MULTIPLIER
    const rotateY = mousePosition.x * -ROTATION_MULTIPLIER
    const scale = 1 + Math.abs(mousePosition.x) * SCALE_MULTIPLIER
    return `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
  }, [mousePosition, isMobile])

  const boxShadow = isMobile ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(0, 0, 0, 0.5)'

  return (
    <div
      className={`${isMobile ? 'max-w-[320px]' : 'max-w-[380px]'} mx-auto`}
      style={{
        perspective: isMobile ? "none" : "1000px",
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={isMobile ? undefined : onMouseMove}
        onMouseLeave={isMobile ? undefined : onMouseLeave}
        className={`relative ${isMobile ? '' : 'transform transition-transform duration-300 ease-out'}`}
        style={{
          transform: calculateTransform(),
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
            backgroundColor: identity.favoriteColor || "#1a1a1a",
            boxShadow: isMobile ? '0 8px 16px rgba(0, 0, 0, 0.3)' : boxShadow,
          }}
        >
          {/* Card Content Container */}
          <div
            className="bg-black overflow-hidden h-full flex flex-col relative border-4"
            style={{
              borderColor: `${identity.favoriteColor}33`,
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
              onImageUpload={onImageUpload}
              onFileSelect={onFileSelect}
              fileInputRef={fileInputRef}
              favoriteColor={identity.favoriteColor}
            />

            {/* Terminal Separator Line */}
            <div
              className={`${isMobile ? 'px-2 py-1' : 'px-3 py-2'} bg-gradient-to-r border-b flex items-center gap-2 shadow-sm z-10 font-mono text-[8px]`}
              style={{
                background: `linear-gradient(90deg, ${identity.favoriteColor}00, ${identity.favoriteColor}80, ${identity.favoriteColor}00)`,
                borderColor: `${identity.favoriteColor}4d`,
                color: `${identity.favoriteColor}99`,
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
