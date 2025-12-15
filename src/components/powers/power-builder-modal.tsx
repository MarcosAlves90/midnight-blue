'use client'

import { useState, useMemo } from 'react'
import { Power, Effect, Modifier, ActionType, RangeType, DurationType } from './types'
import { 
  EFFECTS, 
  COMMON_EXTRAS, 
  COMMON_FLAWS, 
  COMMON_DESCRIPTORS, 
  ACTION_LABELS, 
  RANGE_LABELS, 
  DURATION_LABELS, 
  ACTION_DESCRIPTIONS,
  RANGE_DESCRIPTIONS,
  DURATION_DESCRIPTIONS,
  POWER_TIPS 
} from './constants'
import { Tip } from '@/components/ui/tip'
import { Input } from '@/components/ui/input'
import { X, Plus, Minus, Sparkles, Check, Search, ArrowRight, ArrowLeft } from 'lucide-react'
import { PowerCard } from './power-card'

interface PowerBuilderModalProps {
  onClose: () => void
  onSave: (power: Power) => void
}

export function PowerBuilderModal({ onClose, onSave }: PowerBuilderModalProps) {
  const [step, setStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Form State
  const [name, setName] = useState('')
  const [selectedEffects, setSelectedEffects] = useState<Effect[]>([])
  const [rank, setRank] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([])
  const [selectedDescriptors, setSelectedDescriptors] = useState<string[]>([])
  const [customAction, setCustomAction] = useState<ActionType | null>(null)
  const [customRange, setCustomRange] = useState<RangeType | null>(null)
  const [customDuration, setCustomDuration] = useState<DurationType | null>(null)
  const [notes, setNotes] = useState('')

  // Filtered Lists
  const filteredEffects = useMemo(() => 
    EFFECTS.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.description.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  )

  const filteredExtras = useMemo(() => 
    COMMON_EXTRAS.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  )

  const filteredFlaws = useMemo(() => 
    COMMON_FLAWS.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  )

  // Handlers
  const toggleEffect = (effect: Effect) => {
    setSelectedEffects(prev => 
      prev.find(e => e.id === effect.id)
        ? prev.filter(e => e.id !== effect.id)
        : [...prev, effect]
    )
  }

  const toggleModifier = (modifier: Modifier) => {
    setSelectedModifiers(prev => 
      prev.find(m => m.id === modifier.id)
        ? prev.filter(m => m.id !== modifier.id)
        : [...prev, modifier]
    )
  }

  const toggleDescriptor = (descriptor: string) => {
    setSelectedDescriptors(prev =>
      prev.includes(descriptor)
        ? prev.filter(d => d !== descriptor)
        : [...prev, descriptor]
    )
  }

  // Calculations
  const calculateCost = (): number => {
    if (selectedEffects.length === 0) return 0

    const baseEffect = selectedEffects.reduce((acc, e) => acc + e.baseCost, 0)
    
    const extrasTotal = selectedModifiers
      .filter(m => m.type === 'extra' && !m.isFlat)
      .reduce((acc, m) => acc + m.costPerRank, 0)
    
    const flawsTotal = selectedModifiers
      .filter(m => m.type === 'falha' && !m.isFlat)
      .reduce((acc, m) => acc + m.costPerRank, 0)
    
    const flatModifiers = selectedModifiers
      .filter(m => m.isFlat)
      .reduce((acc, m) => acc + m.costPerRank, 0)

    const costPerRank = baseEffect + extrasTotal + flawsTotal
    
    let totalCost: number
    if (costPerRank <= 0) {
      const ranksPerPoint = Math.min(5, Math.abs(costPerRank - 1) + 1)
      totalCost = Math.ceil(rank / ranksPerPoint)
    } else {
      totalCost = costPerRank * rank
    }

    return Math.max(1, totalCost + flatModifiers)
  }

  const previewPower: Power = {
    id: 'preview',
    name: name.trim() || 'Novo Poder',
    effects: selectedEffects,
    rank,
    descriptors: selectedDescriptors,
    modifiers: selectedModifiers,
    customAction: customAction || undefined,
    customRange: customRange || undefined,
    customDuration: customDuration || undefined,
    notes: notes.trim() || undefined,
  }

  const handleSave = () => {
    if (selectedEffects.length === 0 || !name.trim()) return
    onSave({ ...previewPower, id: crypto.randomUUID() })
    onClose()
  }

  const canProceed = () => {
    if (step === 1) return selectedEffects.length > 0
    if (step === 2) return rank >= 1
    if (step === 3) return true
    if (step === 4) return !!name.trim()
    return false
  }

  const defaultAction = selectedEffects[0]?.action || 'padrao'
  const defaultRange = selectedEffects[0]?.range || 'perto'
  const defaultDuration = selectedEffects[0]?.duration || 'instantaneo'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card border border-purple-500/20 rounded-xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-purple-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Criar Poder</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={step >= 1 ? "text-purple-400 font-medium" : ""}>1. Efeitos</span>
                <span>→</span>
                <span className={step >= 2 ? "text-purple-400 font-medium" : ""}>2. Parâmetros</span>
                <span>→</span>
                <span className={step >= 3 ? "text-purple-400 font-medium" : ""}>3. Modificadores</span>
                <span>→</span>
                <span className={step >= 4 ? "text-purple-400 font-medium" : ""}>4. Detalhes</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
          
          {/* Left Column: Steps */}
          <div className="lg:col-span-2 flex flex-col overflow-hidden border-r border-border/50">
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* Step 1: Effects */}
              {step === 1 && (
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
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-8 bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredEffects.map(effect => {
                      const isSelected = selectedEffects.some(e => e.id === effect.id)
                      return (
                        <button
                          key={effect.id}
                          onClick={() => toggleEffect(effect)}
                          className={`p-3 text-left rounded-lg border transition-all group relative overflow-hidden ${
                            isSelected
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-border/50 hover:border-purple-500/30 hover:bg-muted/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Tip content={<div className="max-w-xs text-xs">{effect.description}</div>} side="right">
                              <span className="font-medium text-foreground group-hover:text-purple-400 transition-colors cursor-help underline decoration-dotted underline-offset-2">
                                {effect.name}
                              </span>
                            </Tip>
                            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                              {effect.baseCost} PP/grad
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Parameters */}
              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Configurar Parâmetros</h3>
                    <p className="text-sm text-muted-foreground">Ajuste a graduação e as propriedades básicas.</p>
                  </div>

                  {/* Rank */}
                  <div className="p-6 bg-muted/10 rounded-xl border border-border/50 flex flex-col items-center gap-4">
                    <Tip content={<div className="max-w-xs text-xs">{POWER_TIPS.rank}</div>}>
                      <label className="text-sm font-medium text-muted-foreground cursor-help underline decoration-dotted underline-offset-2">
                        Graduação do Poder
                      </label>
                    </Tip>
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => setRank(prev => Math.max(1, prev - 1))}
                        className="h-12 w-12 rounded-full bg-muted/50 hover:bg-purple-500/20 hover:text-purple-400 flex items-center justify-center transition-all"
                      >
                        <Minus className="h-6 w-6" />
                      </button>
                      <div className="text-5xl font-bold text-foreground w-24 text-center font-mono">
                        {rank}
                      </div>
                      <button
                        onClick={() => setRank(prev => Math.min(20, prev + 1))}
                        className="h-12 w-12 rounded-full bg-muted/50 hover:bg-purple-500/20 hover:text-purple-400 flex items-center justify-center transition-all"
                      >
                        <Plus className="h-6 w-6" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Nível de Poder máximo recomendado: 10-12</p>
                  </div>

                  <div className="grid gap-6">
                    {/* Action */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Tip content={<div className="max-w-xs text-xs">{POWER_TIPS.action}</div>}>
                          <label className="text-sm font-medium text-foreground cursor-help underline decoration-dotted underline-offset-2">Ação</label>
                        </Tip>
                        <span className="text-xs text-muted-foreground">Padrão: {ACTION_LABELS[defaultAction]}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(ACTION_LABELS) as ActionType[]).map(action => (
                          <Tip key={action} content={<div className="max-w-xs text-xs">{ACTION_DESCRIPTIONS[action]}</div>}>
                            <button
                              onClick={() => setCustomAction(action === defaultAction ? null : action)}
                              className={`px-4 py-2 text-sm rounded-md border transition-all ${
                                (customAction || defaultAction) === action
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_10px_-3px_rgba(168,85,247,0.4)]'
                                  : 'bg-muted/20 text-muted-foreground border-transparent hover:bg-muted/40'
                              }`}
                            >
                              <span className="cursor-help underline decoration-dotted underline-offset-2">{ACTION_LABELS[action]}</span>
                            </button>
                          </Tip>
                        ))}
                      </div>
                    </div>

                    {/* Range */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Tip content={<div className="max-w-xs text-xs">{POWER_TIPS.range}</div>}>
                          <label className="text-sm font-medium text-foreground cursor-help underline decoration-dotted underline-offset-2">Alcance</label>
                        </Tip>
                        <span className="text-xs text-muted-foreground">Padrão: {RANGE_LABELS[defaultRange]}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(RANGE_LABELS) as RangeType[]).map(range => (
                          <Tip key={range} content={<div className="max-w-xs text-xs">{RANGE_DESCRIPTIONS[range]}</div>}>
                            <button
                              onClick={() => setCustomRange(range === defaultRange ? null : range)}
                              className={`px-4 py-2 text-sm rounded-md border transition-all ${
                                (customRange || defaultRange) === range
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_10px_-3px_rgba(168,85,247,0.4)]'
                                  : 'bg-muted/20 text-muted-foreground border-transparent hover:bg-muted/40'
                              }`}
                            >
                              <span className="cursor-help underline decoration-dotted underline-offset-2">{RANGE_LABELS[range]}</span>
                            </button>
                          </Tip>
                        ))}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Tip content={<div className="max-w-xs text-xs">{POWER_TIPS.duration}</div>}>
                          <label className="text-sm font-medium text-foreground cursor-help underline decoration-dotted underline-offset-2">Duração</label>
                        </Tip>
                        <span className="text-xs text-muted-foreground">Padrão: {DURATION_LABELS[defaultDuration]}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(DURATION_LABELS) as DurationType[]).map(duration => (
                          <Tip key={duration} content={<div className="max-w-xs text-xs">{DURATION_DESCRIPTIONS[duration]}</div>}>
                            <button
                              onClick={() => setCustomDuration(duration === defaultDuration ? null : duration)}
                              className={`px-4 py-2 text-sm rounded-md border transition-all ${
                                (customDuration || defaultDuration) === duration
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_10px_-3px_rgba(168,85,247,0.4)]'
                                  : 'bg-muted/20 text-muted-foreground border-transparent hover:bg-muted/40'
                              }`}
                            >
                              <span className="cursor-help underline decoration-dotted underline-offset-2">{DURATION_LABELS[duration]}</span>
                            </button>
                          </Tip>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Modifiers */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Modificadores</h3>
                      <p className="text-sm text-muted-foreground">Adicione Extras ou Falhas para alterar o custo.</p>
                    </div>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar modificadores..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-8 bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Extras */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-green-400 flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Extras (Aumentam Custo)
                      </h4>
                      <div className="space-y-2">
                        {filteredExtras.map(modifier => (
                          <Tip key={modifier.id} content={<div className="max-w-xs text-xs">{modifier.description}</div>} side="right">
                            <button
                              onClick={() => toggleModifier(modifier)}
                              className={`w-full p-2 text-left text-sm rounded-md border transition-all flex items-center justify-between ${
                                selectedModifiers.find(m => m.id === modifier.id)
                                  ? 'bg-green-500/10 border-green-500/50 text-green-300'
                                  : 'bg-muted/10 border-transparent hover:bg-muted/20 text-muted-foreground'
                              }`}
                            >
                              <span className="hover:text-purple-400 cursor-help underline decoration-dotted underline-offset-2">{modifier.name}</span>
                              <span className="text-xs opacity-70">+{modifier.costPerRank}</span>
                            </button>
                          </Tip>
                        ))}
                      </div>
                    </div>

                    {/* Flaws */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-red-400 flex items-center gap-2">
                        <Minus className="h-4 w-4" /> Falhas (Reduzem Custo)
                      </h4>
                      <div className="space-y-2">
                        {filteredFlaws.map(modifier => (
                          <Tip key={modifier.id} content={<div className="max-w-xs text-xs">{modifier.description}</div>} side="right">
                            <button
                              onClick={() => toggleModifier(modifier)}
                              className={`w-full p-2 text-left text-sm rounded-md border transition-all flex items-center justify-between ${
                                selectedModifiers.find(m => m.id === modifier.id)
                                  ? 'bg-red-500/10 border-red-500/50 text-red-300'
                                  : 'bg-muted/10 border-transparent hover:bg-muted/20 text-muted-foreground'
                              }`}
                            >
                              <span className="hover:text-purple-400 cursor-help underline decoration-dotted underline-offset-2">{modifier.name}</span>
                              <span className="text-xs opacity-70">{modifier.costPerRank}</span>
                            </button>
                          </Tip>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Details */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Detalhes Finais</h3>
                    <p className="text-sm text-muted-foreground">Dê um nome e personalize seu poder.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Nome do Poder *</label>
                      <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ex: Rajada de Fogo, Escudo Mental..."
                        className="bg-background/50 border-purple-500/30 text-lg"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-2">
                      <Tip content={<div className="max-w-xs text-xs">{POWER_TIPS.descriptors}</div>}>
                        <label className="text-sm font-medium text-foreground cursor-help underline decoration-dotted underline-offset-2">
                          Descritores
                        </label>
                      </Tip>
                      <div className="flex flex-wrap gap-2 p-4 bg-muted/10 rounded-lg border border-border/50">
                        {COMMON_DESCRIPTORS.map(descriptor => (
                          <button
                            key={descriptor}
                            onClick={() => toggleDescriptor(descriptor)}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${
                              selectedDescriptors.includes(descriptor)
                                ? 'bg-purple-500 text-white'
                                : 'bg-background border border-border hover:border-purple-500/50'
                            }`}
                          >
                            {descriptor}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Notas (opcional)</label>
                      <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Descrição adicional, limitações narrativas..."
                        className="w-full h-32 px-3 py-2 text-sm bg-background/50 border border-purple-500/30 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="p-4 border-t border-border/50 bg-background/50 flex items-center justify-between">
              <button
                onClick={() => {
                  if (step > 1) setStep(prev => prev - 1)
                  else onClose()
                }}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                {step > 1 ? <ArrowLeft className="h-4 w-4" /> : null}
                {step > 1 ? 'Voltar' : 'Cancelar'}
              </button>

              <div className="flex items-center gap-2">
                {step < 4 ? (
                  <button
                    onClick={() => setStep(prev => prev + 1)}
                    disabled={!canProceed()}
                    className="px-6 py-2 text-sm font-medium bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    Próximo
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={!canProceed()}
                    className="px-6 py-2 text-sm font-medium bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-[0_0_15px_-3px_rgba(168,85,247,0.5)]"
                  >
                    <Check className="h-4 w-4" />
                    Criar Poder
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="hidden lg:flex flex-col bg-muted/5 p-6 border-l border-border/50">
            <div className="sticky top-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Pré-visualização</h3>
                <PowerCard power={previewPower} isEditMode={false} onDelete={() => {}} />
              </div>

              <div className="p-4 bg-background/50 rounded-xl border border-border/50 space-y-4">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  Custo Total
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Base ({selectedEffects.length} efeitos)</span>
                    <span>{selectedEffects.reduce((acc, e) => acc + e.baseCost, 0)} PP/grad</span>
                  </div>
                  
                  {selectedModifiers.length > 0 && (
                    <>
                      <div className="flex justify-between text-green-400">
                        <span>Extras</span>
                        <span>+{selectedModifiers.filter(m => m.type === 'extra' && !m.isFlat).reduce((acc, m) => acc + m.costPerRank, 0)} /grad</span>
                      </div>
                      <div className="flex justify-between text-red-400">
                        <span>Falhas</span>
                        <span>{selectedModifiers.filter(m => m.type === 'falha' && !m.isFlat).reduce((acc, m) => acc + m.costPerRank, 0)} /grad</span>
                      </div>
                      <div className="flex justify-between text-purple-400 border-t border-border/50 pt-1 mt-1">
                        <span>Modificadores Fixos</span>
                        <span>{selectedModifiers.filter(m => m.isFlat).reduce((acc, m) => acc + m.costPerRank, 0)} PP</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total Final</span>
                  <span className="text-2xl font-bold text-purple-400">{calculateCost()} PP</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
