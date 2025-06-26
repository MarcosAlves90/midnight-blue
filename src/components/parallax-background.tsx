'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface ParallaxBackgroundProps {
    src: string
    alt: string
    intensity?: number
}

export default function ParallaxBackground({
    src,
    alt,
    intensity = 10
}: ParallaxBackgroundProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const { innerWidth, innerHeight } = window

            const x = (clientX / innerWidth - 0.5) * 2
            const y = (clientY / innerHeight - 0.5) * 2

            setMousePosition({ x, y })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div
            className="absolute inset-0 transition-transform duration-700 ease-out"
            style={{
                transform: `translate(${-mousePosition.x * intensity}px, ${-mousePosition.y * intensity}px) scale(1.05)`,
            }}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                priority
                sizes="100vw"
                quality={85}
            />

            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-indigo-900/40"></div>
        </div>
    )
}
