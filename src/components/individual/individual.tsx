"use client";

import React, { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { useIdentityContext, IdentityData } from "@/contexts/IdentityContext";
import { IdentityCard } from "@/components/individual/identity-card";
import { BiometricData } from "@/components/individual/biometric-data";
import { PersonalData } from "@/components/individual/personal-data";
import { ConfidentialFileSection } from "@/components/individual/confidential-file";
import { HistorySection } from "@/components/individual/history-data";
import { ComplicationsSection } from "@/components/individual/complications";

export default function Individual() {
  const { identity, updateIdentity } = useIdentityContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleChange = useCallback(
    <K extends keyof IdentityData>(field: K, value: IdentityData[K]) => {
      updateIdentity(field, value);
    },
    [updateIdentity],
  );

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateIdentity("profileImage", reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [updateIdentity],
  );

  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "transparent",
        style: { transform: "none" },
        filter: (node) => {
          const element = node as HTMLElement;
          return !element.classList?.contains("hide-on-capture");
        },
      });
      const link = document.createElement("a");
      link.download = "identity-card.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Erro ao salvar imagem:", error);
    }
  }, []);

  return (
    <div className="pb-10">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-3">
          <div className="sticky top-6">
            <IdentityCard
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

        <div className="xl:col-span-9 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <BiometricData
                identity={identity}
                onFieldChange={handleChange}
              />
              <PersonalData
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ComplicationsSection
          identity={identity}
          onFieldChange={handleChange}
        />
        <HistorySection identity={identity} onFieldChange={handleChange} />
      </div>
    </div>
  );
}
