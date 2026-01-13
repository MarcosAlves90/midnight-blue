import type { Metadata } from "next";
import { CharacterGallery } from "@/components/pages/gallery";

export const metadata: Metadata = {
  title: "Minhas Fichas",
};

export default function GaleriaPage() {
  return <CharacterGallery />;
}
