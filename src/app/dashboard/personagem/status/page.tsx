import type { Metadata } from "next";
import RequireCharacter from "@/components/config/character/require-character";

export const metadata: Metadata = {
  title: "Status",
};

export default function StatusIndexPage() {
  // RequireCharacter will redirect to the selected character's status page when present
  // This prevents 404 when clicking "Status" in the breadcrumb
  return <RequireCharacter redirectToSelected redirectBase="/dashboard/personagem/status" />;
}
