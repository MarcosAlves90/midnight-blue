"use client";

import Image from "next/image";
import { useState, useEffect, memo } from "react";
import { buildImageUrl } from "@/lib/cloudinary";

// Global mouse position state with RAF-based update
let globalMousePosition = { x: 0, y: 0 };
let nextMousePosition = { x: 0, y: 0 };
let listeners: Array<(pos: { x: number; y: number }) => void> = [];
let hasGlobalListener = false;
let rafId: number | null = null;
let globalHandleMouseMove: ((e: MouseEvent) => void) | null = null;

const updateListeners = () => {
  if (
    nextMousePosition.x !== globalMousePosition.x ||
    nextMousePosition.y !== globalMousePosition.y
  ) {
    globalMousePosition = { ...nextMousePosition };
    listeners.forEach((listener) => listener(globalMousePosition));
  }
  rafId = null;
};

const scheduleUpdate = () => {
  if (rafId === null) {
    rafId = requestAnimationFrame(updateListeners);
  }
};

const addMouseListener = (
  callback: (pos: { x: number; y: number }) => void,
) => {
  listeners.push(callback);

  if (!hasGlobalListener) {
    globalHandleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      nextMousePosition = {
        x: (clientX / innerWidth - 0.5) * 2,
        y: (clientY / innerHeight - 0.5) * 2,
      };
      scheduleUpdate();
    };

    window.addEventListener("mousemove", globalHandleMouseMove, {
      passive: true,
    });
    hasGlobalListener = true;
  }

  return () => {
    listeners = listeners.filter((l) => l !== callback);
    if (listeners.length === 0 && hasGlobalListener && globalHandleMouseMove) {
      window.removeEventListener("mousemove", globalHandleMouseMove);
      hasGlobalListener = false;
      globalHandleMouseMove = null;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };
};

interface ParallaxBackgroundProps {
  src: string;
  alt: string;
  intensity?: number;
  overlayType?: "blue" | "black";
}

function ParallaxBackground({
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
        willChange: "transform",
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

export default memo(ParallaxBackground);
