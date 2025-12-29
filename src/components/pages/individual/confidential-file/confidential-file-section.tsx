import React from "react";
import { Shield, Users, MapPin, Zap, Heart } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { Textarea } from "@/components/ui/textarea";
import { Tip } from "@/components/ui/tip";
import { useIdentityActions } from "@/contexts/IdentityContext";
import { useFieldLocalState } from "@/hooks/use-field-local-state";
import { useIdentityField } from "@/hooks/use-identity-field";

// Component now reads individual fields via subscription hooks to avoid re-renders from unrelated identity changes
function ConfidentialFileSectionInner() {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug("[dev-confidential-file] render");
    }
  });

  // Per-field memoized subcomponents which subscribe to their own field value
  const GroupField = React.useMemo(() => {
    const C: React.FC = () => {
      const { markFieldDirty, updateIdentity } = useIdentityActions();
      const ext = useIdentityField("groupAffiliation");
      const { value, handleChange, handleBlur } = useFieldLocalState(ext, (v: string) => updateIdentity("groupAffiliation", v), { debounceMs: 300, fieldName: "groupAffiliation", onDirty: () => markFieldDirty("groupAffiliation") });

      if (process.env.NODE_ENV === "development") {
        console.debug("[dev-confidential-file] GroupField render");
      }

      return (
        <div className="space-y-1.5">
          <Tip
            content={
              <div className="max-w-xs text-xs">
                O grupo ou organização ao qual o herói pertence (ex: Liga da
                Justiça, Vingadores).
              </div>
            }
            side="top"
            align="start"
          >
            <label htmlFor="groupAffiliation" className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1 cursor-help w-fit">
              <Users className="w-3 h-3" aria-hidden="true" />
              <span className="decoration-dotted underline underline-offset-2">
                Afiliação
              </span>
            </label>
          </Tip>
          <FormInput
            id="groupAffiliation"
            name="groupAffiliation"
            value={value}
            onChange={(e) => handleChange(e)}
            onBlur={handleBlur}
            placeholder="Ex: Liga da Justiça..."
            aria-label="Afiliação ou grupo do personagem"
          />
        </div>
      );
    };

    return React.memo(C);
  }, []);

  const BaseField = React.useMemo(() => {
    const C: React.FC = () => {
      const { markFieldDirty, updateIdentity } = useIdentityActions();
      const ext = useIdentityField("baseOfOperations");
      const { value, handleChange, handleBlur } = useFieldLocalState(ext, (v: string) => updateIdentity("baseOfOperations", v), { debounceMs: 300, fieldName: "baseOfOperations", onDirty: () => markFieldDirty("baseOfOperations") });

      if (process.env.NODE_ENV === "development") {
        console.debug("[dev-confidential-file] BaseField render");
      }

      return (
        <div className="space-y-1.5">
          <Tip
            content={
              <div className="max-w-xs text-xs">
                O local onde o herói opera ou vive (ex: Batcaverna, Torre dos
                Titãs, Cidade de Nova York).
              </div>
            }
            side="top"
            align="start"
          >
            <label htmlFor="baseOfOperations" className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1 cursor-help w-fit">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              <span className="decoration-dotted underline underline-offset-2">
                Base de Operações
              </span>
            </label>
          </Tip>
          <FormInput
            id="baseOfOperations"
            name="baseOfOperations"
            value={value}
            onChange={(e) => handleChange(e)}
            onBlur={handleBlur}
            placeholder="Ex: Batcaverna..."
            aria-label="Base de operações do personagem"
          />
        </div>
      );
    };

    return React.memo(C);
  }, []);

  const OriginField = React.useMemo(() => {
    const C: React.FC = () => {
      const { markFieldDirty, updateIdentity } = useIdentityActions();
      const ext = useIdentityField("powerOrigin");
      const { value, handleChange, handleBlur } = useFieldLocalState(ext, (v: string) => updateIdentity("powerOrigin", v), { debounceMs: 300, fieldName: "powerOrigin", onDirty: () => markFieldDirty("powerOrigin") });

      if (process.env.NODE_ENV === "development") {
        console.debug("[dev-confidential-file] OriginField render");
      }

      return (
        <div className="space-y-1.5">
          <Tip
            content={
              <div className="max-w-xs text-xs">
                A fonte dos poderes do herói (ex: Mutante, Tecnológico, Místico,
                Treinamento).
              </div>
            }
            side="top"
            align="start"
          >
            <label htmlFor="powerOrigin" className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1 cursor-help w-fit">
              <Zap className="w-3 h-3" aria-hidden="true" />
              <span className="decoration-dotted underline underline-offset-2">
                Origem dos Poderes
              </span>
            </label>
          </Tip>
          <FormInput
            id="powerOrigin"
            name="powerOrigin"
            value={value}
            onChange={(e) => handleChange(e)}
            onBlur={handleBlur}
            placeholder="Ex: Acidente Químico..."
            aria-label="Origem dos poderes do personagem"
          />
        </div>
      );
    };

    return React.memo(C);
  }, []);

  const MotivationField = React.useMemo(() => {
    const C: React.FC = () => {
      const { markFieldDirty, updateIdentity } = useIdentityActions();
      const ext = useIdentityField("motivation");
      const { value, handleChange, handleBlur } = useFieldLocalState(ext, (v: string) => updateIdentity("motivation", v), { debounceMs: 300, fieldName: "motivation", onDirty: () => markFieldDirty("motivation") });

      if (process.env.NODE_ENV === "development") {
        console.debug("[dev-confidential-file] MotivationField render");
      }

      return (
        <div className="space-y-1.5">
          <Tip
            content={
              <div className="max-w-xs text-xs">
                A razão pela qual o personagem age como herói (ex: Responsabilidade, Justiça, Vingança).
              </div>
            }
            side="top"
            align="start"
          >
            <label htmlFor="motivation" className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1 cursor-help w-fit">
              <Heart className="w-3 h-3" aria-hidden="true" />
              <span className="decoration-dotted underline underline-offset-2">
                Motivação
              </span>
            </label>
          </Tip>
          <Textarea
            id="motivation"
            name="motivation"
            value={value}
            onChange={(e) => handleChange(e)}
            onBlur={handleBlur}
            className="bg-muted/20 border-transparent focus:bg-background min-h-[100px] resize-none"
            placeholder="O que move seu personagem?"
            aria-label="Motivação do personagem"
          />
        </div>
      );
    };

    return React.memo(C);
  }, []);

  return (
    <div className="bg-muted/50 rounded-xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/40">
        <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Arquivo Confidencial
        </h3>
      </div>

      <div className="space-y-5">
        <GroupField />

        <BaseField />

        <OriginField />

        <MotivationField />
      </div>
    </div>
  );
}

export const ConfidentialFileSection = React.memo(ConfidentialFileSectionInner);
