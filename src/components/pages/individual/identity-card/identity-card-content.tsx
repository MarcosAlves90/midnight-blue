import React from "react";
import { FormInput } from "@/components/ui/form-input";
import { Tip } from "@/components/ui/tip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGlitchColor } from "@/hooks/use-glitch-color";
import GlitchText from "@/components/ui/custom/glitch-text";
import { useFieldLocalState } from "@/hooks/use-field-local-state";
import { useIdentityField } from "@/hooks/use-identity-field";
import { useIdentityActions } from "@/contexts/IdentityContext";

interface IdentityCardContentProps {
  favoriteColor: string;
}

export const IdentityCardContent: React.FC<IdentityCardContentProps> = ({
  favoriteColor,
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
  const ext = useIdentityField("name");
  const { value, handleChange, handleBlur } = useFieldLocalState(ext, (v: string) => updateIdentity("name", v), { debounceMs: 300, fieldName: "name", onDirty: () => markFieldDirty("name") });

  return (
    <div
      className={`${isMobile ? "p-2" : "p-3"} flex-1 bg-gradient-to-b from-transparent to-black/60 ${isMobile ? "min-h-[60px]" : "min-h-[90px]"} flex flex-col gap-3 font-mono text-[10px] transition-colors duration-500`}
      style={{
        borderLeftColor: `${glitchColor}88`,
      }}
    >
      <div
        className="space-y-1.5 border-l-2 pl-2.5"
        style={{ borderColor: `${glitchColor}66` }}
      >
        <div className="flex items-center justify-between opacity-80">
          <div style={{ color: `var(--identity-accent-color, ${glitchColor})` }} className="text-[9px] tracking-widest uppercase font-bold">
            <GlitchText
              glitchChance={0.15}
              glitchDuration={120}
              intervalMs={200}
              alternateChance={0.2}
              characterGlitchChance={0.4}
              className="inline"
            >
              Subject_Identification
            </GlitchText>
          </div>
          <div className="text-[7px] text-white/40">SECURE_LINK</div>
        </div>
        
        <div className="flex flex-col gap-0.5">
          <Tip
            content={
              <div className="max-w-xs text-xs">
                O nome real do personagem (identidade secreta ou pública).
              </div>
            }
            side="top"
            align="start"
          >
            <span
              style={{ color: `var(--identity-theme-color, ${favoriteColor})` }}
              className="cursor-help text-[9px] uppercase tracking-tighter font-bold opacity-90 underline decoration-dotted underline-offset-2"
            >
              &gt; CIVIL_NAME
            </span>
          </Tip>
          <FormInput
            id="civilName"
            name="civilName"
            value={value}
            onChange={(e) => handleChange(e)}
            onBlur={handleBlur}
            className="font-mono text-xs h-8 px-2 bg-black/60 border-white/5 focus-visible:ring-1 focus-visible:ring-primary w-full rounded-none border-l-2 transition-all"
            placeholder="[ENCRYPTED]"
            aria-label="Nome civil verdadeiro"
            style={{
              color: `var(--identity-accent-color, ${glitchColor})`,
              caretColor: glitchColor,
              borderLeftColor: `var(--identity-theme-color, ${favoriteColor})`,
            }}
          />
        </div>
      </div>

      <div
        className={`${isMobile ? "mt-auto pt-1.5" : "mt-auto pt-2"} border-t flex justify-between items-center font-mono`}
        style={{
          borderColor: `${glitchColor}33`,
          color: `${glitchColor}99`,
        }}
      >
        <p className={`${isMobile ? "text-[7px]" : "text-[8px]"} uppercase tracking-widest font-bold`}>
          <GlitchText
            glitchChance={0.1}
            glitchDuration={100}
            intervalMs={300}
            alternateChance={0.15}
            characterGlitchChance={0.3}
            className="inline"
          >
            Status: Active
          </GlitchText>
        </p>
        <div className="flex gap-0.5">
          <div className="w-0.5 h-2 bg-current opacity-30" />
          <div className="w-0.5 h-2 bg-current opacity-60" />
          <div className="w-0.5 h-2 bg-current opacity-100" />
        </div>
      </div>
    </div>
  );
};
