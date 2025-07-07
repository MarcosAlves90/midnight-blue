type ColorName = 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'gray'

interface ColorClasses {
    border: string
    bg: string
    focusBg: string
}

export const COLORS: Record<ColorName, ColorClasses> = {
    red: {
        border: '!border-red-500',
        bg: '!bg-red-500',
        focusBg: '!focus:bg-red-500'
    },
    yellow: {
        border: '!border-yellow-500',
        bg: '!bg-yellow-500',
        focusBg: '!focus:bg-yellow-500'
    },
    green: {
        border: '!border-green-500',
        bg: '!bg-green-500',
        focusBg: '!focus:bg-green-500'
    },
    blue: {
        border: '!border-blue-500',
        bg: '!bg-blue-500',
        focusBg: '!focus:bg-blue-500'
    },
    purple: {
        border: '!border-purple-500',
        bg: '!bg-purple-500',
        focusBg: '!focus:bg-purple-500'
    },
    gray: {
        border: '!border-gray-500',
        bg: '!bg-gray-500',
        focusBg: '!focus:bg-gray-500'
    }
} as const

export function getColorClasses(color: string): ColorClasses {
    return COLORS[color as ColorName] || COLORS.gray
}
