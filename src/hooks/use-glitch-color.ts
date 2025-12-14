"use client"

import { useState, useEffect, useRef } from "react"

interface UseGlitchColorProps {
  baseColor: string
  glitchColor?: string
  glitchChance?: number
  glitchDuration?: number
  intervalMs?: number
}

export function useGlitchColor({
  baseColor,
  glitchColor = "#ef4444",
  glitchChance = 0.15,
  glitchDuration = 150,
  intervalMs = 200,
}: UseGlitchColorProps): string {
  const [currentColor, setCurrentColor] = useState(baseColor)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setCurrentColor(baseColor)
  }, [baseColor])

  useEffect(() => {
    const cleanup = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      if (Math.random() < glitchChance) {
        setCurrentColor(glitchColor)
        timeoutRef.current = setTimeout(() => {
          setCurrentColor(baseColor)
        }, glitchDuration)
      }
    }, intervalMs)

    return cleanup
  }, [baseColor, glitchColor, glitchChance, glitchDuration, intervalMs])

  return currentColor
}
