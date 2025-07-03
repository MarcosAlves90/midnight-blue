export const STAT_CONFIG = {
    MAX_VALUE: 100,
    MIN_VALUE: 0,
    SMALL_INCREMENT: 1,
    LARGE_INCREMENT: 5,
    REVIVAL_DOTS: [1, 2, 3] as const,
    INPUT_MAX_VALUE: 9999,
    CRITICAL_THRESHOLD: 0.25,
    WARNING_THRESHOLD: 0.5
} as const

export const STYLE_CONSTANTS = {
    COMPACT_HEIGHT: 'h-6',
    NORMAL_HEIGHT: 'h-8',
    COMPACT_SPACING: 'space-y-1',
    NORMAL_SPACING: 'space-y-2',
    MIN_BAR_WIDTH: '2px',
    TRANSITION_DURATION: 'duration-300'
} as const

export const getStatusClass = (value: number, maxValue: number = 100): string => {
    const criticalThreshold = maxValue * STAT_CONFIG.CRITICAL_THRESHOLD
    const warningThreshold = maxValue * STAT_CONFIG.WARNING_THRESHOLD
    
    if (value <= criticalThreshold) return 'opacity-40 animate-pulse'
    if (value < warningThreshold) return 'opacity-70'
    return 'opacity-100'
}

export const clampValue = (value: number, min = STAT_CONFIG.MIN_VALUE, max = STAT_CONFIG.INPUT_MAX_VALUE): number => {
    return Math.max(min, Math.min(max, value))
}