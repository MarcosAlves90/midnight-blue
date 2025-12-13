import React from "react"
import Image from "next/image"
import { Camera, Upload } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface ImageAreaProps {
  profileImage?: string
  onImageUpload: () => void
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  favoriteColor: string
}

export const ImageArea: React.FC<ImageAreaProps> = ({
  profileImage,
  onImageUpload,
  onFileSelect,
  fileInputRef,
  favoriteColor,
}) => {
  const isMobile = useIsMobile()

  return (
    <div
      className={`relative ${isMobile ? 'aspect-[3/2]' : 'aspect-[4/3]'} w-full bg-muted/50 border-b-4 group overflow-hidden mx-auto`}
      style={{
        borderColor: `${favoriteColor}40`,
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
              src={profileImage}
              alt="Imagem de perfil do personagem"
              fill
              className="w-full h-full object-cover"
            />
            {/* Favorite color overlay effect */}
            <div
              className="absolute inset-0 opacity-20 mix-blend-multiply"
              style={{
                backgroundColor: favoriteColor,
              }}
            />
            {/* Subtle border glow */}
            <div
              className="absolute inset-0 border-2 opacity-30"
              style={{
                borderColor: favoriteColor,
                boxShadow: `inset 0 0 20px ${favoriteColor}20`,
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Camera className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} opacity-50`} aria-hidden="true" />
            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-medium uppercase tracking-wider`}>
              Clique para adicionar arte
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center z-20 hide-on-capture">
          <Upload className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-white`} aria-hidden="true" />
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
  )
}
