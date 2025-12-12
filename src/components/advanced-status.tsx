'use client'
import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { useAttributesContext } from "@/contexts/AttributesContext"
import { Shield, Star, Move, Edit3, Lock, Zap, Plus, Minus, RotateCcw } from "lucide-react"
import { rollDice } from "@/lib/dice-system"
import { DiceIcon } from "@/components/dice-icon"

interface DefenseCardProps {
    title: string
    attributeValue: number
    attributeAbbrev: string
    attributeColor: string
    inputValue: string
    total: number
    isEditMode: boolean
    onInputChange: (value: string) => void
}

function DefenseCard({ title, attributeValue, attributeAbbrev, attributeColor, inputValue, total, isEditMode, onInputChange }: DefenseCardProps) {
    const handleRollDefense = () => {
        const points = Number(inputValue) || 0
        const modifiers = [attributeValue, points].filter(val => val !== 0)
        rollDice({ count: 1, faces: 20, modifiers, notify: true, color: attributeColor })
    }

    return (
        <div className="bg-background/30 rounded-md p-2 border border-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <button
                    onClick={handleRollDefense}
                    aria-label={`Rolar defesa ${title}`}
                    className="p-1 hover:bg-muted/80 rounded transition-colors cursor-pointer"
                >
                    <DiceIcon className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
                <span className="text-xs font-medium text-foreground">{title}</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span>{attributeAbbrev}</span>
                    <span className="font-mono text-foreground text-xs">{attributeValue}</span>
                </div>
                <div className="h-3 w-px bg-border/50" />
                <Input
                    type="number"
                    value={inputValue}
                    onChange={e => onInputChange(e.target.value)}
                    disabled={!isEditMode}
                    className="w-10 h-5 text-center text-xs font-mono bg-primary/10 rounded focus:bg-primary/15 border-0 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
                    placeholder="0"
                />
                <div className="h-3 w-px bg-border/50" />
                <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent min-w-[1.5rem] text-right">
                    {total}
                </span>
            </div>
        </div>
    )
}

// Custom hook for editable numeric values
function useEditableNumber(initial: number, min: number = 0) {
    const [value, setValue] = useState(initial)
    const [input, setInput] = useState(initial.toString())

    const update = useCallback((str: string) => {
        setInput(str)
        const num = str === "" ? min : Number(str) || min
        setValue(num)
    }, [min])

    return { value, input, update }
}

export default function AdvancedStatus() {
    const { attributes } = useAttributesContext()

    const [isEditMode, setIsEditMode] = useState(false)
    const [extraPoints, setExtraPoints] = useState(0)

    // Editable values
    const nivel = useEditableNumber(1, 1)
    const deslocamento = useEditableNumber(9)

    const handleAddPoint = () => {
        if (extraPoints >= 14) {
            setExtraPoints(0)
            nivel.update((nivel.value + 1).toString())
        } else {
            setExtraPoints(prev => prev + 1)
        }
    }

    const handleRemovePoint = () => {
        if (extraPoints <= 0) {
            if (nivel.value > 1) {
                setExtraPoints(14)
                nivel.update((nivel.value - 1).toString())
            }
        } else {
            setExtraPoints(prev => prev - 1)
        }
    }

    const handleResetPoints = () => {
        setExtraPoints(0)
    }

    const totalPowerPoints = (nivel.value * 15) + extraPoints

    // Defense points
    const apararPoints = useEditableNumber(0)
    const esquivaPoints = useEditableNumber(0)
    const fortitudePoints = useEditableNumber(0)
    const resistenciaPoints = useEditableNumber(0)
    const vontadePoints = useEditableNumber(0)

    const toggleEditMode = useCallback(() => {
        setIsEditMode(prev => !prev)
    }, [])

    const getAttrValue = useCallback((id: string) => attributes.find(attr => attr.id === id)?.value ?? 0, [attributes])
    const getAttrColor = useCallback((id: string) => attributes.find(attr => attr.id === id)?.color ?? 'gray', [attributes])

    // Calculated values
    const agilidade = getAttrValue("AGI")
    const luta = getAttrValue("LUT")
    const vigor = getAttrValue("VIG")
    const prontidao = getAttrValue("PRO")

    const agilidadeColor = getAttrColor("AGI")
    const lutaColor = getAttrColor("LUT")
    const vigorColor = getAttrColor("VIG")
    const prontidaoColor = getAttrColor("PRO")

    // Defense totals
    const apararTotal = luta + apararPoints.value
    const esquivaTotal = agilidade + esquivaPoints.value
    const fortitudeTotal = vigor + fortitudePoints.value
    const resistenciaTotal = vigor + resistenciaPoints.value
    const vontadeTotal = prontidao + vontadePoints.value

    return (
        <div className="bg-muted/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-3">
                <button
                    className="px-4 py-1 rounded font-semibold transition-all duration-200 cursor-pointer bg-muted-foreground/20 text-muted-foreground"
                    disabled
                >
                    Progressão
                </button>
                <button
                    onClick={toggleEditMode}
                    className={`p-2 rounded cursor-pointer transition-all duration-200 ${
                        isEditMode
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30"
                    }`}
                    title={isEditMode ? "Desativar modo de edição" : "Ativar modo de edição"}
                    aria-label={isEditMode ? "Desativar modo de edição" : "Ativar modo de edição"}
                    aria-pressed={isEditMode}
                >
                    {isEditMode ? <Edit3 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </button>
            </div>
            <div aria-live="polite" className="sr-only">
                {isEditMode ? "Modo de edição ativado" : "Modo de edição desativado"}
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-muted-foreground" />
                        <label className="text-xs font-medium text-muted-foreground">Nível de Poder</label>
                    </div>
                    <Input
                        type="number"
                        min={1}
                        value={nivel.input}
                        onChange={e => nivel.update(e.target.value)}
                        disabled={!isEditMode}
                        className="text-center text-sm font-mono bg-primary/10 rounded-md focus:bg-primary/15 border-0 outline-none transition-colors h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                        <label className="text-xs font-medium text-muted-foreground">Pontos de Poder</label>
                    </div>
                    <div className="flex items-center justify-between h-8 bg-primary/10 rounded-md px-2 border-0 transition-colors focus-within:bg-primary/15">
                        {isEditMode ? (
                            <>
                                <button 
                                    onClick={handleRemovePoint}
                                    className="p-0.5 hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors"
                                    title="Remover ponto"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <div className="flex items-center gap-1.5 justify-center flex-1">
                                    <span className="font-mono text-sm text-foreground">{totalPowerPoints}</span>
                                    <button 
                                        onClick={handleResetPoints}
                                        className="p-0.5 hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors"
                                        title="Resetar pontos extras"
                                    >
                                        <RotateCcw className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                                <button 
                                    onClick={handleAddPoint}
                                    className="p-0.5 hover:bg-muted/50 rounded text-muted-foreground hover:text-foreground transition-colors"
                                    title="Adicionar ponto"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </>
                        ) : (
                            <div className="w-full text-center font-mono text-sm text-foreground">
                                {totalPowerPoints}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <Move className="h-3.5 w-3.5 text-muted-foreground" />
                        <label className="text-xs font-medium text-muted-foreground">Deslocamento</label>
                    </div>
                    <Input
                        type="number"
                        min={0}
                        value={deslocamento.input}
                        onChange={e => deslocamento.update(e.target.value)}
                        disabled={!isEditMode}
                        className="text-center text-sm font-mono bg-primary/10 rounded-md focus:bg-primary/15 border-0 outline-none transition-colors h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                    Defesas
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    <DefenseCard
                        title="Aparar"
                        attributeValue={luta}
                        attributeAbbrev="LUT"
                        attributeColor={lutaColor}
                        inputValue={apararPoints.input}
                        total={apararTotal}
                        isEditMode={isEditMode}
                        onInputChange={apararPoints.update}
                    />
                    <DefenseCard
                        title="Esquiva"
                        attributeValue={agilidade}
                        attributeAbbrev="AGI"
                        attributeColor={agilidadeColor}
                        inputValue={esquivaPoints.input}
                        total={esquivaTotal}
                        isEditMode={isEditMode}
                        onInputChange={esquivaPoints.update}
                    />
                    <DefenseCard
                        title="Fortitude"
                        attributeValue={vigor}
                        attributeAbbrev="VIG"
                        attributeColor={vigorColor}
                        inputValue={fortitudePoints.input}
                        total={fortitudeTotal}
                        isEditMode={isEditMode}
                        onInputChange={fortitudePoints.update}
                    />
                    <DefenseCard
                        title="Resistência"
                        attributeValue={vigor}
                        attributeAbbrev="VIG"
                        attributeColor={vigorColor}
                        inputValue={resistenciaPoints.input}
                        total={resistenciaTotal}
                        isEditMode={isEditMode}
                        onInputChange={resistenciaPoints.update}
                    />
                    <DefenseCard
                        title="Vontade"
                        attributeValue={prontidao}
                        attributeAbbrev="PRO"
                        attributeColor={prontidaoColor}
                        inputValue={vontadePoints.input}
                        total={vontadeTotal}
                        isEditMode={isEditMode}
                        onInputChange={vontadePoints.update}
                    />
                </div>
            </div>
        </div>
    )
} 