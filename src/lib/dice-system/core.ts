import type { DiceResult, RollConfig } from "./types";
import {
  validateDiceParams,
  rollSingleDie,
  generateNotation,
  calculateSelected,
} from "./utils";
import { showRollNotification } from "./notifications";

/**
 * Default configuration for dice rolls.
 */
const DEFAULT_CONFIG: Required<RollConfig> = {
  count: 2,
  faces: 20,
  bonus: 0,
  diceBonus: 0,
  modifiers: [],
  notify: false,
  color: "",
  strategy: "lowest",
};

/**
 * Rolls dice with the specified configuration.
 * @param config - Dice roll configuration object
 * @returns Dice roll result
 * @example
 * // Roll 2d20, take lowest (default behavior)
 * const result = rollDice();
 *
 * @example
 * // Roll 3d6 with +2 bonus
 * const result = rollDice({ count: 3, faces: 6, bonus: 2 });
 */
export function rollDice(config: Partial<RollConfig> = {}): DiceResult {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  // Validate dice parameters
  validateDiceParams(fullConfig.count, fullConfig.faces);

  // Calculate total number of dice to roll (base + bonus dice)
  const totalDiceCount = fullConfig.count + fullConfig.diceBonus;

  // Execute dice rolls
  const rolls = Array.from({ length: totalDiceCount }, () =>
    rollSingleDie(fullConfig.faces),
  );

  // Calculate selected value based on strategy
  const selected = calculateSelected(rolls, fullConfig.strategy);

  // Calculate final total
  const modifiersSum = fullConfig.modifiers.reduce((sum, mod) => sum + mod, 0);
  const total = selected + fullConfig.bonus + modifiersSum;

  // Generate notation
  const notation = generateNotation(
    fullConfig.count,
    fullConfig.faces,
    fullConfig.bonus,
    fullConfig.diceBonus,
  );

  const result: DiceResult = {
    rolls,
    selected,
    total,
    notation,
    modifiers: fullConfig.modifiers,
  };

  // Display notification if requested
  if (fullConfig.notify) {
    showRollNotification(result, fullConfig.color);
  }

  return result;
}

/**
 * Asynchronous version of rollDice with optional delay.
 * @param config - Dice roll configuration object
 * @param delayMs - Optional delay in milliseconds before rolling
 * @returns Promise resolving to dice roll result
 * @example
 * // Roll with 1 second delay
 * const result = await rollDiceAsync({ count: 3, faces: 6 }, 1000);
 */
export async function rollDiceAsync(
  config: Partial<RollConfig> = {},
  delayMs = 0,
): Promise<DiceResult> {
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return rollDice(config);
}

/**
 * Utility functions for dice roll result manipulation and analysis.
 */
export const DiceUtils = {
  /**
   * Calculates the average total from multiple dice results.
   * @param results - Array of dice roll results
   * @returns Average total value, or 0 if no results provided
   */
  average: (results: DiceResult[]): number =>
    results.length > 0
      ? results.reduce((sum, result) => sum + result.total, 0) / results.length
      : 0,

  /**
   * Finds the result with the highest total.
   * @param results - Array of dice roll results
   * @returns The dice result with the highest total
   * @throws {Error} If results array is empty
   */
  best: (results: DiceResult[]): DiceResult => {
    if (results.length === 0)
      throw new Error("Cannot find best result from empty array");
    return results.reduce((best, current) =>
      current.total > best.total ? current : best,
    );
  },

  /**
   * Finds the result with the lowest total.
   * @param results - Array of dice roll results
   * @returns The dice result with the lowest total
   * @throws {Error} If results array is empty
   */
  worst: (results: DiceResult[]): DiceResult => {
    if (results.length === 0)
      throw new Error("Cannot find worst result from empty array");
    return results.reduce((worst, current) =>
      current.total < worst.total ? current : worst,
    );
  },

  /**
   * Formats a dice result for display.
   * @param result - The dice roll result to format
   * @returns Formatted string showing notation, individual rolls, and total
   * @example "3d6+2: [4, 6, 2] → 10"
   */
  format: (result: DiceResult): string =>
    `${result.notation}: [${result.rolls.join(", ")}] → ${result.total}`,
};
