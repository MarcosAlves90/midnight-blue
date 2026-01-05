import React, { useCallback, useMemo, useRef } from "react";
import { ROTATION_MULTIPLIER, SCALE_MULTIPLIER } from "../constants";
import { IdentityCardHeader } from "./identity-card-header";
import { ImageArea } from "./image-area";
import { IdentityCardContent } from "./identity-card-content";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIdentityField } from "@/hooks/use-identity-field";
import { getOptimalCardBackground } from "@/lib/colors";
import { useIdentityTheme } from "@/hooks/use-identity-theme";

interface IdentityCardContainerProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageUpload: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  isUploading?: boolean;
}

/**
 * IdentityCard Component
 * Optimized for performance using React.memo and specialized hooks.
 * Handles 3D tilt effect and layout for the character identity card.
 */
export const IdentityCard: React.FC<IdentityCardContainerProps> = React.memo(({
  cardRef,
  fileInputRef,
  onImageUpload,
  onFileSelect,
  onSave,
  isUploading = false,
}) => {
  const isMobile = useIsMobile();

  // Cache bounding rect to avoid expensive getBoundingClientRect on every mousemove
  const rectCache = useRef<DOMRect | null>(null);
  const rectCacheTime = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile || !cardRef.current) return;

      const now = Date.now();
      if (!rectCache.current || now - rectCacheTime.current > 200) {
        rectCache.current = cardRef.current.getBoundingClientRect();
        rectCacheTime.current = now;
      }

      const rect = rectCache.current;
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      const rotateX = y * ROTATION_MULTIPLIER;
      const rotateY = x * -ROTATION_MULTIPLIER;
      const scale = 1 + Math.abs(x) * SCALE_MULTIPLIER;

      requestAnimationFrame(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = "none";
          cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        }
      });
    },
    [isMobile, cardRef],
  );

  const handleMouseLeave = useCallback(() => {
    if (isMobile || !cardRef.current) return;
    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = "transform 0.5s ease-out";
        cardRef.current.style.transform = "none";
      }
    });
  }, [isMobile, cardRef]);

  const favoriteColor = useIdentityField("favoriteColor") || "#1a1a1a";
  useIdentityTheme(favoriteColor);

  const containerStyle = useMemo(() => ({
    perspective: isMobile ? "none" : "1000px",
  }), [isMobile]);

  const cardInnerStyle = useMemo(() => ({
    pointerEvents: "auto" as const,
  }), []);

  const borderStyle = useMemo(() => ({
    backgroundColor: `var(--identity-theme-color, ${favoriteColor})`,
    boxShadow: isMobile 
      ? `0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(var(--identity-theme-rgb), 0.3)` 
      : `0 10px 20px rgba(0, 0, 0, 0.4), 0 0 30px rgba(var(--identity-theme-rgb), 0.2)`,
    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)",
  }), [isMobile, favoriteColor]);

  const contentContainerStyle = useMemo(() => ({
    borderColor: `rgba(var(--identity-theme-rgb), 0.3)`,
    backgroundColor: `var(--identity-card-bg, ${getOptimalCardBackground(favoriteColor)})`,
    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) 100%, 0 100%)",
  }), [favoriteColor]);

  const decorativeCornerStyle = useMemo(() => ({ 
    backgroundColor: `var(--identity-theme-color, ${favoriteColor})`,
    clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
    boxShadow: `0 0 10px var(--identity-theme-color)`
  }), [favoriteColor]);

  const separatorStyle = useMemo(() => ({
    borderColor: `rgba(var(--identity-theme-rgb), 0.3)`,
    color: `rgba(var(--identity-theme-rgb), 0.8)`,
  }), []);

  return (
    <div
      className="w-full max-w-[360px] mx-auto lg:max-w-none"
      style={containerStyle}
    >
      <div
        ref={cardRef}
        onMouseMove={isMobile ? undefined : handleMouseMove}
        onMouseLeave={isMobile ? undefined : handleMouseLeave}
        className={`relative ${isMobile ? "" : "will-change-transform"}`}
        style={cardInnerStyle}
        role="region"
        aria-label="Cartão de identidade do personagem"
      >
        <div
          className={`${isMobile ? "p-[1px]" : "p-0.5"} relative group transition-all duration-500`}
          style={borderStyle}
        >
          <div
            className="bg-card overflow-hidden h-full flex flex-col relative border-[3px] transition-colors duration-500 backdrop-blur-xl"
            style={contentContainerStyle}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 z-20 opacity-90"
              style={decorativeCornerStyle}
            />
            
            <IdentityCardHeader
              favoriteColor={favoriteColor}
              onSave={onSave}
            />

            <ImageArea
              onImageUpload={onImageUpload}
              onFileSelect={onFileSelect}
              fileInputRef={fileInputRef}
              isUploading={isUploading}
            />

            <div
              className={`${isMobile ? "px-2 py-0.5" : "px-3 py-1"} bg-black/60 border-y flex items-center justify-between gap-2 shadow-sm z-10 font-mono text-[6px] tracking-[0.2em] uppercase`}
              style={separatorStyle}
            >
              <div className="flex items-center gap-2">
                <span className="sys-scan-line">
                  {isMobile ? "SCAN" : "SYSTEM_SCAN"}
                </span>
              </div>
              <div className="flex gap-4 opacity-50">
                <span>LOC::DATA_STREAM</span>
                <span className={isMobile ? "hidden" : ""}>AUTH::VERIFIED</span>
              </div>
            </div>

            <IdentityCardContent favoriteColor={favoriteColor} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dash-pulse {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.3); }
        }
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan { animation: scan 3s linear infinite; }
        .sys-scan-line::after {
          content: ${isMobile ? "'──────┤'" : "'────────────────────┤'"};
          display: inline-block;
          transform-origin: left;
          animation: dash-pulse 2s infinite ease-in-out;
        }
        :global(.identity-form-3d) { perspective: 1000px; }
      `}</style>
    </div>
  );
});

IdentityCard.displayName = "IdentityCard";

