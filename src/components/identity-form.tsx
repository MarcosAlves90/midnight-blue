"use client"

import React, { useRef, useState, useCallback } from "react"
import { toPng } from 'html-to-image'
import { useIdentityContext, IdentityData } from "@/contexts/IdentityContext"
import { MousePosition } from "./identity/types"
import { IdentityCardContainer } from "./identity/identity-card-container"
import { BiometricDataSection } from "./identity/biometric-data-section"
import { PersonalDataSection } from "./identity/personal-data-section"
import { ConfidentialFileSection } from "./identity/confidential-file-section"

// ============================================================================
// Component: IdentityForm
// ============================================================================

/**
 * Main identity form component that manages character creation and editing
 * Includes 3D card with biometric and personal data sections
 */
export default function IdentityForm() {
  const { identity, updateIdentity } = useIdentityContext()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })

  /**
   * Handles mouse movement for 3D card rotation effect
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const x = (e.clientX - centerX) / (rect.width / 2)
      const y = (e.clientY - centerY) / (rect.height / 2)

      setMousePosition({ x, y })
    },
    []
  )

  /**
   * Resets the card position when mouse leaves
   */
  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0, y: 0 })
  }, [])

  /**
   * Updates identity field value
   */
  const handleChange = useCallback(
    (field: keyof IdentityData, value: string) => {
      updateIdentity(field, value)
    },
    [updateIdentity]
  )

  /**
   * Handles image file upload
   */
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          updateIdentity("profileImage", reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [updateIdentity]
  )

  /**
   * Triggers the file input dialog
   */
  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /**
   * Saves the identity card as an image
   */
  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current) return
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: 'transparent',
        style: { transform: 'none' },
        filter: (node) => {
          const element = node as HTMLElement
          return !element.classList?.contains("hide-on-capture")
        },
      })
      const link = document.createElement('a')
      link.download = 'identity-card.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Erro ao salvar imagem:', error)
    }
  }, [])

  return (
    <div className="space-y-4 pb-10">
      {/* ID Card Section */}
      <IdentityCardContainer
        identity={identity}
        mousePosition={mousePosition}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        cardRef={cardRef}
        onFieldChange={handleChange}
        fileInputRef={fileInputRef}
        onImageUpload={triggerImageUpload}
        onFileSelect={handleImageUpload}
        onSave={handleSaveImage}
      />

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Physical & Personal */}
        <div className="lg:col-span-7 space-y-4">
          <BiometricDataSection
            identity={identity}
            onFieldChange={handleChange}
          />
          <PersonalDataSection
            identity={identity}
            onFieldChange={handleChange}
          />
        </div>

        {/* Right Column: Background */}
        <div className="lg:col-span-5 space-y-6">
          <ConfidentialFileSection
            identity={identity}
            onFieldChange={handleChange}
          />
        </div>
      </div>
    </div>
  )
}
