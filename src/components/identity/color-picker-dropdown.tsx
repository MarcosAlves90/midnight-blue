import React from "react"
import { Heart } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { PREDEFINED_COLORS } from "./constants"

interface ColorPickerDropdownProps {
  favoriteColor: string
  onColorChange: (color: string) => void
}

export const ColorPickerDropdown: React.FC<ColorPickerDropdownProps> = ({ favoriteColor, onColorChange }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1">
      <Heart className="w-3 h-3" aria-hidden="true" />
      <span>Cor Favorita</span>
    </label>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-10 h-10 rounded-full border-2 border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          style={{ backgroundColor: favoriteColor }}
          aria-label={`Cor favorita: ${favoriteColor}. Clique para mudar`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="grid grid-cols-4 gap-2 p-2" role="listbox" aria-label="Paleta de cores">
          {PREDEFINED_COLORS.map((color) => (
            <DropdownMenuItem key={color} asChild>
              <button
                className="w-8 h-8 rounded-full border-2 border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
                aria-label={`Selecionar cor ${color}`}
                role="option"
                aria-selected="false"
              />
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)
