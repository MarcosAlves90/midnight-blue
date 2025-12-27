import type { Metadata } from "next";
import { Individual } from "@/components/individual";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Identidade",
};

export default function PersonagemStatsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <Suspense fallback={<div>Carregando...</div>}>
        <Individual />
      </Suspense>
    </div>
  );
}
