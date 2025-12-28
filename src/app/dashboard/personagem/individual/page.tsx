import type { Metadata } from "next";
import RequireCharacter from "@/components/config/character/require-character";

export const metadata: Metadata = {
  title: "Individual",
};

export default function IndividualIndexPage() {
  // RequireCharacter will redirect to the selected character's page when present
  return <RequireCharacter redirectToSelected />;
}
