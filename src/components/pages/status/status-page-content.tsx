"use client";

import AttributesGrid from "@/components/pages/status/attributes-grid";
import AdvancedStatus from "@/components/pages/status/advanced-status";
import SkillsList from "@/components/pages/status/skills";
import PowersSection from "@/components/pages/status/powers";

export default function StatusPageContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Main Grid */}
      <div className="flex flex-1 gap-4 pt-0 max-xl:flex-col">
        <div className="flex flex-col gap-4 max-w-120">
          <AttributesGrid />
          <AdvancedStatus />
        </div>
        <div className="flex gap-4 flex-1 max-xl:flex-col">
          <div className="bg-muted/50 flex-1 rounded-none p-6 h-fit border border-white/5">
            <SkillsList />
          </div>
          <div className="bg-muted/50 flex-1 rounded-none p-6 h-fit border border-white/5">
            <PowersSection />
          </div>
        </div>
      </div>
    </div>
  );
}
