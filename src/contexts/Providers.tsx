"use client"
import { AttributesProvider } from "./AttributesContext";
import { BiotypesProvider } from "./BiotypesContext";

/**
 * Componente que agrupa todos os provedores de contexto da aplicação.
 * Deve ser usado no nível mais alto da árvore de componentes para garantir
 * que todos os contextos estejam disponíveis para os componentes filhos.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AttributesProvider>
      <BiotypesProvider>
        {children}
      </BiotypesProvider>
    </AttributesProvider>
  );
} 