"use client";
import { AttributesProvider } from "./AttributesContext";
import { SkillsProvider } from "./SkillsContext";
import { IdentityProvider } from "./IdentityContext";
import { CustomDescriptorsProvider } from "./CustomDescriptorsContext";
import { StatusProvider } from "./StatusContext";
import { AuthProvider } from "./AuthContext";
import { CharacterProvider } from "./CharacterContext";

/**
 * Componente que agrupa todos os provedores de contexto da aplicação.
 * Deve ser usado no nível mais alto da árvore de componentes para garantir
 * que todos os contextos estejam disponíveis para os componentes filhos.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CharacterProvider>
        <CustomDescriptorsProvider>
          <StatusProvider>
            <AttributesProvider>
              <SkillsProvider>
                <IdentityProvider>{children}</IdentityProvider>
              </SkillsProvider>
            </AttributesProvider>
          </StatusProvider>
        </CustomDescriptorsProvider>
      </CharacterProvider>
    </AuthProvider>
  );
}
