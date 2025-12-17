'use client'

import { memo } from 'react'
import { Effect } from './types'
import { Tip } from '@/components/ui/tip'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const TipContent = memo(({ content }: { content: string }) => (
  <div className="max-w-xs text-xs">{content}</div>
))
TipContent.displayName = 'TipContent'

const EffectCardItem = memo(({ 
  effect, 
  isSelected, 
  onToggle 
}: { 
  effect: Effect
  isSelected: boolean
  onToggle: () => void
}) => (
  <button
    onClick={onToggle}
    className={`p-3 text-left rounded-lg border transition-all group relative overflow-hidden ${
      isSelected
        ? 'border-purple-500 bg-purple-500/10'
        : 'border-border/50 hover:border-purple-500/30 hover:bg-muted/30'
    }`}
  >
    <div className="flex items-center justify-between mb-1">
      <Tip content={<TipContent content={effect.description} />} side="right">
        <span className="font-medium text-foreground group-hover:text-purple-400 transition-colors cursor-help underline decoration-dotted underline-offset-2">
          {effect.name}
        </span>
      </Tip>
      <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
        {effect.baseCost} PP/grad
      </span>
    </div>
  </button>
))
EffectCardItem.displayName = 'EffectCardItem'

interface PowerBuilderStepEffectsProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  filteredEffects: Effect[]
  selectedEffects: Effect[]
  onToggleEffect: (effect: Effect) => void
}

export function PowerBuilderStepEffects({
  searchTerm,
  onSearchChange,
  filteredEffects,
  selectedEffects,
  onToggleEffect
}: PowerBuilderStepEffectsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Selecione os Efeitos</h3>
          <p className="text-sm text-muted-foreground">Escolha um ou mais efeitos base para seu poder.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar efeitos..." 
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-8 bg-background/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredEffects.map(effect => (
          <EffectCardItem
            key={effect.id}
            effect={effect}
            isSelected={selectedEffects.some(e => e.id === effect.id)}
            onToggle={() => onToggleEffect(effect)}
          />
        ))}
      </div>
    </div>
  )
}
