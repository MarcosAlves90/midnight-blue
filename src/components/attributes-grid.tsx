"use client"

import { memo, useState, useEffect, useCallback } from "react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { Edit3, Lock } from "lucide-react"
import { AttributeCard } from "./attributes-grid/attribute-card"
import { useGenericGrid } from "./attributes-grid/use-attributes-grid"
import { useDragAndDropSensors } from "./attributes-grid/use-drag-sensors"
import { AttributesGridProps, Attribute } from "./attributes-grid/types"
import { INITIAL_BIOTYPES, DEFAULT_INPUT_LIMITS } from "./attributes-grid/constants"
import { useAttributesContext } from "@/contexts/AttributesContext"

export const AttributesGrid = memo(function AttributesGrid({
    initialBiotypes = INITIAL_BIOTYPES,
    onBiotypesChange,
    disabled = false,
    editable = true,
}: Omit<AttributesGridProps, 'initialAttributes' | 'onAttributesChange'> = {}) {
    const [isEditMode, setIsEditMode] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [activeTab, setActiveTab] = useState<'attribute' | 'biotype'>('attribute')

    useEffect(() => {
        setMounted(true)
    }, [])

    // Usar contexto para atributos principais
    const { attributes, setAttributes } = useAttributesContext()

    // Biotipos continuam locais
    const {
        items: biotypes,
        handleDragEnd: handleBiotypesDragEnd,
        updateItem: updateBiotype
    } = useGenericGrid(initialBiotypes, onBiotypesChange)

    const sensors = useDragAndDropSensors()
    const isEditable = editable && isEditMode && !disabled

    const toggleEditMode = useCallback(() => {
        setIsEditMode(prev => !prev)
    }, [])

    const renderEditButton = () => (
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
    )

    // Atualizar atributo do contexto
    function updateAttribute(id: string, changes: Partial<Attribute>) {
        setAttributes(prev => prev.map(attr => attr.id === id ? { ...attr, ...changes } : attr))
    }

    const renderAttributeCards = (items: Attribute[], type: 'attribute' | 'biotype') => items.map((attr: Attribute) => (
        <AttributeCard
            key={attr.id}
            id={attr.id}
            name={attr.name}
            abbreviation={attr.abbreviation}
            color={attr.color}
            value={attr.value}
            bonus={attr.bonus}
            type={type}
            disabled={disabled}
            editable={isEditable}
            onValueChange={isEditable ? (value: number) => (type === 'attribute' ? updateAttribute(attr.id, { value }) : updateBiotype(attr.id, { value })) : undefined}
            onBonusChange={isEditable && type === "attribute" ? (bonus: number) => updateAttribute(attr.id, { bonus }) : undefined}
            // Limites dinâmicos (pode ser extendido para vir de props/context futuramente)
            inputLimits={DEFAULT_INPUT_LIMITS}
        />
    ))

    // Títulos e tabs
    const renderTabs = () => (
        <div className="flex gap-2 items-center">
            <button
                className={`px-4 py-1 rounded font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === 'attribute'
                        ? 'bg-muted-foreground/20 text-muted-foreground'
                        : 'bg-muted-foreground/5 text-muted-foreground/50'
                }`}
                onClick={() => setActiveTab('attribute')}
                disabled={activeTab === 'attribute'}
            >
                Atributos
            </button>
            <button
                className={`px-4 py-1 rounded font-semibold transition-all duration-200 cursor-pointer text-muted-foreground ${
                    activeTab === 'biotype'
                        ? 'bg-muted-foreground/20 text-muted-foreground'
                        : 'bg-muted-foreground/5 text-muted-foreground/50'
                }`}
                onClick={() => setActiveTab('biotype')}
                disabled={activeTab === 'biotype'}
            >
                Biotipos
            </button>
        </div>
    )

    if (!mounted) {
        return (
            <div className="bg-muted/50 aspect-video rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    {renderTabs()}
                    {renderEditButton()}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeTab === 'attribute'
                        ? renderAttributeCards(attributes, 'attribute')
                        : renderAttributeCards(biotypes, 'biotype')}
                </div>
            </div>
        )
    }

    const dndProps = activeTab === 'attribute'
        ? {
            items: attributes,
            handleDragEnd: undefined, // Drag de atributos desabilitado por enquanto
        }
        : {
            items: biotypes,
            handleDragEnd: isEditable ? handleBiotypesDragEnd : undefined,
        }

    return (
        <div className="bg-muted/50 aspect-video rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                {renderTabs()}
                {renderEditButton()}
            </div>
            <div aria-live="polite" className="sr-only">
                {isEditMode ? "Modo de edição ativado" : "Modo de edição desativado"}
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={isEditable ? closestCenter : undefined}
                onDragEnd={dndProps.handleDragEnd}
                modifiers={isEditable ? [restrictToParentElement] : []}
            >
                <SortableContext items={dndProps.items} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {activeTab === 'attribute'
                            ? renderAttributeCards(attributes, 'attribute')
                            : renderAttributeCards(biotypes, 'biotype')}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
})

export default AttributesGrid;
