import { COLOR_CLASSES, DEFAULT_COLOR_CLASSES } from "./constants"
import type { ColorClasses } from "./types"

export function getColorClasses(color: string): ColorClasses {
    return COLOR_CLASSES[color as keyof typeof COLOR_CLASSES] || DEFAULT_COLOR_CLASSES
}
