import React from "react"

interface CardGlowEffectProps {
  favoriteColor: string
}

export const CardGlowEffect: React.FC<CardGlowEffectProps> = ({ favoriteColor }) => (
  <div
    className="absolute inset-0 overflow-hidden"
    style={{
      zIndex: 50,
      pointerEvents: "none",
    }}
    aria-hidden="true"
  >
    {/* Main shimmer line */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(90deg, 
          transparent 0%, 
          ${favoriteColor}25 20%, 
          ${favoriteColor}35 50%, 
          ${favoriteColor}25 80%, 
          transparent 100%)`,
        animation: "shimmer 4s infinite ease-in-out",
        backgroundSize: "200% 100%",
        filter: "blur(1px)",
      }}
    />

    {/* Scan lines effect */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `repeating-linear-gradient(
          0deg,
          ${favoriteColor}05 0px,
          ${favoriteColor}05 2px,
          transparent 2px,
          transparent 4px
        )`,
        animation: "scanlines 6s linear infinite",
        pointerEvents: "none",
        backgroundSize: "100% 8px",
        backgroundPosition: "0 0",
      }}
    />

    {/* Glow effect particles */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 50% 50%, 
          ${favoriteColor}20 0%, 
          ${favoriteColor}10 25%,
          transparent 100%)`,
        animation: "pulse-glow 3s ease-in-out infinite",
        filter: "blur(8px)",
        pointerEvents: "none",
      }}
    />
  </div>
)
