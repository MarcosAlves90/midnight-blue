import React from "react";
import Image from "next/image";
import { normalizeCloudinarySrc } from "@/lib/cloudinary";
import { Camera, Upload, ChevronUp, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import GlitchText from "@/components/ui/custom/glitch-text";

interface ImageAreaProps {
  profileImage?: string;
  imagePosition?: number;
  onPositionChange?: (position: number) => void;
  onImageUpload: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  favoriteColor: string;
}

export const ImageArea: React.FC<ImageAreaProps> = ({
  profileImage,
  imagePosition = 50,
  onPositionChange,
  onImageUpload,
  onFileSelect,
  fileInputRef,
  favoriteColor,
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={`relative ${isMobile ? "aspect-[3/2]" : "aspect-[4/3]"} w-full bg-muted/50 border-b-4 group overflow-hidden mx-auto`}
      style={{
        borderColor: `rgba(var(--identity-theme-rgb), 0.25)`,
      }}
      role="region"
      aria-label="Área de imagem do perfil"
    >
      <button
        onClick={onImageUpload}
        className="absolute inset-0 cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group/image"
        aria-label="Clique para fazer upload de imagem do perfil"
        type="button"
      >
        {profileImage ? (
          <div className="relative w-full h-full">
            <Image
              src={
                profileImage && profileImage.startsWith("data:")
                  ? profileImage
                  : normalizeCloudinarySrc(profileImage) || profileImage
              }
              alt="Imagem de perfil do personagem"
              fill
              className="w-full h-full object-cover transition-all duration-200"
              style={{
                objectPosition: `center ${imagePosition}%`,
              }}
            />
            {/* Favorite color overlay effect */}
            <div
              className="absolute inset-0 opacity-20 mix-blend-multiply"
              style={{
                backgroundColor: `var(--identity-theme-color, ${favoriteColor})`,
              }}
            />
            {/* Subtle border glow */}
            <div
              className="absolute inset-0 border-2 opacity-30"
              style={{
                borderColor: `var(--identity-theme-color, ${favoriteColor})`,
                boxShadow: `inset 0 0 20px rgba(var(--identity-theme-rgb), 0.12)`,
              }}
            />

            {/* Position Controls */}
            {onPositionChange && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity z-30 hide-on-capture">
                <div
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPositionChange(Math.max(0, imagePosition - 5));
                  }}
                  className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-t backdrop-blur-sm transition-colors border border-white/10 hover:border-white/30"
                  aria-label="Mover imagem para cima"
                >
                  <ChevronUp className="w-4 h-4" />
                </div>
                <div
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPositionChange(Math.min(100, imagePosition + 5));
                  }}
                  className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-b backdrop-blur-sm transition-colors border border-white/10 hover:border-white/30 border-t-0"
                  aria-label="Mover imagem para baixo"
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        ) : (
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
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center z-20 hide-on-capture">
          <Upload
            className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} text-white`}
            aria-hidden="true"
          />
        </div>
      </button>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileSelect}
        aria-label="Upload de arquivo de imagem"
      />
    </div>
  );
};
