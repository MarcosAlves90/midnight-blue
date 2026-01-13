import React, { useCallback, useMemo } from "react";
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

/**
 * IdentityCardContent Component
 * Memoized to prevent re-renders when other parts of the card change.
 */
export const IdentityCardContent: React.FC<IdentityCardContentProps> =
  React.memo(({ favoriteColor }) => {
    const isMobile = useIsMobile();

    const glitchConfig = useMemo(
      () => ({
        baseColor: favoriteColor,
        glitchColor: "#ef4444",
        glitchChance: 0.12,
        glitchDuration: 150,
        intervalMs: 250,
      }),
      [favoriteColor],
    );

    const glitchColor = useGlitchColor(glitchConfig);

    const { markFieldDirty, updateIdentity } = useIdentityActions();
    const ext = useIdentityField("name");

    const onUpdateName = useCallback(
      (v: string) => {
        updateIdentity("name", v);
      },
      [updateIdentity],
    );

    const onDirtyName = useCallback(() => {
      markFieldDirty("name");
    }, [markFieldDirty]);

    const fieldConfig = useMemo(
      () => ({
        debounceMs: 300,
        fieldName: "name",
        onDirty: onDirtyName,
      }),
      [onDirtyName],
    );

    const { value, handleChange, handleBlur } = useFieldLocalState(
      ext,
      onUpdateName,
      fieldConfig,
    );

    const containerStyle = useMemo(
      () => ({
        borderLeftColor: `${glitchColor}88`,
      }),
      [glitchColor],
    );

    const identificationStyle = useMemo(
      () => ({
        borderColor: `${glitchColor}66`,
      }),
      [glitchColor],
    );

    const subjectLabelStyle = useMemo(
      () => ({
        color: `var(--identity-accent-color, ${glitchColor})`,
      }),
      [glitchColor],
    );

    const civilNameLabelStyle = useMemo(
      () => ({
        color: `var(--identity-theme-color, ${favoriteColor})`,
      }),
      [favoriteColor],
    );

    const inputStyle = useMemo(
      () => ({
        color: `var(--identity-accent-color, ${glitchColor})`,
        caretColor: glitchColor,
        borderLeftColor: `var(--identity-theme-color, ${favoriteColor})`,
      }),
      [glitchColor, favoriteColor],
    );

    const footerStyle = useMemo(
      () => ({
        borderColor: `${glitchColor}33`,
        color: `${glitchColor}99`,
      }),
      [glitchColor],
    );

    return (
      <div
        className={`${isMobile ? "p-2" : "p-3"} flex-1 bg-gradient-to-b from-transparent to-black/60 ${isMobile ? "min-h-[60px]" : "min-h-[90px]"} flex flex-col gap-3 font-mono text-[10px] transition-colors duration-500`}
        style={containerStyle}
      >
        <div
          className="space-y-1.5 border-l-2 pl-2.5"
          style={identificationStyle}
        >
          <div className="flex items-center justify-between opacity-80">
            <div
              style={subjectLabelStyle}
              className="text-[9px] tracking-widest uppercase font-bold"
            >
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
                style={civilNameLabelStyle}
                className="cursor-help text-[9px] uppercase tracking-tighter font-bold opacity-90 underline decoration-dotted underline-offset-2"
              >
                &gt; CIVIL_NAME
              </span>
            </Tip>
            <FormInput
              id="civilName"
              name="civilName"
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              className="font-mono text-xs h-8 px-2 bg-black/60 border-white/5 focus-visible:ring-1 focus-visible:ring-primary w-full rounded-none border-l-2 transition-all"
              placeholder="[ENCRYPTED]"
              aria-label="Nome civil verdadeiro"
              style={inputStyle}
            />
          </div>
        </div>

        <div
          className={`${isMobile ? "mt-auto pt-1.5" : "mt-auto pt-2"} border-t flex justify-between items-center font-mono`}
          style={footerStyle}
        >
          <p
            className={`${isMobile ? "text-[7px]" : "text-[8px]"} uppercase tracking-widest font-bold`}
          >
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
  });

IdentityCardContent.displayName = "IdentityCardContent";
