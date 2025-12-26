"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { buildImageUrl } from "@/lib/cloudinary";

// Global mouse position state
let globalMousePosition = { x: 0, y: 0 };
let listeners: Array<(pos: { x: number; y: number }) => void> = [];
let hasGlobalListener = false;
let globalHandleMouseMove: ((e: MouseEvent) => void) | null = null;

const addMouseListener = (
  callback: (pos: { x: number; y: number }) => void,
) => {
  listeners.push(callback);

  if (!hasGlobalListener) {
    globalHandleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;

      globalMousePosition = { x, y };
      listeners.forEach((listener) => listener(globalMousePosition));
    };

    window.addEventListener("mousemove", globalHandleMouseMove);
    hasGlobalListener = true;
  }

  return () => {
    listeners = listeners.filter((l) => l !== callback);
    if (listeners.length === 0 && hasGlobalListener && globalHandleMouseMove) {
      window.removeEventListener("mousemove", globalHandleMouseMove);
      hasGlobalListener = false;
      globalHandleMouseMove = null;
    }
  };
};

interface ParallaxBackgroundProps {
  src: string;
  alt: string;
  intensity?: number;
  overlayType?: "blue" | "black";
}

export default function ParallaxBackground({
  src,
  alt,
  intensity = 10,
  overlayType = "blue",
}: ParallaxBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const cleanup = addMouseListener(setMousePosition);
    return cleanup;
  }, []);

  const overlayClasses =
    overlayType === "blue"
      ? "absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-indigo-900/40"
      : "absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-gray-900/80";

  const finalSrc = /^https?:\/\//.test(src) ? src : buildImageUrl(src);

  return (
    <div
      className="absolute inset-0 transition-transform duration-700 ease-out"
      style={{
        transform: `translate(${-mousePosition.x * intensity}px, ${-mousePosition.y * intensity}px) scale(1.05)`,
      }}
    >
      <Image
        src={finalSrc}
        alt={alt}
        fill
        className="object-cover"
        style={{ imageRendering: "pixelated" }}
        priority
        sizes="100vw"
        quality={85}
        unoptimized={src.endsWith(".gif")}
      />

      <div className="absolute inset-0 bg-black/60 backdrop-blur-[5px]"></div>
      <div className={overlayClasses}></div>
    </div>
  );
}
