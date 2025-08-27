'use client'
import { useState, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { useAttributesContext } from "@/contexts/AttributesContext"
import { Shield, Zap, Star, Move, Edit3, Lock } from "lucide-react"

interface StatCardProps {
    title: string
    icon: React.ReactNode
    value: number
    base: number
    isEditMode: boolean
    components: Array<{
        label: string
        value: string
        onChange: (value: string) => void
        placeholder?: string
    }>
}

function StatCard({ title, icon, value, base, isEditMode, components }: StatCardProps) {
    return (
        <div className="bg-background/30 rounded-lg p-3 border border-muted/20">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                    {icon}
                    <span className="text-xs font-medium text-foreground">{title}</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                    {value}
                </span>
            </div>
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Base</span>
                    <span className="font-mono text-foreground">{base}</span>
                </div>
                {components.map((comp, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{comp.label}</span>
                        <Input
                            type="number"
                            value={comp.value}
                            onChange={e => comp.onChange(e.target.value)}
                            disabled={!isEditMode}
                            className="w-12 h-6 text-center text-xs font-mono bg-primary/10 rounded focus:bg-primary/15 border-0 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder={comp.placeholder || "0"}
                        />
                    </div>
                ))}
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
    const { attributes, setAttributes } = useAttributesContext()

    const [isEditMode, setIsEditMode] = useState(false)

    // Editable values
    const nivel = useEditableNumber(1, 1)
    const equipamento = useEditableNumber(0)
    const defesaOutros = useEditableNumber(0)
    const deslocamento = useEditableNumber(9)
    const dtOutros = useEditableNumber(0)

    const toggleEditMode = useCallback(() => {
        setIsEditMode(prev => !prev)
    }, [])

    const getAttrValue = useCallback((id: string) => attributes.find(attr => attr.id === id)?.value ?? 0, [attributes])
    const setAttrValue = useCallback((id: string, value: number) =>
        setAttributes(prev => prev.map(attr => attr.id === id ? { ...attr, value } : attr)), [setAttributes])

    // Calculated values
    const destreza = getAttrValue("DES")
    const presenca = getAttrValue("PRE")

    const defesa = useMemo(() => 10 + destreza + equipamento.value + defesaOutros.value, [destreza, equipamento.value, defesaOutros.value])
    const dt = useMemo(() => 10 + nivel.value + presenca + dtOutros.value, [nivel.value, presenca, dtOutros.value])

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

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-muted-foreground" />
                        <label className="text-xs font-medium text-muted-foreground">Nível</label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <StatCard
                    title="Defesa"
                    icon={<Shield className="h-3.5 w-3.5 text-blue-400" />}
                    value={defesa}
                    base={10}
                    isEditMode={isEditMode}
                    components={[
                        { label: "DES", value: destreza.toString(), onChange: v => setAttrValue("DES", v === "" ? 0 : Number(v) || 0) },
                        { label: "Equip", value: equipamento.input, onChange: equipamento.update },
                        { label: "Outros", value: defesaOutros.input, onChange: defesaOutros.update }
                    ]}
                />

                <StatCard
                    title="DT"
                    icon={<Zap className="h-3.5 w-3.5 text-yellow-400" />}
                    value={dt}
                    base={10}
                    isEditMode={isEditMode}
                    components={[
                        { label: "Nível", value: nivel.input, onChange: nivel.update, placeholder: "1" },
                        { label: "PRE", value: presenca.toString(), onChange: v => setAttrValue("PRE", v === "" ? 0 : Number(v) || 0) },
                        { label: "Outros", value: dtOutros.input, onChange: dtOutros.update }
                    ]}
                />
            </div>
        </div>
    )
} 