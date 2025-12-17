import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loja",
};

export default function LojaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Loja</h1>
        <p className="text-muted-foreground">
          Explore diferentes estabelecimentos para equipamentos e serviços.
        </p>
      </div>
    </div>
  );
}
