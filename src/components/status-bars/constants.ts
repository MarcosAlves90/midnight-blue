export const STAT_CONFIG = {
    MAX_VALUE: 100,
    MIN_VALUE: 0,
    SMALL_INCREMENT: 1,
    LARGE_INCREMENT: 5,
    REVIVAL_DOTS: [1, 2, 3] as const
} as const

export const getStatusClass = (value: number, maxValue: number = 100) => {
    const criticalThreshold = maxValue * 0.25
    const warningThreshold = maxValue * 0.5
    
    if (value <= criticalThreshold) return 'opacity-40 animate-pulse'
    if (value < warningThreshold) return 'opacity-70'
    return 'opacity-100'
}