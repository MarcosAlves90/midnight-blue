export interface DiceResult {
    rolls: number[];
    highest: number;
    total: number;
    notation: string;
}

export interface RollConfig {
    count: number;
    faces: number;
    bonus?: number;
    diceBonus?: number;
    notify?: boolean;
    color?: string;
}
