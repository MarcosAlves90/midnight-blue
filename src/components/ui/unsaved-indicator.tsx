"use client";

import * as React from "react";
import { useIdentityContext } from "@/contexts/IdentityContext";

export function UnsavedIndicator() {
  const { hasLocalChanges } = useIdentityContext();

  if (!hasLocalChanges) return null;

  return (
    <div className="unsaved-indicator" role="status" aria-live="polite" title="Alterações não salvas">
      <svg className="w-4 h-4 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>
  );
}
