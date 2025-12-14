import React, { useState } from "react"
import { AlertTriangle, Plus, Trash2, Info, Pencil, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IdentityData, Complication } from "@/contexts/IdentityContext"
import { cn } from "@/lib/utils"

const COMPLICATION_TYPES = [
  "Motivação: Aceitação",
  "Motivação: Adrenalina",
  "Motivação: Cobiça",
  "Motivação: Fazer o Bem",
  "Motivação: Justiça",
  "Motivação: Patriotismo",
  "Motivação: Reconhecimento",
  "Motivação: Responsabilidade",
  "Acidente",
  "Deficiência",
  "Fama",
  "Fobia",
  "Fraqueza",
  "Honra",
  "Identidade",
  "Inimigo",
  "Irritação",
  "Obsessão",
  "Ódio",
  "Peculiaridade",
  "Perda de Poder",
  "Preconceito",
  "Relacionamento",
  "Reputação",
  "Responsabilidade",
  "Rivalidade",
  "Segredo",
  "Vício"
]

const COMPLICATION_PLACEHOLDERS: Record<string, string> = {
  "Motivação: Aceitação": "Por que o herói busca aceitação? Ele se sente diferente ou isolado?",
  "Motivação: Adrenalina": "Como a busca por emoção e perigo afeta as decisões do herói?",
  "Motivação: Cobiça": "O que o herói busca ganhar? Dinheiro, fama ou recursos?",
  "Motivação: Fazer o Bem": "O que impulsiona o senso moral do herói? Alguma promessa ou crença?",
  "Motivação: Justiça": "Até onde o herói vai para punir os culpados? Ele opera fora da lei?",
  "Motivação: Patriotismo": "A qual nação ou ideal o herói é devoto? Isso entra em conflito com outros deveres?",
  "Motivação: Reconhecimento": "Por que o herói precisa ser notado? Ele teme o esquecimento?",
  "Motivação: Responsabilidade": "Qual é o dever que o herói sente que deve cumprir?",
  "Acidente": "Que tipo de acidente o herói costuma causar ou sofrer?",
  "Deficiência": "Qual é a limitação física e como ela desafia o herói?",
  "Fama": "Como a atenção da mídia e dos fãs atrapalha a vida do herói?",
  "Fobia": "Do que o herói tem medo irracional? Como ele reage?",
  "Fraqueza": "O que supera as defesas do herói? (Ex: Kriptonita, Prata, Magia)",
  "Honra": "Qual código o herói segue que limita suas ações contra vilões?",
  "Identidade": "Quem é o herói na vida civil e por que isso deve ser mantido em segredo?",
  "Inimigo": "Quem quer prejudicar o herói e por quê?",
  "Irritação": "O que tira o herói do sério e o faz perder o controle?",
  "Obsessão": "Pelo que ou quem o herói é obcecado? Como isso o distrai?",
  "Ódio": "O que o herói odeia irracionalmente e ataca sem pensar?",
  "Peculiaridade": "Qual hábito estranho ou neurose o herói possui?",
  "Perda de Poder": "O que faz os poderes do herói falharem? (Ex: Falta de sol, objeto roubado)",
  "Preconceito": "Por que o herói sofre preconceito? Aparência, origem ou crença?",
  "Relacionamento": "Quem são as pessoas importantes que podem ser usadas contra o herói?",
  "Reputação": "Por que as pessoas desconfiam ou temem o herói?",
  "Responsabilidade": "Quais obrigações (trabalho, família) conflitam com a vida de herói?",
  "Rivalidade": "Com quem o herói compete e tenta superar a todo custo?",
  "Segredo": "O que o herói esconde que poderia arruiná-lo se descoberto?",
  "Vício": "Do que o herói depende física ou psicologicamente?"
}

interface ComplicationsSectionProps {
  identity: IdentityData
  onFieldChange: <K extends keyof IdentityData>(field: K, value: IdentityData[K]) => void
}

export const ComplicationsSection: React.FC<ComplicationsSectionProps> = ({ identity, onFieldChange }) => {
  const [selectedType, setSelectedType] = useState(COMPLICATION_TYPES[0])
  const [description, setDescription] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAddOrUpdate = () => {
    if (!description.trim()) return

    let updatedComplications = [...(identity.complications || [])]

    if (editingId) {
      updatedComplications = updatedComplications.map(comp => 
        comp.id === editingId 
          ? { ...comp, name: selectedType, description: description }
          : comp
      )
      setEditingId(null)
    } else {
      const newComplication: Complication = {
        id: crypto.randomUUID(),
        name: selectedType,
        description: description
      }
      updatedComplications.push(newComplication)
    }

    onFieldChange("complications", updatedComplications)
    setDescription("")
    setSelectedType(COMPLICATION_TYPES[0])
  }

  const handleEdit = (comp: Complication) => {
    setEditingId(comp.id)
    setSelectedType(comp.name)
    setDescription(comp.description)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setDescription("")
    setSelectedType(COMPLICATION_TYPES[0])
  }

  const handleRemove = (id: string) => {
    const updatedComplications = (identity.complications || []).filter(c => c.id !== id)
    onFieldChange("complications", updatedComplications)
    
    if (editingId === id) {
      handleCancelEdit()
    }
  }

  const complications = identity.complications || []
  const hasMotivation = complications.some(c => c.name.startsWith("Motivação"))
  const hasMinCount = complications.length >= 2

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/40">
        <AlertTriangle className="w-4 h-4 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Complicações
        </h3>
      </div>

      <div className="space-y-3 mb-4 bg-muted/10 p-3 rounded-lg border border-border/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <label className="text-[10px] font-medium text-muted-foreground uppercase mb-1 block">
              Tipo
            </label>
            <select
              className="w-full h-8 rounded-md border border-input bg-background/50 px-2 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {COMPLICATION_TYPES.map(type => (
                <option key={type} value={type} className="bg-background text-foreground">
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-8">
            <label className="text-[10px] font-medium text-muted-foreground uppercase mb-1 block">
              Descrição
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={COMPLICATION_PLACEHOLDERS[selectedType] || "Descreva a complicação..."}
              className="h-8 text-xs bg-background/50"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-1">
          {editingId && (
            <Button
              onClick={handleCancelEdit}
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
            >
              <X className="w-3 h-3 mr-1.5" />
              Cancelar
            </Button>
          )}
          <Button
            onClick={handleAddOrUpdate}
            disabled={!description.trim()}
            className={cn("h-7 text-xs px-3", editingId ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}
            size="sm"
          >
            {editingId ? (
              <>
                <Check className="w-3 h-3 mr-1.5" />
                Atualizar
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 mr-1.5" />
                Adicionar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {complications.map((comp) => (
          <div 
            key={comp.id} 
            className={cn(
              "rounded-md p-2 border flex justify-between items-start gap-2 group transition-all duration-200",
              editingId === comp.id 
                ? "border-primary/50 bg-primary/5 shadow-[0_0_10px_rgba(var(--primary),0.1)]" 
                : "border-border/30 bg-muted/20 hover:bg-muted/40"
            )}
          >
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="font-medium text-xs text-primary truncate">{comp.name}</div>
              <p className="text-[11px] text-muted-foreground leading-snug break-words">{comp.description}</p>
            </div>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-primary"
                onClick={() => handleEdit(comp)}
                title="Editar"
              >
                <Pencil className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemove(comp.id)}
                title="Remover"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        
        {complications.length === 0 && (
          <div className="text-center py-6 text-muted-foreground/50 text-[10px] border border-dashed border-border/20 rounded-md bg-muted/5">
            Nenhuma complicação adicionada.
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {!hasMinCount && (
           <div className="flex items-center gap-1.5 text-amber-500 text-[10px] bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10">
              <Info className="w-3 h-3" />
              <span>Mínimo 2 complicações ({complications.length}/2)</span>
           </div>
        )}
        {!hasMotivation && (
           <div className="flex items-center gap-1.5 text-amber-500 text-[10px] bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10">
              <Info className="w-3 h-3" />
              <span>Adicione uma Motivação</span>
           </div>
        )}
      </div>
    </div>
  )
}
