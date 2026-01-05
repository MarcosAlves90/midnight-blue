import React from "react";
import { FormInput } from "@/components/ui/form-input";
import { Tip } from "@/components/ui/tip";
import { Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGlitchColor } from "@/hooks/use-glitch-color";
import GlitchText from "@/components/ui/custom/glitch-text";
import { useFieldLocalState } from "@/hooks/use-field-local-state";
import { useIdentityActions } from "@/contexts/IdentityContext";
import { useIdentityField } from "@/hooks/use-identity-field";

interface IdentityCardHeaderProps {
  favoriteColor: string;
  onSave: () => void;
}

export const IdentityCardHeader: React.FC<IdentityCardHeaderProps> = ({
  favoriteColor,
  onSave,
}) => {
  const isMobile = useIsMobile();
  const glitchColor = useGlitchColor({
    baseColor: favoriteColor,
    glitchColor: "#ef4444",
    glitchChance: 0.12,
    glitchDuration: 150,
    intervalMs: 250,
  });

  const { markFieldDirty, updateIdentity } = useIdentityActions();
  const ext = useIdentityField("heroName");
  const { value, handleChange, handleBlur } = useFieldLocalState(ext, (v: string) => updateIdentity("heroName", v), { debounceMs: 300, fieldName: "heroName", onDirty: () => markFieldDirty("heroName") });

  return (
    <div
      className={`${isMobile ? "p-2" : "p-3"} border-b-2 bg-gradient-to-b from-card/80 to-card/60 flex flex-wrap justify-between items-center gap-2 relative z-10 font-mono ${isMobile ? "text-xs" : "text-sm"}`}
      style={{
        borderColor: `rgba(var(--identity-theme-rgb), 0.3)`,
      }}
    >
      <div className="flex items-center gap-2 min-w-fit">
        <span
          style={{ color: `var(--identity-theme-color, ${favoriteColor})` }}
        >
          <Tip
            content={
              <div className="max-w-xs text-xs">
                O codinome ou nome de herói do personagem.
              </div>
            }
            side="bottom"
            align="start"
          >
            <div className="inline-block cursor-help">
              <GlitchText
                glitchChance={0.12}
                glitchDuration={110}
                intervalMs={250}
                alternateChance={0.18}
                characterGlitchChance={0.35}
                className="inline decoration-dotted underline underline-offset-2 whitespace-nowrap"
              >
                $ identity::name=
              </GlitchText>
            </div>
          </Tip>
        </span>
      </div>
      <div className="flex items-center gap-1 flex-1 justify-end min-w-[120px]">
        <FormInput
          id="heroName"
          name="heroName"
          value={value}
          onChange={(e) => handleChange(e)}
          onBlur={handleBlur}
          className={`font-mono h-7 px-2 w-full ${isMobile ? "text-xs" : "text-xs"} text-right bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary`}
          placeholder="HERO_NAME"
          aria-label="Nome do herói"
          style={{
            color: glitchColor,
            caretColor: glitchColor,
          }}
        />
        <button
          onClick={onSave}
          className="hide-on-capture p-1 hover:bg-white/10 rounded transition-colors shrink-0"
          title="Salvar Card"
          type="button"
        >
          <Download
            className={`${isMobile ? "w-2.5 h-2.5" : "w-3 h-3"}`}
            style={{ color: glitchColor }}
          />
        </button>
      </div>
    </div>
  );
};
