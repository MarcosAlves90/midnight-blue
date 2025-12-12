"use client"

import { memo, useState, useEffect, useCallback } from "react"
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { Edit3, Lock } from "lucide-react"
import { AttributeCard } from "./attributes-grid/attribute-card"
import { useDragAndDropSensors } from "./attributes-grid/use-drag-sensors"
import { AttributesGridProps, Attribute } from "./attributes-grid/types"
import { DEFAULT_INPUT_LIMITS } from "./attributes-grid/constants"
import { useAttributesContext } from "@/contexts/AttributesContext"

export const AttributesGrid = memo(function AttributesGrid({
    disabled = false,
    editable = true,
}: Omit<AttributesGridProps, 'initialAttributes' | 'onAttributesChange' | 'initialBiotypes' | 'onBiotypesChange'> = {}) {
    const [isEditMode, setIsEditMode] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Usar contexto para atributos
    const { attributes, setAttributes } = useAttributesContext()

    const sensors = useDragAndDropSensors()
    const isEditable = editable && isEditMode && !disabled

    const toggleEditMode = useCallback(() => {
        setIsEditMode(prev => !prev)
    }, [])

    // Handler para reordenar atributos ao arrastar
    const handleAttributesDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        setAttributes(prev => {
            const oldIndex = prev.findIndex(attr => attr.id === active.id)
            const newIndex = prev.findIndex(attr => attr.id === over.id)
            return arrayMove(prev, oldIndex, newIndex)
        })
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

    const renderAttributeCards = () => attributes.map((attr: Attribute) => (
        <AttributeCard
            key={attr.id}
            id={attr.id}
            name={attr.name}
            abbreviation={attr.abbreviation}
            color={attr.color}
            value={attr.value}
            bonus={attr.bonus}
            type="attribute"
            disabled={disabled}
            editable={isEditable}
            onValueChange={isEditable ? (value: number) => updateAttribute(attr.id, { value }) : undefined}
            onBonusChange={isEditable ? (bonus: number) => updateAttribute(attr.id, { bonus }) : undefined}
            inputLimits={DEFAULT_INPUT_LIMITS}
        />
    ))

    if (!mounted) {
        return (
            <div className="bg-muted/50 aspect-video rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Atributos</h3>
                    {renderEditButton()}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {renderAttributeCards()}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-muted/50 aspect-video rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Atributos</h3>
                {renderEditButton()}
            </div>
            <div aria-live="polite" className="sr-only">
                {isEditMode ? "Modo de edição ativado" : "Modo de edição desativado"}
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={isEditable ? closestCenter : undefined}
                onDragEnd={isEditable ? handleAttributesDragEnd : undefined}
                modifiers={isEditable ? [restrictToParentElement] : []}
            >
                <SortableContext items={attributes} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {renderAttributeCards()}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
})

export default AttributesGrid;
