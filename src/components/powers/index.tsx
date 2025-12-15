'use client'

import { useState, useCallback } from 'react'
import { Power } from './types'
import { POWER_TIPS } from './constants'
import { PowerCard } from './power-card'
import { PowerBuilderModal } from './power-builder-modal'
import { Tip } from '@/components/ui/tip'
import { Sparkles, Plus, Edit3, Lock, AlertTriangle } from 'lucide-react'

interface PowersSectionProps {
  powerLevel?: number
}

function calculatePowerCost(power: Power): number {
  const baseEffect = power.effects.reduce((acc, e) => acc + e.baseCost, 0)
  
  const extrasTotal = power.modifiers
    .filter(m => m.type === 'extra' && !m.isFlat)
    .reduce((acc, m) => acc + m.costPerRank, 0)
  
  const flawsTotal = power.modifiers
    .filter(m => m.type === 'falha' && !m.isFlat)
    .reduce((acc, m) => acc + m.costPerRank, 0)
  
  const flatModifiers = power.modifiers
    .filter(m => m.isFlat)
    .reduce((acc, m) => acc + m.costPerRank, 0)

  const costPerRank = baseEffect + extrasTotal + flawsTotal
  
  let totalCost: number
  if (costPerRank <= 0) {
    const ranksPerPoint = Math.min(5, Math.abs(costPerRank - 1) + 1)
    totalCost = Math.ceil(power.rank / ranksPerPoint)
  } else {
    totalCost = costPerRank * power.rank
  }

  return Math.max(1, totalCost + flatModifiers)
}

export default function PowersSection({ powerLevel = 10 }: PowersSectionProps) {
  const [powers, setPowers] = useState<Power[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev)
  }, [])

  const handleAddPower = (power: Power) => {
    setPowers(prev => [...prev, power])
  }

  const handleDeletePower = (id: string) => {
    setPowers(prev => prev.filter(p => p.id !== id))
  }

  const totalPowersCost = powers.reduce((acc, power) => acc + calculatePowerCost(power), 0)

  // Check for powers that exceed power level limits
  const powersExceedingLimit = powers.filter(power => {
    // Effects with attack roll: rank + attack bonus <= PL * 2
    // Effects without attack (perception/save): rank <= PL
    const hasAttack = power.effects.some(e => e.range !== 'percepcao')
    const maxRank = hasAttack ? powerLevel * 2 : powerLevel
    return power.rank > maxRank
  })

  return (
    <div className="bg-gradient-to-br from-purple-950/20 to-background rounded-xl border border-purple-500/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/10 bg-purple-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Poderes</h2>
              <p className="text-xs text-muted-foreground">
                {powers.length} {powers.length === 1 ? 'poder' : 'poderes'} • {totalPowersCost} PP investidos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditMode && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                title="Adicionar Poder"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={toggleEditMode}
              className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isEditMode
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30"
              }`}
              title={isEditMode ? "Desativar modo de edição" : "Ativar modo de edição"}
            >
              {isEditMode ? <Edit3 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Power Level Warning */}
      {powersExceedingLimit.length > 0 && (
        <div className="mx-4 mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <strong>Aviso de Nível de Poder:</strong> {powersExceedingLimit.length} poder(es) excedem o limite de NP {powerLevel}.
            Verifique as graduações ou consulte o mestre.
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {powers.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-10 w-10 text-purple-500/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-2">Nenhum poder criado ainda</p>
            {isEditMode ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm font-medium bg-purple-500/10 text-purple-300 rounded-lg hover:bg-purple-500/20 transition-colors"
              >
                Criar Primeiro Poder
              </button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Ative o modo de edição para criar poderes
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {powers.map(power => (
              <PowerCard
                key={power.id}
                power={power}
                onDelete={handleDeletePower}
                isEditMode={isEditMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="p-3 border-t border-purple-500/10 bg-purple-500/5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Tip content={<div className="max-w-xs text-xs">{POWER_TIPS.cost}</div>}>
            <span className="cursor-help underline decoration-dotted underline-offset-2">
              Fórmula: (base + extras - falhas) × grad + fixos
            </span>
          </Tip>
          <span>
            Limite NP: <span className="text-purple-400 font-medium">{powerLevel}</span>
          </span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PowerBuilderModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddPower}
        />
      )}
    </div>
  )
}
