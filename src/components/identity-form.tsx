"use client"

import React, { useRef, useCallback } from "react"
import { toPng } from 'html-to-image'
import { useIdentityContext, IdentityData } from "@/contexts/IdentityContext"
import { IdentityCardContainer } from "./identity/identity-card-container"
import { BiometricDataSection } from "./identity/biometric-data-section"
import { PersonalDataSection } from "./identity/personal-data-section"
import { ConfidentialFileSection } from "./identity/confidential-file-section"
import { HistorySection } from "./identity/history-section"
import { ComplicationsSection } from "./identity/complications-section"

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

  /**
   * Updates identity field value
   */
  const handleChange = useCallback(
    <K extends keyof IdentityData>(field: K, value: IdentityData[K]) => {
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
    <div className="pb-10">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: ID Card */}
        <div className="xl:col-span-3">
          <div className="sticky top-6">
            <IdentityCardContainer
              identity={identity}
              cardRef={cardRef}
              onFieldChange={handleChange}
              fileInputRef={fileInputRef}
              onImageUpload={triggerImageUpload}
              onFileSelect={handleImageUpload}
              onSave={handleSaveImage}
            />
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="xl:col-span-9 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <BiometricDataSection
                identity={identity}
                onFieldChange={handleChange}
              />
              <PersonalDataSection
                identity={identity}
                onFieldChange={handleChange}
              />
            </div>

            <div className="space-y-4">
              <ConfidentialFileSection
                identity={identity}
                onFieldChange={handleChange}
              />
            </div>
          </div>
          
        </div>
      </div>

      {/* History and Complications Sections - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ComplicationsSection
          identity={identity}
          onFieldChange={handleChange}
        />
        <HistorySection
          identity={identity}
          onFieldChange={handleChange}
        />

      </div>
    </div>
  )
}
