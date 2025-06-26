import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Status",
}

export default function PersonagemStatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Status do Personagem</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie os atributos do seu personagem.
        </p>
      </div>
    </div>
  )
}
