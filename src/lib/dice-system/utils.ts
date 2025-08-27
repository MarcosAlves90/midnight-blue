/**
 * Utility functions for dice rolling and validation.
 */

/**
 * Validates dice roll parameters.
 * @param count - Number of dice to roll
 * @param faces - Number of faces on each die
 * @throws {Error} When count or faces are not positive integers
 */
export function validateDiceParams(count: number, faces: number): void {
    if (!Number.isInteger(count) || !Number.isInteger(faces) || count <= 0 || faces <= 0) {
        throw new Error('Invalid parameters: count and faces must be positive integers');
    }
}

/**
 * Generates a random number between 1 and the specified number of faces.
 * @param faces - Number of faces on the die
 * @returns Random integer between 1 and faces (inclusive)
 */
export function rollSingleDie(faces: number): number {
    return Math.floor(Math.random() * faces) + 1;
}

/**
 * Generates standard dice notation string (e.g., "3d6+2" or "2d20+1d").
 * @param count - Base number of dice
 * @param faces - Number of faces per die
 * @param bonus - Static bonus to add to result
 * @param diceBonus - Additional dice to roll
 * @returns Formatted dice notation string
 */
export function generateNotation(count: number, faces: number, bonus?: number, diceBonus?: number): string {
    const diceBonusText = diceBonus ? `+${diceBonus}d` : '';
    const bonusText = bonus && bonus !== 0 ? (bonus > 0 ? `+${bonus}` : `${bonus}`) : '';
    return `${count}d${faces}${diceBonusText}${bonusText}`;
}

/**
 * Calculates the selected value based on the strategy.
 * @param rolls - Array of roll results
 * @param strategy - Selection strategy
 * @returns The selected value
 */
export function calculateSelected(rolls: number[], strategy: 'highest' | 'lowest' | 'sum'): number {
    switch (strategy) {
        case 'highest':
            return Math.max(...rolls);
        case 'lowest':
            return Math.min(...rolls);
        case 'sum':
            return rolls.reduce((sum, roll) => sum + roll, 0);
        default:
            return Math.max(...rolls);
    }
}
