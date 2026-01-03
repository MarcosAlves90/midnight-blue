"use client";
import { AttributesProvider } from "./AttributesContext";
import { SkillsProvider } from "./SkillsContext";
import { IdentityProvider } from "./IdentityContext";
import { CustomDescriptorsProvider } from "./CustomDescriptorsContext";
import { StatusProvider } from "./StatusContext";
import { PowersProvider } from "./PowersContext";
import { AuthProvider } from "./AuthContext";
import { CharacterProvider } from "./CharacterContext";
import { CharacterSheetProvider } from "./CharacterSheetContext";

/**
 * Componente que agrupa todos os provedores de contexto da aplicação.
 * Deve ser usado no nível mais alto da árvore de componentes para garantir
 * que todos os contextos estejam disponíveis para os componentes filhos.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CharacterProvider>
        <CharacterSheetProvider>
          <CustomDescriptorsProvider>
            <StatusProvider>
              <PowersProvider>
                <AttributesProvider>
                  <SkillsProvider>
                    <IdentityProvider>{children}</IdentityProvider>
                  </SkillsProvider>
                </AttributesProvider>
              </PowersProvider>
            </StatusProvider>
          </CustomDescriptorsProvider>
        </CharacterSheetProvider>
      </CharacterProvider>
    </AuthProvider>
  );
}
