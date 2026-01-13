import { useEffect } from "react";
import {
  hexToRgb,
  getOptimalCardBackground,
  getContrastColor,
  adjustBrightness,
} from "@/lib/colors";

/**
 * Hook para gerenciar as variáveis de CSS do tema de identidade do personagem.
 * Centraliza a lógica de cores para garantir consistência entre o Card e o ColorPicker.
 */
export function useIdentityTheme(color: string) {
  useEffect(() => {
    if (!color) return;
    updateThemeVariables(color);
  }, [color]);

  const updateThemeVariables = (newColor: string) => {
    const root = document.documentElement;
    const contrastText = getContrastColor(newColor);
    const accentColor = adjustBrightness(newColor, 20); // Um pouco mais brilhante para acentos

    root.style.setProperty("--identity-theme-color", newColor);
    root.style.setProperty("--identity-theme-rgb", hexToRgb(newColor));
    root.style.setProperty(
      "--identity-card-bg",
      getOptimalCardBackground(newColor),
    );
    root.style.setProperty("--identity-contrast-text", contrastText);
    root.style.setProperty("--identity-accent-color", accentColor);
  };

  return { updateThemeImmediately: updateThemeVariables };
}
