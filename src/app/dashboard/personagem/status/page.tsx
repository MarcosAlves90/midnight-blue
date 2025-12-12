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
      <div className="bg-card flex-1 rounded-xl p-6 h-fit">
        <SkillsList />
      </div>
    </div>
  )
}
