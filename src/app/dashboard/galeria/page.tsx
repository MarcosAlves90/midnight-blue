import type { Metadata } from "next";
import CharacterGallery from "@/components/gallery/character-gallery";

export const metadata: Metadata = {
  title: "Minhas Fichas",
};

export default function GaleriaPage() {
  return <CharacterGallery />;
}
