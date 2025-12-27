import { toast } from "react-toastify";
import React from "react";
import { DiceIcon } from "../../components/ui/icons/dice-icon";
import { getColorClasses } from "../colors";
import type { DiceResult } from "./types";

/**
 * Displays a toast notification with dice roll results.
 * @param result - The dice roll result to display
 * @param color - Optional color for the progress bar background
 */
export function showRollNotification(result: DiceResult, color?: string): void {
  const colorClasses = color ? getColorClasses(color) : null;
  const progressClassName = colorClasses ? colorClasses.bg : "";

  const modifiersPart =
    result.modifiers.length > 0 ? ` + ${result.modifiers.join(" + ")}` : "";
  const message = `[${result.selected}]${modifiersPart} = ${result.total}`;

  toast.info(message, {
    position: "bottom-right",
    autoClose: 15000,
    icon: () => React.createElement(DiceIcon, { className: "w-5 h-5" }),
    className: "notification-toast",
    progressClassName,
  });
}
