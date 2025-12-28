"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import NoCharacterSelected from "./no-character-selected";
import { useSelectedCharacter } from "@/hooks/use-selected-character";

export default function RequireCharacter({
  children,
  redirectToSelected = false,
  redirectBase = "/dashboard/personagem/individual",
}: {
  children?: React.ReactNode;
  redirectToSelected?: boolean;
  redirectBase?: string;
}) {
  const router = useRouter();
  const { character, isLoading } = useSelectedCharacter();

  useEffect(() => {
    if (!isLoading && character && redirectToSelected) {
      router.replace(`${redirectBase}/${character.id}`);
    }
  }, [character, isLoading, redirectToSelected, redirectBase, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Carregando ficha...</div>;
  }

  if (!character) {
    return <NoCharacterSelected />;
  }

  // If we redirected above, render a small loading state until router completes
  if (redirectToSelected) {
    return <div className="flex items-center justify-center p-8">Redirecionando para a ficha...</div>;
  }

  return <>{children}</>;
}
