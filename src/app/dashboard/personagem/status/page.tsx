import type { Metadata } from "next"
import AttributesGrid from "@/components/attributes-grid"
import AdvancedStatus from "@/components/advanced-status"
import SkillsList from "@/components/skills"

export const metadata: Metadata = {
  title: "Status",
}

export default function PersonagemStatsPage() {
  return (
    <div className="flex flex-1 gap-4 pt-0 max-xl:flex-col">
      <div className="flex flex-col gap-4 max-w-120">
        <AttributesGrid />
        <AdvancedStatus />
      </div>
      <div className="bg-card min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6">
        <SkillsList />
      </div>
    </div>
  )
}
