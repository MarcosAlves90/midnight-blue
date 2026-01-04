"use client";

import React, { useEffect, useRef } from "react";
import { useCharacter } from "@/contexts/CharacterContext";
import { useAttributesContext } from "@/contexts/AttributesContext";
import { useSkillsContext } from "@/contexts/SkillsContext";
import { usePowersContext } from "@/contexts/PowersContext";
import { useStatusContext } from "@/contexts/StatusContext";
import StatusPageContent from "./status-page-content";
import { deepEqual } from "@/lib/deep-equal";
import { useCharacterSheet } from "@/contexts/CharacterSheetContext";
import { StatusSkeleton } from "./status-skeleton";

export default function Status() {
  const { selectedCharacter } = useCharacter();
  const { isReady } = useCharacterSheet();
  const { attributes, setAttributes, dirtyFields: attributesDirty } = useAttributesContext();
  const { skills, setSkills, dirtyFields: skillsDirty } = useSkillsContext();
  const { powers, setPowers, dirtyFields: powersDirty } = usePowersContext();
  const { powerLevel, setPowerLevel, extraPoints, setExtraPoints, dirtyFields: statusDirty } = useStatusContext();

  const lastSyncedVersionRef = useRef<number>(0);
  const lastCharacterIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedCharacter) return;

    // Se trocou de personagem, reseta a versão sincronizada
    if (lastCharacterIdRef.current !== selectedCharacter.id) {
      lastSyncedVersionRef.current = 0;
      lastCharacterIdRef.current = selectedCharacter.id;
    }

    // Only sync if the server version is newer
    if (selectedCharacter.version <= lastSyncedVersionRef.current) return;

    console.debug("[Status] Syncing from character", { 
      version: selectedCharacter.version,
      prevVersion: lastSyncedVersionRef.current
    });

    // Sync Attributes
    if (selectedCharacter.attributes && !attributesDirty.has("attributes")) {
      if (!deepEqual(selectedCharacter.attributes, attributes)) {
        setAttributes(selectedCharacter.attributes);
      }
    }

    // Sync Skills
    if (selectedCharacter.skills && !skillsDirty.has("skills")) {
      if (!deepEqual(selectedCharacter.skills, skills)) {
        setSkills(selectedCharacter.skills);
      }
    }

    // Sync Powers
    if (selectedCharacter.powers && !powersDirty.has("powers")) {
      if (!deepEqual(selectedCharacter.powers, powers)) {
        setPowers(selectedCharacter.powers);
      }
    }

    // Sync Status
    if (selectedCharacter.status) {
      if (!statusDirty.has("powerLevel") && typeof selectedCharacter.status.powerLevel === "number") {
        if (selectedCharacter.status.powerLevel !== powerLevel) {
          setPowerLevel(selectedCharacter.status.powerLevel);
        }
      }
      if (!statusDirty.has("extraPoints") && typeof selectedCharacter.status.extraPoints === "number") {
        if (selectedCharacter.status.extraPoints !== extraPoints) {
          setExtraPoints(selectedCharacter.status.extraPoints);
        }
      }
    }

    lastSyncedVersionRef.current = selectedCharacter.version;
  }, [
    selectedCharacter,
    attributes, setAttributes, attributesDirty,
    skills, setSkills, skillsDirty,
    powers, setPowers, powersDirty,
    powerLevel, setPowerLevel, extraPoints, setExtraPoints, statusDirty
  ]);

  if (!isReady) {
    return <StatusSkeleton />;
  }

  return <StatusPageContent />;
}
