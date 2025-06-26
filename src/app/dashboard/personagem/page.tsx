import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personagem",
};

export default function PersonagemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personagem</h1>
        <p className="text-muted-foreground">
          Gerencie todos os aspectos do seu personagem RPG.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-2">Individual</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Informações pessoais e básicas do personagem.
          </p>
          <a 
            href="/dashboard/personagem/individual" 
            className="text-sm text-primary hover:underline"
          >
            Acessar →
          </a>
        </div>
        
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-2">Status</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Atributos, HP, MP e outras estatísticas.
          </p>
          <a 
            href="/dashboard/personagem/status" 
            className="text-sm text-primary hover:underline"
          >
            Acessar →
          </a>
        </div>
        
        <div className="rounded-lg border p-6 opacity-60">
          <h3 className="font-semibold mb-2">Características</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Traços de personalidade e características únicas.
          </p>
          <span className="text-sm text-muted-foreground">Em breve</span>
        </div>
        
        <div className="rounded-lg border p-6 opacity-60">
          <h3 className="font-semibold mb-2">Skills</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Habilidades e competências do personagem.
          </p>
          <span className="text-sm text-muted-foreground">Em breve</span>
        </div>
        
        <div className="rounded-lg border p-6 opacity-60">
          <h3 className="font-semibold mb-2">Inventário</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Items, equipamentos e posses do personagem.
          </p>
          <span className="text-sm text-muted-foreground">Em breve</span>
        </div>
        
        <div className="rounded-lg border p-6 opacity-60">
          <h3 className="font-semibold mb-2">Anotações</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Notas pessoais e histórico do personagem.
          </p>
          <span className="text-sm text-muted-foreground">Em breve</span>
        </div>
      </div>
    </div>
  );
}
