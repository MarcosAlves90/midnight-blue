import React from "react";
import { FileText, MapPin, Briefcase } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { Tip } from "@/components/ui/tip";
import { IdentityData, useIdentityActions } from "@/contexts/IdentityContext";
import { useFieldLocalState } from "@/hooks/use-field-local-state";
import { ColorPickerDropdown } from "./color-picker-dropdown";

interface PersonalDataSectionProps {
  identity: IdentityData;
  onFieldChange: (field: keyof IdentityData, value: string) => void;
}

function PersonalDataInner({ identity, onFieldChange }: PersonalDataSectionProps) {
  const { markFieldDirty } = useIdentityActions();
  const { value: placeValue, handleChange: handlePlaceChange, handleBlur: handlePlaceBlur } = useFieldLocalState(identity.placeOfBirth, (v: string) => onFieldChange("placeOfBirth", v), { debounceMs: 300, fieldName: "placeOfBirth", onDirty: () => markFieldDirty("placeOfBirth") });
  const { value: occupationValue, handleChange: handleOccupationChange, handleBlur: handleOccupationBlur } = useFieldLocalState(identity.occupation, (v: string) => onFieldChange("occupation", v), { debounceMs: 300, fieldName: "occupation", onDirty: () => markFieldDirty("occupation") });

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
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
              <span className="decoration-dotted underline underline-offset-2">
                Local de Nascimento
              </span>
            </label>
          </Tip>
          <FormInput
            id="placeOfBirth"
            name="placeOfBirth"
            value={placeValue}
            onChange={(e) => handlePlaceChange(e)}
            onBlur={handlePlaceBlur}
            placeholder="Ex: São Paulo"
            aria-label="Local de nascimento do personagem"
          />
        </div>
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
              <span className="decoration-dotted underline underline-offset-2">
                Ocupação
              </span>
            </label>
          </Tip>
          <FormInput
            id="occupation"
            name="occupation"
            value={occupationValue}
            onChange={(e) => handleOccupationChange(e)}
            onBlur={handleOccupationBlur}
            placeholder="Ex: Professor"
            aria-label="Ocupação do personagem"
          />
        </div>
        <div className="md:col-span-2">
          <ColorPickerDropdown
            favoriteColor={identity.favoriteColor}
            onColorChange={(color) => onFieldChange("favoriteColor", color)}
          />
        </div>
      </div>
    </div>
  );
}

export const PersonalData = React.memo(
  PersonalDataInner,
  (prev, next) =>
    prev.identity.placeOfBirth === next.identity.placeOfBirth &&
    prev.identity.occupation === next.identity.occupation &&
    prev.identity.favoriteColor === next.identity.favoriteColor &&
    prev.onFieldChange === next.onFieldChange
);
