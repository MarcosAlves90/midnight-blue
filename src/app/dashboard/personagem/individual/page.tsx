import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Individual",
};

export default function PersonagemStatsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Individual
                </h1>
                <p className="text-muted-foreground">
                    Esta página é dedicada a exibir informações detalhadas sobre um personagem específico.
                </p>
            </div>
        </div>
    );
}
