import type { Metadata } from "next";
import AttributesGrid from "@/components/pages/status/attributes-grid";
import AdvancedStatus from "@/components/pages/status/advanced-status";
import SkillsList from "@/components/pages/status/skills";
import PowersSection from "@/components/pages/status/powers";

export const metadata: Metadata = {
  title: "Status",
};

import RequireCharacter from "@/components/config/character/require-character";

export default function PersonagemStatsPage() {
  return (
    <RequireCharacter>
      <div className="flex flex-col gap-6">
        {/* Main Grid */}
        <div className="flex flex-1 gap-4 pt-0 max-xl:flex-col">
          <div className="flex flex-col gap-4 max-w-120">
            <AttributesGrid />
            <AdvancedStatus />
          </div>
          <div className="flex gap-4 flex-1 max-xl:flex-col">
            <div className="bg-muted/50 flex-1 rounded-xl p-6 h-fit">
              <SkillsList />
            </div>
            <div className="bg-muted/50 flex-1 rounded-xl p-6 h-fit">
              <PowersSection />
            </div>
          </div>
        </div>
      </div>
    </RequireCharacter>
  );
}
