'use client'

import { Check, ArrowRight, ArrowLeft } from 'lucide-react'

interface PowerBuilderFooterProps {
  step: number
  isEditing: boolean
  canProceed: boolean
  onPrevious: () => void
  onNext: () => void
  onSave: () => void
  onClose: () => void
}

export function PowerBuilderFooter({
  step,
  isEditing,
  canProceed,
  onPrevious,
  onNext,
  onSave,
  onClose
}: PowerBuilderFooterProps) {
  return (
    <div className="p-4 border-t border-border/50 bg-background/50 flex items-center justify-between">
      <button
        onClick={() => {
          if (step > 1) onPrevious()
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
            onClick={onNext}
            disabled={!canProceed}
            className="px-6 py-2 text-sm font-medium bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={onSave}
            disabled={!canProceed}
            className="px-6 py-2 text-sm font-medium bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-[0_0_15px_-3px_rgba(168,85,247,0.5)]"
          >
            <Check className="h-4 w-4" />
            {isEditing ? 'Atualizar Poder' : 'Criar Poder'}
          </button>
        )}
      </div>
    </div>
  )
}
