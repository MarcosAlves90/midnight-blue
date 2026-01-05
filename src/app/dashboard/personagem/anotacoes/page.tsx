import NotesGallery from "@/components/pages/notes/notes-gallery";
import RequireCharacter from "@/components/config/character/require-character";

export const metadata = {
  title: "Anotações | Midnight Blue",
  description: "Gerencie suas anotações e lore",
};

export default function NotesPage() {
  return (
    <RequireCharacter>
      <NotesGallery />
    </RequireCharacter>
  );
}
