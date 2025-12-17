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
