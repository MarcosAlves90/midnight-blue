import React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface CharacterImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string | null;
  alt: string;
  /**
   * Vertical position of the image in percentage (0-100).
   * Defaults to 50 (center).
   */
  imagePosition?: number;
  /**
   * Optional fallback component to show when src is missing.
   */
  fallback?: React.ReactNode;
}

/**
 * CharacterImage Component
 *
 * Centralizes the logic for rendering character profile images with consistent
 * vertical positioning (object-position) across the application.
 */
export const CharacterImage = React.memo(
  ({
    src,
    alt,
    imagePosition,
    className,
    style,
    fallback,
    ...props
  }: CharacterImageProps) => {
    // Use nullish coalescing to ensure 0 is treated as a valid position
    const position = imagePosition ?? 50;

    if (!src) {
      return fallback ? <>{fallback}</> : null;
    }

    return (
      <Image
        src={src}
        alt={alt}
        className={cn("object-cover", className)}
        style={{
          objectPosition: `center ${position}%`,
          ...style,
        }}
        {...props}
      />
    );
  },
);

CharacterImage.displayName = "CharacterImage";
