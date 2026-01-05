type ColorName =
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "gray"
  | "pink"
  | "cyan"
  | "orange"
  | "lime"
  | "amber"
  | "maroon"
  | "indigo";

interface ColorClasses {
  border: string;
  bg: string;
  focusBg: string;
}

export const COLORS: Record<ColorName, ColorClasses> = {
  red: {
    border: "!border-red-500",
    bg: "!bg-red-500",
    focusBg: "!focus:bg-red-500",
  },
  yellow: {
    border: "!border-yellow-500",
    bg: "!bg-yellow-500",
    focusBg: "!focus:bg-yellow-500",
  },
  green: {
    border: "!border-green-500",
    bg: "!bg-green-500",
    focusBg: "!focus:bg-green-500",
  },
  blue: {
    border: "!border-blue-500",
    bg: "!bg-blue-500",
    focusBg: "!focus:bg-blue-500",
  },
  purple: {
    border: "!border-purple-500",
    bg: "!bg-purple-500",
    focusBg: "!focus:bg-purple-500",
  },
  gray: {
    border: "!border-gray-500",
    bg: "!bg-gray-500",
    focusBg: "!focus:bg-gray-500",
  },
  pink: {
    border: "!border-pink-500",
    bg: "!bg-pink-500",
    focusBg: "!focus:bg-pink-500",
  },
  cyan: {
    border: "!border-cyan-500",
    bg: "!bg-cyan-500",
    focusBg: "!focus:bg-cyan-500",
  },
  orange: {
    border: "!border-orange-500",
    bg: "!bg-orange-500",
    focusBg: "!focus:bg-orange-500",
  },
  lime: {
    border: "!border-lime-500",
    bg: "!bg-lime-500",
    focusBg: "!focus:bg-lime-500",
  },
  amber: {
    border: "!border-amber-500",
    bg: "!bg-amber-500",
    focusBg: "!focus:bg-amber-500",
  },
  maroon: {
    border: "!border-red-900",
    bg: "!bg-red-900",
    focusBg: "!focus:bg-red-900",
  },
  indigo: {
    border: "!border-indigo-500",
    bg: "!bg-indigo-500",
    focusBg: "!focus:bg-indigo-500",
  },
} as const;

export function getColorClasses(color: string): ColorClasses {
  return COLORS[color as ColorName] || COLORS.gray;
}

export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "0, 0, 0";
};

/**
 * Calcula a luminância relativa de uma cor hex.
 * @returns Valor entre 0 (preto) e 1 (branco)
 */
export const getLuminance = (hex: string): number => {
  const rgbStr = hexToRgb(hex);
  const rgb = rgbStr.split(", ").map(Number);
  const [r, g, b] = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Retorna uma cor de contraste (preto ou branco) baseada na luminância da cor fornecida.
 */
export const getContrastColor = (hex: string): string => {
  return getLuminance(hex) > 0.45 ? "#000000" : "#ffffff";
};

/**
 * Ajusta o brilho de uma cor (positivo para clarear, negativo para escurecer).
 */
export const adjustBrightness = (hex: string, percent: number): string => {
  const rgbStr = hexToRgb(hex);
  const rgb = rgbStr.split(", ").map(Number);
  const adjusted = rgb.map((v) => {
    const val = Math.round(v + (v * percent) / 100);
    return Math.min(255, Math.max(0, val));
  });
  return `#${adjusted.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

/**
 * Gera uma cor de fundo apropriada baseada na cor favorita para garantir contraste.
 */
export const getOptimalCardBackground = (hex: string): string => {
  const luminance = getLuminance(hex);
  const rgbStr = hexToRgb(hex);
  const rgb = rgbStr.split(", ").map(Number);

  // Se a cor for muito escura (ex: preto), precisamos de um fundo significativamente mais claro
  if (luminance < 0.03) {
    return "rgba(40, 40, 45, 0.95)";
  }

  // Se a cor for muito clara, usamos um fundo bem escuro
  if (luminance > 0.7) {
    return "rgba(10, 10, 12, 0.98)";
  }

  // Para cores médias/vibrantes, usamos um fundo escuro matizado
  // Reduzimos a saturação e o brilho da cor original para o fundo
  return `rgba(${rgb[0] * 0.1}, ${rgb[1] * 0.1}, ${rgb[2] * 0.12}, 0.96)`;
};
