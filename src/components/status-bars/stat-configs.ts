import { Heart, Zap, AlertTriangle, Brain } from "lucide-react"
import { StatConfig } from "./types"

export const statConfigs: StatConfig[] = [
    { 
        key: 'vida', 
        label: 'Vida', 
        color: 'bg-red-500',
        icon: Heart,
        description: 'Pontos de vida do personagem',
        maxValue: 50
    },
    { 
        key: 'energia', 
        label: 'Energia', 
        color: 'bg-blue-500',
        icon: Zap,
        description: 'Energia física e mental disponível',
        maxValue: 50
    },
    { 
        key: 'estresse', 
        label: 'Estresse', 
        color: 'bg-orange-500',
        icon: AlertTriangle,
        description: 'Nível de estresse acumulado',
        maxValue: 50
    },
    { 
        key: 'sanidade', 
        label: 'Sanidade', 
        color: 'bg-purple-500',
        icon: Brain,
        description: 'Estabilidade mental do personagem',
        maxValue: 50
    },
]
