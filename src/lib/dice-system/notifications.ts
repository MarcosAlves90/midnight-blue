import { toast } from 'react-toastify';
import React from 'react';
import { DiceIcon } from '../../components/dice-icon';
import { getColorClasses } from '../colors';
import type { DiceResult } from './types';

/**
 * Formats dice rolls for notification display, highlighting the selected value.
 * @param rolls - Array of individual dice roll results
 * @param selected - The selected roll value to highlight
 * @returns Formatted string with selected value unmarked and others marked with 'd'
 */
function formatRollsForNotification(rolls: number[], selected: number): string {
    let selectedMarked = false;
    return rolls.map(roll => {
        if (roll === selected && !selectedMarked) {
            selectedMarked = true;
            return roll.toString();
        }
        return `${roll}d`;
    }).join(', ');
}

/**
 * Displays a toast notification with dice roll results.
 * @param result - The dice roll result to display
 * @param color - Optional color for the progress bar background
 */
export function showRollNotification(result: DiceResult, color?: string): void {
    const formattedRolls = formatRollsForNotification(result.rolls, result.selected);
    const colorClasses = color ? getColorClasses(color) : null;
    const progressClassName = colorClasses ? colorClasses.bg : '';

    const modifiersPart = result.modifiers.length > 0 ? ` + ${result.modifiers.join(' + ')}` : '';
    const message = `[${result.selected}]${modifiersPart} = ${result.total}`;

    toast.info(message, {
        position: 'bottom-right',
        autoClose: 15000,
        icon: () => React.createElement(DiceIcon, { className: 'w-5 h-5' }),
        className: 'notification-toast',
        progressClassName,
    });
}
