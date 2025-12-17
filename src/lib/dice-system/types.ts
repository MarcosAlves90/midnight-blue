/**
 * Represents the result of a dice roll operation.
 */
export interface DiceResult {
  /** Array of individual dice roll values */
  rolls: number[];
  /** The selected value (e.g., highest, lowest, or sum) */
  selected: number;
  /** The total result after applying bonuses */
  total: number;
  /** Dice notation string (e.g., "3d6+2") */
  notation: string;
  /** Array of modifiers added to the roll */
  modifiers: number[];
}

/**
 * Configuration object for dice rolling.
 */
export interface RollConfig {
  /** Number of dice to roll */
  count: number;
  /** Number of faces on each die */
  faces: number;
  /** Static bonus to add to the result */
  bonus?: number;
  /** Additional dice to roll */
  diceBonus?: number;
  /** Array of modifiers to add to the result */
  modifiers?: number[];
  /** Whether to show a notification */
  notify?: boolean;
  /** Optional color for notification styling */
  color?: string;
  /** Strategy for selecting the result from rolls */
  strategy?: "highest" | "lowest" | "sum";
}
