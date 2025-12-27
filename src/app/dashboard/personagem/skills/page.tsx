import type { Metadata } from "next";
import SkillsList from "@/components/status/skills";
import AttributesGrid from "@/components/status/attributes-grid/attributes-grid";

export const metadata: Metadata = {
  title: "Skills",
};

export default function PersonagemSkillsPage() {
  return (
    <div className="flex flex-1 gap-4 pt-0">
      <div className="flex flex-col gap-4 max-w-120">
        <AttributesGrid />
      </div>
      <div className="bg-card min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6">
        <h2 className="text-lg font-medium mb-4">Perícias</h2>
        <SkillsList />
      </div>
    </div>
  );
}
