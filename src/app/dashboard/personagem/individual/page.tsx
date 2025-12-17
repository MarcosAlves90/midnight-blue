import type { Metadata } from "next";
import IdentityForm from "@/components/identity-form";

export const metadata: Metadata = {
  title: "Identidade",
};

export default function PersonagemStatsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <IdentityForm />
    </div>
  );
}
