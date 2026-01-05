import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import { Camera, Upload, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIdentityActions } from "@/contexts/IdentityContext";
import { useIdentityField } from "@/hooks/use-identity-field";
import GlitchText from "@/components/ui/custom/glitch-text";
import { CharacterImage } from "@/components/ui/custom/character-image";

interface ImageAreaProps {
  onImageUpload: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading?: boolean;
}

/**
 * ImageArea Component
 * Optimized with React.memo and memoized handlers to prevent unnecessary re-renders.
 */
export const ImageArea: React.FC<ImageAreaProps> = React.memo(({
  onImageUpload,
  onFileSelect,
  fileInputRef,
  isUploading = false,
}) => {
  const isMobile = useIsMobile();
  const { updateIdentity } = useIdentityActions();
  const profileImage = useIdentityField("profileImage");
  const imagePosition = useIdentityField("imagePosition") ?? 50;
  const favoriteColor = useIdentityField("favoriteColor") || "#1a1a1a";

  const handleMoveUp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    updateIdentity("imagePosition", Math.max(0, imagePosition - 5));
  }, [updateIdentity, imagePosition]);

  const handleMoveDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    updateIdentity("imagePosition", Math.min(100, imagePosition + 5));
  }, [updateIdentity, imagePosition]);

  const containerStyle = useMemo(() => ({
    borderColor: `rgba(var(--identity-theme-rgb), 0.5)`,
  }), []);

  const cornerStyle = useMemo(() => ({ 
    borderColor: `rgba(var(--identity-theme-rgb), 0.4)` 
  }), []);

  const scanlineStyle = useMemo(() => ({ 
    background: `linear-gradient(90deg, transparent, var(--identity-theme-color), transparent)`,
    boxShadow: `0 0 12px var(--identity-theme-color)`
  }), []);

  const imageStyle = useMemo(() => ({
    objectPosition: `center ${imagePosition}%`,
  }), [imagePosition]);

  const overlayStyle = useMemo(() => ({
    backgroundColor: `var(--identity-theme-color, ${favoriteColor})`,
  }), [favoriteColor]);

  const hudDataStyle = useMemo(() => ({ 
    borderLeftColor: `var(--identity-theme-color)` 
  }), []);

  return (
    <div
      className={`relative ${isMobile ? "aspect-[3/2]" : "aspect-[4/3]"} w-full bg-black/60 border-b-4 group overflow-hidden mx-auto transition-colors duration-500`}
      style={containerStyle}
      role="region"
      aria-label="Área de imagem do perfil"
    >
      {/* HUD Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-60">
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2" style={cornerStyle} />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2" style={cornerStyle} />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2" style={cornerStyle} />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2" style={cornerStyle} />
        
        {/* Scanline effect */}
        <div 
          className="absolute inset-0 w-full h-[2px] bg-white/20 animate-scan"
          style={scanlineStyle}
        />
      </div>

      <button
        onClick={onImageUpload}
        className="absolute inset-0 cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group/image"
        aria-label="Clique para fazer upload de imagem do perfil"
        type="button"
      >
        <CharacterImage
          src={profileImage}
          alt="Imagem de perfil do personagem"
          imagePosition={imagePosition}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="w-full h-full transition-all duration-700 grayscale-[0.2] group-hover/image:grayscale-0 group-hover/image:scale-105"
          fallback={
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera
                className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} opacity-50`}
                aria-hidden="true"
              />
              <span
                className={`${isMobile ? "text-[10px]" : "text-xs"} font-medium uppercase tracking-wider`}
              >
                <GlitchText
                  glitchChance={0.08}
                  glitchDuration={130}
                  intervalMs={400}
                  alternateChance={0.12}
                  characterGlitchChance={0.25}
                  className="inline"
                >
                  Clique para adicionar arte
                </GlitchText>
              </span>
            </div>
          }
        />

        {profileImage && (
          <div className="relative w-full h-full pointer-events-none">
            {/* Favorite color overlay effect */}
            <div
              className="absolute inset-0 opacity-10 mix-blend-overlay transition-opacity group-hover/image:opacity-25"
              style={overlayStyle}
            />
            
            {/* HUD Data Overlay */}
            <div className="absolute bottom-4 left-4 z-20 font-mono text-[9px] text-white font-bold uppercase tracking-widest hide-on-capture drop-shadow-md">
              <div className="flex items-center gap-2 bg-black/40 px-2 py-1 backdrop-blur-sm border-l-2" style={hudDataStyle}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                LIVE_FEED::POS_{imagePosition}%
              </div>
            </div>

            {/* Position Controls */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity z-30 hide-on-capture pointer-events-auto">
              <div
                role="button"
                onClick={handleMoveUp}
                className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-t backdrop-blur-sm transition-colors border border-white/10 hover:border-white/30"
                aria-label="Mover imagem para cima"
              >
                <ChevronUp className="w-4 h-4" />
              </div>
              <div
                role="button"
                onClick={handleMoveDown}
                className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-b backdrop-blur-sm transition-colors border border-white/10 hover:border-white/30 border-t-0"
                aria-label="Mover imagem para baixo"
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        {!profileImage && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center z-20 hide-on-capture">
            <Upload
              className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} text-white`}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-40">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <span className="text-[10px] text-white font-mono uppercase tracking-widest">
                Processando...
              </span>
            </div>
          </div>
        )}
      </button>

      <input
        id="identityImage"
        name="identityImage"
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileSelect}
        aria-label="Upload de arquivo de imagem"
      />
    </div>
  );
});

ImageArea.displayName = "ImageArea";

