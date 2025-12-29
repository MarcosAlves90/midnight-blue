import React from "react";
import { FileText, MapPin, Briefcase } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { Tip } from "@/components/ui/tip";
import { useIdentityActions } from "@/contexts/IdentityContext";
import { useFieldLocalState } from "@/hooks/use-field-local-state";
import { useIdentityField } from "@/hooks/use-identity-field";
import { ColorPickerDropdown } from "./color-picker-dropdown";

function PersonalDataInner() {
  const { markFieldDirty, updateIdentity } = useIdentityActions();

  const PlaceField = React.useMemo(() => {
    const C: React.FC = () => {
      const ext = useIdentityField("placeOfBirth");
      const { value, handleChange, handleBlur } = useFieldLocalState(ext, (v: string) => updateIdentity("placeOfBirth", v), { debounceMs: 300, fieldName: "placeOfBirth", onDirty: () => markFieldDirty("placeOfBirth") });

      if (process.env.NODE_ENV === "development") console.debug("[dev-personal-data] PlaceField render");

      return (
        <div className="space-y-1.5">
          <Tip
            content={
              <div className="max-w-xs text-xs">
                O local onde o personagem nasceu (cidade, país, planeta, etc).
              </div>
            }
            side="top"
            align="start"
          >
            <label htmlFor="placeOfBirth" className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1 cursor-help w-fit">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              <span className="decoration-dotted underline underline-offset-2">Local de Nascimento</span>
            </label>
          </Tip>
          <FormInput id="placeOfBirth" name="placeOfBirth" value={value} onChange={(e) => handleChange(e)} onBlur={handleBlur} placeholder="Ex: São Paulo" aria-label="Local de nascimento do personagem" />
        </div>
      );
    };

    return React.memo(C);
  }, [markFieldDirty, updateIdentity]);

  const OccupationField = React.useMemo(() => {
    const C: React.FC = () => {
      const ext = useIdentityField("occupation");
      const { value, handleChange, handleBlur } = useFieldLocalState(ext, (v: string) => updateIdentity("occupation", v), { debounceMs: 300, fieldName: "occupation", onDirty: () => markFieldDirty("occupation") });

      if (process.env.NODE_ENV === "development") console.debug("[dev-personal-data] OccupationField render");

      return (
        <div className="space-y-1.5">
          <Tip
            content={
              <div className="max-w-xs text-xs">
                A profissão ou ocupação principal do personagem quando não está
                atuando como herói.
              </div>
            }
            side="top"
            align="start"
          >
            <label htmlFor="occupation" className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1 cursor-help w-fit">
              <Briefcase className="w-3 h-3" aria-hidden="true" />
              <span className="decoration-dotted underline underline-offset-2">Ocupação</span>
            </label>
          </Tip>
          <FormInput id="occupation" name="occupation" value={value} onChange={(e) => handleChange(e)} onBlur={handleBlur} placeholder="Ex: Professor" aria-label="Ocupação do personagem" />
        </div>
      );
    };

    return React.memo(C);
  }, [markFieldDirty, updateIdentity]);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug("[dev-personal-data] render");
    }
  });

  return (
    <div className="bg-muted/50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/40">
        <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Dados Pessoais
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlaceField />
        <OccupationField />
        <div className="md:col-span-2">
          <ColorPickerDropdown
            favoriteColor={useIdentityField("favoriteColor") || "#1e3a8a"}
            onColorChange={(color) => updateIdentity("favoriteColor", color)}
          />
        </div>
      </div>
    </div>
  );
}

export const PersonalData = React.memo(PersonalDataInner);
