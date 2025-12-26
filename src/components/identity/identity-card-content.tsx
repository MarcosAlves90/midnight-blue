import React from "react";
import { FormInput } from "@/components/ui/form-input";
import { Tip } from "@/components/ui/tip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGlitchColor } from "@/hooks/use-glitch-color";
import GlitchText from "@/components/glitch-text";

interface IdentityCardContentProps {
  alternateIdentity: string;
  onChange: (value: string) => void;
  favoriteColor: string;
}

export const IdentityCardContent: React.FC<IdentityCardContentProps> = ({
  alternateIdentity,
  onChange,
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

  return (
    <div
      className={`${isMobile ? "p-3" : "p-4"} flex-1 bg-gradient-to-b from-black/40 to-black/60 ${isMobile ? "min-h-[80px]" : "min-h-[120px]"} flex flex-col gap-3 font-mono text-xs`}
      style={{
        borderLeftColor: `${glitchColor}4d`,
      }}
    >
      <div
        className="space-y-1.5 border-l-2 pl-2"
        style={{ borderColor: `${glitchColor}4d` }}
      >
        <div style={{ color: `${glitchColor}99` }}>
          <GlitchText
            glitchChance={0.15}
            glitchDuration={120}
            intervalMs={200}
            alternateChance={0.2}
            characterGlitchChance={0.4}
            className="inline"
          >
            root@identity:~$
          </GlitchText>
        </div>
        <div className="flex items-baseline gap-1">
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
              style={{ color: `${glitchColor}80` }}
              className="cursor-help decoration-dotted underline underline-offset-2"
            >
              civil_id
            </span>
          </Tip>
          <span style={{ color: glitchColor }}>=</span>
          <FormInput
            value={alternateIdentity}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono text-xs h-7 px-2 bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary flex-1"
            placeholder="[ENCRYPTED]"
            aria-label="Nome civil verdadeiro"
            style={{
              color: glitchColor,
              caretColor: glitchColor,
            }}
          />
        </div>
      </div>

      <div
        className={`${isMobile ? "mt-auto pt-2" : "mt-auto pt-3"} border-t text-center font-mono`}
        style={{
          borderColor: `${glitchColor}33`,
          color: `${glitchColor}66`,
        }}
      >
        <p className={`${isMobile ? "text-[8px]" : "text-[9px]"}`}>
          <GlitchText
            glitchChance={0.1}
            glitchDuration={100}
            intervalMs={300}
            alternateChance={0.15}
            characterGlitchChance={0.3}
            className="inline"
          >
            &gt; midnight_blue.exe --running
          </GlitchText>
        </p>
      </div>
    </div>
  );
};
