"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

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

export default function GlitchText({
    children,
    className = "",
    glitchChance = 0.1,
    glitchDuration = 150,
    intervalMs = 100,
    alternateText,
    alternateChance = 0.4,
    characterGlitchChance = 0.3,
    enabled = true,
}: GlitchTextProps) {
    const [displayText, setDisplayText] = useState(children);
    const [isGlitching, setIsGlitching] = useState(false);
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
                    ? GLITCH_CHARS[
                        Math.floor(Math.random() * GLITCH_CHARS.length)
                    ]
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
        setDisplayText(children);
        setIsGlitching(false);
        timeoutRef.current = null;
    }, [children]);

    // Trigger glitch effect
    const triggerGlitch = useCallback(() => {
        if (!enabled) return;

        setIsGlitching(true);

        // Decide between alternate text or character glitch
        if (alternateText && Math.random() < alternateChance) {
            setDisplayText(alternateText);
        } else {
            setDisplayText(generateGlitchedText());
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
            setDisplayText(children);
            setIsGlitching(false);
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
        if (!isGlitching) {
            setDisplayText(children);
        }
    }, [children, isGlitching]);

    // Cleanup on unmount
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    return (
        <span
            className={`${className} ${
                isGlitching ? "text-red-400" : ""
            } transition-colors duration-75`}
        >
            {displayText}
        </span>
    );
}
