"use client";

import { useEffect, useCallback, useMemo, useRef, memo } from "react";

interface GlitchTextProps {
  children: string;
  className?: string;
  glitchChance?: number;
  glitchDuration?: number;
  intervalMs?: number;
  alternateText?: string;
  alternateChance?: number;
  characterGlitchChance?: number;
  enabled?: boolean;
}

const GLITCH_CHARS =
  "!@#$%^&*()_+-=[]{}|;:,.<>?~`АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя0123456789";

/**
 * GlitchText optimized to avoid React re-renders during the glitch effect.
 * Uses direct DOM manipulation for high-frequency visual updates.
 */
const GlitchText = memo(
  ({
    children,
    className = "",
    glitchChance = 0.1,
    glitchDuration = 150,
    intervalMs = 100,
    alternateText,
    alternateChance = 0.4,
    characterGlitchChance = 0.3,
    enabled = true,
  }: GlitchTextProps) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Memoize the character array to avoid repeated splits
    const textChars = useMemo(() => children.split(""), [children]);

    // Memoize glitch function to avoid recreation
    const generateGlitchedText = useCallback(() => {
      return textChars
        .map((char) => {
          if (char === " ") return char;
          return Math.random() < characterGlitchChance
            ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            : char;
        })
        .join("");
    }, [textChars, characterGlitchChance]);

    // Cleanup function
    const cleanup = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);

    // Reset to original text
    const resetText = useCallback(() => {
      if (spanRef.current) {
        spanRef.current.textContent = children;
        spanRef.current.classList.remove("text-red-400");
      }
      timeoutRef.current = null;
    }, [children]);

    // Trigger glitch effect
    const triggerGlitch = useCallback(() => {
      if (!enabled || !spanRef.current) return;

      spanRef.current.classList.add("text-red-400");

      // Decide between alternate text or character glitch
      if (alternateText && Math.random() < alternateChance) {
        spanRef.current.textContent = alternateText;
      } else {
        spanRef.current.textContent = generateGlitchedText();
      }

      // Clean up previous timeout if exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Schedule reset
      timeoutRef.current = setTimeout(resetText, glitchDuration);
    }, [
      enabled,
      alternateText,
      alternateChance,
      generateGlitchedText,
      glitchDuration,
      resetText,
    ]);

    useEffect(() => {
      if (!enabled) {
        cleanup();
        if (spanRef.current) {
          spanRef.current.textContent = children;
          spanRef.current.classList.remove("text-red-400");
        }
        return;
      }

      // Clean up previous interval
      cleanup();

      intervalRef.current = setInterval(() => {
        if (Math.random() < glitchChance) {
          triggerGlitch();
        }
      }, intervalMs);

      return cleanup;
    }, [enabled, glitchChance, intervalMs, triggerGlitch, cleanup, children]);

    // Update display text when children changes
    useEffect(() => {
      if (spanRef.current) {
        spanRef.current.textContent = children;
      }
    }, [children]);

    // Cleanup on unmount
    useEffect(() => {
      return cleanup;
    }, [cleanup]);

    return (
      <span
        ref={spanRef}
        className={`${className} transition-colors duration-75`}
      >
        {children}
      </span>
    );
  },
);

GlitchText.displayName = "GlitchText";

export default GlitchText;
