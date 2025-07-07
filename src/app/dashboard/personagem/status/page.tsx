import type { Metadata } from "next"
import StatusBars from "@/components/status-bars"
import AttributesGrid from "@/components/attributes-grid"

export const metadata: Metadata = {
  title: "Status",
}

export default function PersonagemStatsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <StatusBars />
        <AttributesGrid />
        <div className="bg-card aspect-video rounded-xl" />
      </div>
      <div className="bg-card min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  )
}
