"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import NoCharacterSelected from "./no-character-selected";
import { useSelectedCharacter } from "@/hooks/use-selected-character";
import { IndividualSkeleton } from "@/components/pages/individual/individual-skeleton";
import { StatusSkeleton } from "@/components/pages/status/status-skeleton";
import { NotesSkeleton } from "@/components/pages/notes/notes-skeleton";

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
  const pathname = usePathname();
  const { character, isLoading } = useSelectedCharacter();

  useEffect(() => {
    if (!isLoading && character && redirectToSelected) {
      router.replace(`${redirectBase}/${character.id}`);
    }
  }, [character, isLoading, redirectToSelected, redirectBase, router]);

  if (isLoading) {
    if (pathname?.includes("/individual")) {
      return <IndividualSkeleton />;
    }
    if (pathname?.includes("/status") || pathname?.includes("/skills")) {
      return <StatusSkeleton />;
    }
    if (pathname?.includes("/anotacoes")) {
      return <NotesSkeleton />;
    }
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20" />
        <div className="h-4 w-32 bg-muted rounded" />
      </div>
    );
  }

  if (!character) {
    return <NoCharacterSelected />;
  }

  // If we redirected above, render a small loading state until router completes
  if (redirectToSelected) {
    if (pathname?.includes("/individual")) {
      return <IndividualSkeleton />;
    }
    if (pathname?.includes("/status") || pathname?.includes("/skills")) {
      return <StatusSkeleton />;
    }
    if (pathname?.includes("/anotacoes")) {
      return <NotesSkeleton />;
    }
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20" />
        <div className="h-4 w-48 bg-muted rounded" />
      </div>
    );
  }

  return <>{children}</>;
}
