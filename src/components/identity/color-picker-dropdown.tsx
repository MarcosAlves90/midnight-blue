import React, { useState, useEffect, useRef, useTransition } from "react";
import { Heart, Pipette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FormInput } from "@/components/ui/form-input";
import { PREDEFINED_COLORS } from "./constants";
import { hexToRgb } from "@/lib/colors";

interface ColorPickerDropdownProps {
  favoriteColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPickerDropdown: React.FC<ColorPickerDropdownProps> = ({
  favoriteColor,
  onColorChange,
}) => {
  const [localColor, setLocalColor] = useState(favoriteColor);
  const [, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateCSSVariables = (color: string) => {
    document.documentElement.style.setProperty("--identity-theme-color", color);
    document.documentElement.style.setProperty(
      "--identity-theme-rgb",
      hexToRgb(color),
    );
  };

  useEffect(() => {
    setLocalColor(favoriteColor);
    updateCSSVariables(favoriteColor);
  }, [favoriteColor]);

  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
    updateCSSVariables(newColor);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      startTransition(() => {
        onColorChange(newColor);
      });
    }, 100);
  };

  const openEyeDropper = async () => {
    if (!window.EyeDropper) return;

    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      handleColorChange(result.sRGBHex);
    } catch {
      // User canceled the eye dropper
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1">
        <Heart className="w-3 h-3" aria-hidden="true" />
        <span>Cor Favorita</span>
      </label>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-10 h-10 rounded-full border-2 border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
              style={{ backgroundColor: localColor }}
              aria-label={`Cor favorita: ${localColor}. Clique para mudar`}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[190px]">
            <div className="space-y-2 p-2">
              <div role="listbox" aria-label="Paleta de cores predefinidas">
                <div className="grid grid-cols-6 gap-1.5" role="group">
                  {PREDEFINED_COLORS.map((color) => (
                    <DropdownMenuItem key={color} asChild>
                      <button
                        className="w-5 h-5 rounded-full border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                        aria-label={`Selecionar cor ${color}`}
                        role="option"
                        aria-selected={localColor === color}
                      />
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
              <div className="border-t border-border/30 pt-2">
                <div className="flex gap-1.5">
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={openEyeDropper}
                      className="h-7 w-7 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors"
                      title="Usar conta-gotas"
                    >
                      <Pipette className="w-3.5 h-3.5" />
                    </button>
                    {/* Fallback for browsers without EyeDropper API */}
                    <input
                      type="color"
                      value={localColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      style={{
                        display:
                          typeof window !== "undefined" &&
                          "EyeDropper" in window
                            ? "none"
                            : "block",
                      }}
                    />
                  </div>
                  <FormInput
                    type="text"
                    value={localColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="h-7 font-mono uppercase text-xs px-2"
                    placeholder="#000000"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

// Add type definition for EyeDropper API
declare global {
  interface Window {
    EyeDropper?: new () => {
      open: (options?: {
        signal?: AbortSignal;
      }) => Promise<{ sRGBHex: string }>;
    };
  }
}
