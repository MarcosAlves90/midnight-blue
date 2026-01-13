"use client";

import React, { useRef, useCallback } from "react";
import { captureElementAsPng } from "@/lib/image-utils";
import { useIdentityContext } from "@/contexts/IdentityContext";
import { useCharacterUpload } from "@/hooks/use-character-upload";
import { useCharacterSync } from "@/hooks/use-character-sync";
import { IdentityCard } from "@/components/pages/individual/identity-card";
import {
  BiometricDataLazy,
  PersonalDataLazy,
  ConfidentialFileLazy,
  HistoryLazy,
  ComplicationsLazy,
} from "@/components/pages/individual/lazy-sections";
import { NoCharacterSelected } from "@/components/config/character";
import { IndividualSkeleton } from "./individual-skeleton";

export default function Individual() {
  const { identity, updateIdentity } = useIdentityContext();
  const { isLoading, error } = useCharacterSync();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const { uploadImage, uploading } = useCharacterUpload();

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const previous = identity.profileImage ?? null;
        const res = await uploadImage(file, previous);
        if (res) {
          updateIdentity("profileImage", res.secure_url);
        }
      } catch (err) {
        console.error("Falha no upload de imagem:", err);
      }
    },
    [uploadImage, updateIdentity, identity.profileImage],
  );

  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      // Use idle-friendly capture helper
      const dataUrl = await captureElementAsPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "transparent",
        style: { transform: "none" },
        filter: (node: Node) => {
          if (node instanceof HTMLElement) {
            return !node.classList.contains("hide-on-capture");
          }
          return true;
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

  if (isLoading) {
    return <IndividualSkeleton />;
  }

  if (error) {
    if (error === "Nenhuma ficha selecionada") {
      // Mostrar componente reutilizável quando não há ficha selecionada
      return <NoCharacterSelected />;
    }

    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 xl:col-span-4 2xl:col-span-3">
          <div className="lg:sticky lg:top-6">
            <IdentityCard
              cardRef={cardRef}
              fileInputRef={fileInputRef}
              onImageUpload={triggerImageUpload}
              onFileSelect={handleImageUpload}
              onSave={handleSaveImage}
              isUploading={uploading}
            />
          </div>
        </div>

        <div className="lg:col-span-7 xl:col-span-8 2xl:col-span-9 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <BiometricDataLazy />
              <PersonalDataLazy />
            </div>

            <div className="space-y-4">
              <ConfidentialFileLazy />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ComplicationsLazy />
        <HistoryLazy />
      </div>
    </div>
  );
}
