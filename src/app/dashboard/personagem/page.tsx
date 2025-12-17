import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personagem",
};

export default function PersonagemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personagem</h1>
        <p className="text-muted-foreground">
          Dossiê completo e gestão de dados operacionais do indivíduo sob
          supervisão.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-2">Individual</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Dados pessoais, identificação civil e registro de antecedentes.
          </p>
          <Link
            href="/dashboard/personagem/individual"
            className="text-sm text-primary hover:underline"
          >
            Acessar →
          </Link>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-2">Status</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Avaliação física, condições de saúde e capacidades operacionais.
          </p>
          <Link
            href="/dashboard/personagem/status"
            className="text-sm text-primary hover:underline"
          >
            Acessar →
          </Link>
        </div>

        <div className="rounded-lg border p-6 opacity-60">
          <h3 className="font-semibold mb-2">Características</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Perfil psicológico, padrões comportamentais e peculiaridades
            observadas.
          </p>
          <span className="text-sm text-muted-foreground">Classificado</span>
        </div>

        <div className="rounded-lg border p-6 opacity-60">
          <h3 className="font-semibold mb-2">Skills</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Competências técnicas, treinamentos militares e especializações.
          </p>
          <span className="text-sm text-muted-foreground">Classificado</span>
        </div>

        <div className="rounded-lg border p-6 opacity-60">
          <h3 className="font-semibold mb-2">Inventário</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Arsenal pessoal, equipamentos táticos e bens materiais registrados.
          </p>
          <span className="text-sm text-muted-foreground">Classificado</span>
        </div>

        <div className="rounded-lg border p-6 opacity-60">
          <h3 className="font-semibold mb-2">Anotações</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Relatórios de campo, observações e registros de atividades
            suspeitas.
          </p>
          <span className="text-sm text-muted-foreground">Classificado</span>
        </div>
      </div>
    </div>
  );
}
