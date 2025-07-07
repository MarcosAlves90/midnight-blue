import { toast } from 'react-toastify';
import type { DiceResult, RollConfig } from './types';
import React from 'react';
import { DiceIcon } from '../../components/dice-icon';
import { getColorClasses } from '../colors';

/**
 * Validates dice roll parameters
 * @param count - Number of dice to roll
 * @param faces - Number of faces on each die
 * @throws {Error} When count or faces are not positive integers
 */
function validateDiceParams(count: number, faces: number): void {
    if (!Number.isInteger(count) || !Number.isInteger(faces) || count <= 0 || faces <= 0) {
        throw new Error('Invalid parameters: count and faces must be positive integers');
    }
}

/**
 * Generates a random number between 1 and the specified number of faces
 * @param faces - Number of faces on the die
 * @returns Random integer between 1 and faces (inclusive)
 */
function rollSingleDie(faces: number): number {
    return Math.floor(Math.random() * faces) + 1;
}

/**
 * Formats dice rolls for notification display, highlighting the highest value
 * @param rolls - Array of individual dice roll results
 * @param highest - The highest roll value to highlight
 * @returns Formatted string with highest value unmarked and others marked with 'd'
 */
function formatRollsForNotification(rolls: number[], highest: number): string {
    let highestMarked = false;
    return rolls.map(roll => {
        if (roll === highest && !highestMarked) {
            highestMarked = true;
            return roll.toString();
        }
        return `${roll}d`;
    }).join(', ');
}

/**
 * Displays a toast notification with dice roll results
 * @param result - The dice roll result to display
 * @param color - Optional color for the progress bar background
 */
function showRollNotification(result: DiceResult, color?: string): void {
    const formattedRolls = formatRollsForNotification(result.rolls, result.highest);
    const colorClasses = color ? getColorClasses(color) : null;
    const progressClassName = colorClasses ? colorClasses.bg : "";

    toast.info(`[${formattedRolls}] = ${result.total}`, {
        position: 'bottom-right',
        autoClose: 15000,
        icon: () => React.createElement(DiceIcon, { className: 'w-5 h-5' }),
        className: "notification-toast",
        progressClassName,
    });
}

/**
 * Generates standard dice notation string (e.g., "3d6+2" or "2d20+1d")
 * @param count - Base number of dice
 * @param faces - Number of faces per die
 * @param bonus - Static bonus to add to result
 * @param diceBonus - Additional dice to roll
 * @returns Formatted dice notation string
 */
function generateNotation(count: number, faces: number, bonus?: number, diceBonus?: number): string {
    const diceBonusText = diceBonus ? `+${diceBonus}d` : '';
    const bonusText = bonus ? (bonus > 0 ? `+${bonus}` : `${bonus}`) : '';
    return `${count}d${faces}${diceBonusText}${bonusText}`;
}

/**
 * Rolls dice with the specified configuration
 * 
 * @overload
 * @param config - Dice roll configuration object
 * @returns Dice roll result
 * 
 * @overload  
 * @param count - Number of dice to roll
 * @param faces - Number of faces on each die
 * @param bonus - Static bonus to add to final result
 * @param diceBonus - Additional dice to roll
 * @param shouldNotify - Whether to show toast notification
 * @param color - Optional color for the progress bar background
 * @returns Dice roll result
 * 
 * @example
 * // Roll 2d20, take lowest (default behavior)
 * const result = rollDice();
 * 
 * @example
 * // Roll 3d6 with +2 bonus
 * const result = rollDice(3, 6, 2);
 * 
 * @example
 * // Using config object
 * const result = rollDice({ count: 2, faces: 10, bonus: 1, notify: true });
 */
export function rollDice(config: RollConfig): DiceResult;
export function rollDice(
    count?: number, 
    faces?: number, 
    bonus?: number, 
    diceBonus?: number, 
    shouldNotify?: boolean,
    color?: string
): DiceResult;
export function rollDice(
    configOrCount?: RollConfig | number,
    faces?: number,
    bonus = 0,
    diceBonus = 0,
    shouldNotify = false,
    color?: string
): DiceResult {
    // Default behavior: roll 2d20, take the lower value
    if (configOrCount === undefined) {
        const defaultRolls = [rollSingleDie(20), rollSingleDie(20)];
        const lowest = Math.min(...defaultRolls);
        const total = lowest + bonus;
        const notation = "2d20 (lowest)";
        
        const result: DiceResult = { 
            rolls: defaultRolls, 
            highest: lowest, // Using 'highest' property to store the selected (lowest) value
            total, 
            notation 
        };
        
        if (shouldNotify) {
            showRollNotification(result, color);
        }
        
        return result;
    }
    
    // Parse configuration from parameters
    const config = typeof configOrCount === 'object' 
        ? configOrCount 
        : { 
            count: configOrCount, 
            faces: faces!, 
            bonus, 
            diceBonus,
            notify: shouldNotify,
            color
        };
    
    // Validate dice parameters
    validateDiceParams(config.count, config.faces);
    
    // Calculate total number of dice to roll (base + bonus dice)
    const totalDiceCount = config.count + (config.diceBonus || 0);
    
    // Execute dice rolls
    const rolls = Array.from({ length: totalDiceCount }, () => rollSingleDie(config.faces));
    
    // Calculate final results
    const highest = Math.max(...rolls);
    const total = highest + (config.bonus || 0);
    const notation = generateNotation(config.count, config.faces, config.bonus, config.diceBonus);
    
    const result: DiceResult = { rolls, highest, total, notation };
    
    // Display notification if requested
    if (config.notify) {
        showRollNotification(result, config.color);
    }
    
    return result;
}

/**
 * Creates a delay promise for async operations
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the specified delay
 */
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Asynchronous version of rollDice with optional delay
 * 
 * @overload
 * @param config - Dice roll configuration object
 * @param delayMs - Optional delay in milliseconds before rolling
 * @returns Promise resolving to dice roll result
 * 
 * @overload
 * @param count - Number of dice to roll
 * @param faces - Number of faces on each die
 * @param bonus - Static bonus to add to final result
 * @param diceBonus - Additional dice to roll
 * @param delayMs - Optional delay in milliseconds before rolling
 * @param shouldNotify - Whether to show toast notification
 * @param color - Optional color for the progress bar background
 * @returns Promise resolving to dice roll result
 * 
 * @example
 * // Roll with 1 second delay
 * const result = await rollDiceAsync(3, 6, 0, 0, 1000, true);
 */
export async function rollDiceAsync(
    config: RollConfig, 
    delayMs?: number
): Promise<DiceResult>;
export async function rollDiceAsync(
    count?: number, 
    faces?: number, 
    bonus?: number, 
    diceBonus?: number,
    delayMs?: number, 
    shouldNotify?: boolean,
    color?: string
): Promise<DiceResult>;
export async function rollDiceAsync(
    configOrCount?: RollConfig | number,
    facesOrDelay?: number,
    bonus = 0,
    diceBonus = 0,
    delayMs = 0,
    shouldNotify = false,
    color?: string
): Promise<DiceResult> {
    // Handle configuration object overload
    if (typeof configOrCount === 'object') {
        if (facesOrDelay) await delay(facesOrDelay);
        return rollDice(configOrCount);
    }
    
    // Handle individual parameters overload
    if (delayMs > 0) await delay(delayMs);
    return rollDice(configOrCount, facesOrDelay!, bonus, diceBonus, shouldNotify, color);
}

/**
 * Utility functions for dice roll result manipulation and analysis
 */
export const DiceUtils = {
    /**
     * Calculates the average total from multiple dice results
     * @param results - Array of dice roll results
     * @returns Average total value, or 0 if no results provided
     */
    average: (results: DiceResult[]): number => 
        results.length > 0 ? results.reduce((sum, result) => sum + result.total, 0) / results.length : 0,
    
    /**
     * Finds the result with the highest total
     * @param results - Array of dice roll results
     * @returns The dice result with the highest total
     * @throws {Error} If results array is empty
     */
    best: (results: DiceResult[]): DiceResult => {
        if (results.length === 0) throw new Error('Cannot find best result from empty array');
        return results.reduce((best, current) => current.total > best.total ? current : best);
    },
    
    /**
     * Finds the result with the lowest total
     * @param results - Array of dice roll results
     * @returns The dice result with the lowest total
     * @throws {Error} If results array is empty
     */
    worst: (results: DiceResult[]): DiceResult => {
        if (results.length === 0) throw new Error('Cannot find worst result from empty array');
        return results.reduce((worst, current) => current.total < worst.total ? current : worst);
    },
    
    /**
     * Formats a dice result for display
     * @param result - The dice roll result to format
     * @returns Formatted string showing notation, individual rolls, and total
     * @example "3d6+2: [4, 6, 2] → 10"
     */
    format: (result: DiceResult): string => 
        `${result.notation}: [${result.rolls.join(', ')}] → ${result.total}`,
};
