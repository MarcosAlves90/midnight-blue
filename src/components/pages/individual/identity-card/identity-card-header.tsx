import React from "react";
import { FormInput } from "@/components/ui/form-input";
import { Tip } from "@/components/ui/tip";
import { Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGlitchColor } from "@/hooks/use-glitch-color";
import GlitchText from "@/components/ui/custom/glitch-text";
import { useFieldLocalState } from "@/hooks/use-field-local-state";

interface IdentityCardHeaderProps {
  heroName: string;
  onChange: (value: string) => void;
  favoriteColor: string;
  onSave: () => void;
}

export const IdentityCardHeader: React.FC<IdentityCardHeaderProps> = ({
  heroName,
  onChange: parentOnChange,
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

  const { value, handleChange, handleBlur } = useFieldLocalState(heroName, parentOnChange, { debounceMs: 300 });

  return (
    <div
      className={`${isMobile ? "p-2" : "p-3"} border-b-2 bg-gradient-to-b from-card/80 to-card/60 flex justify-between items-center relative z-10 font-mono ${isMobile ? "text-xs" : "text-sm"}`}
      style={{
        borderColor: `rgba(var(--identity-theme-rgb), 0.3)`,
      }}
    >
      <div className="flex items-center gap-2 flex-1">
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
                className="inline decoration-dotted underline underline-offset-2"
              >
                $ identity::name=
              </GlitchText>
            </div>
          </Tip>
        </span>
      </div>
      <div className="flex items-center gap-1">
        <FormInput
          value={value}
          onChange={(e) => handleChange(e)}
          onBlur={handleBlur}
          className={`font-mono h-7 px-2 w-auto ${isMobile ? "max-w-[120px] text-xs" : "max-w-[150px] text-xs"} text-right bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary`}
          placeholder="HERO_NAME"
          aria-label="Nome do herói"
          style={{
            color: glitchColor,
            caretColor: glitchColor,
          }}
        />
        <button
          onClick={onSave}
          className="hide-on-capture p-1 hover:bg-white/10 rounded transition-colors"
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
