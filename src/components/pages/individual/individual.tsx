"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import { useIdentityContext, IdentityData } from "@/contexts/IdentityContext";
import { useAvatarUpload } from "@/hooks/use-avatar-upload";
import { useSelectedCharacter } from "@/hooks/use-selected-character";
import { IdentityCard } from "@/components/pages/individual/identity-card";
import { ConflictBanner } from "@/components/ui/conflict-banner";
import { ConflictModal } from "@/components/ui/conflict-modal";
import { BiometricData } from "@/components/pages/individual/biometric-data";
import { PersonalData } from "@/components/pages/individual/personal-data";
import { ConfidentialFileSection } from "@/components/pages/individual/confidential-file";
import { HistorySection } from "@/components/pages/individual/history-data";
import { ComplicationsSection } from "@/components/pages/individual/complications";
import { deepEqual } from "@/lib/deep-equal";
import { NoCharacterSelected } from "@/components/config/character";

export default function Individual() {
  const { identity, setIdentity, updateIdentity, setCurrentCharacterId, dirtyFields } = useIdentityContext();
  const { character, isLoading, error } = useSelectedCharacter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const characterIdRef = useRef<string | null>(null);

  // Sincroniza a identity quando character muda (e.g., ao trocar de ficha)
  // IMPORTANTE: Não dispara auto-save aqui, apenas sincroniza o estado local
  useEffect(() => {
    if (!character?.identity || !character.id) return;

    // Evita re-sincronização se o ID não mudou
    if (characterIdRef.current === character.id) {
      return;
    }

    characterIdRef.current = character.id;

    // Apenas sincroniza para IdentityContext (sem dispara auto-save)
    setCurrentCharacterId?.(character.id);

    // Atualiza o estado da identidade carregada
    setIdentity((prev) => {
      let hasChanged = false;

      // Coleta somente os campos que mudaram
      const changedEntries: [string, unknown][] = [];
      Object.entries(character.identity).forEach(([key, val]) => {
        const k = key as keyof IdentityData;
        const newVal = val as IdentityData[typeof k];
        const curVal = prev[k];

        const changed =
          typeof newVal === "object" && newVal !== null
            ? !deepEqual(newVal, curVal)
            : newVal !== curVal;

        if (changed) {
          changedEntries.push([key, newVal]);
          hasChanged = true;
        }
      });

      if (!hasChanged) return prev;

      // Filter out any fields that are currently dirty (local edits) to avoid overwriting
      const patch = Object.fromEntries(
        changedEntries.filter(([k]) => !dirtyFields.has(k)),
      ) as Partial<IdentityData>;

      return { ...prev, ...patch } as IdentityData;
    });
  }, [character?.id, character?.identity, setCurrentCharacterId, setIdentity, dirtyFields]);

  const handleChange = useCallback(
    <K extends keyof IdentityData>(field: K, value: IdentityData[K]) => {
      updateIdentity(field, value);
    },
    [updateIdentity],
  );

  const { uploadAvatar } = useAvatarUpload();

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const previous = identity.profileImage ?? null;
        const res = await uploadAvatar(file, previous);
        if (res) {
          updateIdentity("profileImage", res.secure_url);
        }
      } catch (err) {
        console.error("Falha no upload de imagem:", err);
      }
    },
    [uploadAvatar, updateIdentity, identity.profileImage],
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

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Carregando ficha...</div>;
  }

  if (error) {
    if (error === "Nenhuma ficha selecionada") {
      // Mostrar componente reutilizável quando não há ficha selecionada
      return <NoCharacterSelected />;
    }

    return <div className="flex items-center justify-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="pb-10">
      <div className="mb-4">
        {/* Conflict UI */}
        <ConflictBanner />
        <ConflictModal />
      </div>

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
