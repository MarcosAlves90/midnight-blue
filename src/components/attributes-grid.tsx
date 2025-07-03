"use client"

import { memo, useState, useEffect, useCallback } from "react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { Edit3, Lock } from "lucide-react"
import { AttributeCard } from "./attributes-grid/attribute-card"
import { useAttributesGrid } from "./attributes-grid/use-attributes-grid"
import { useDragAndDropSensors } from "./attributes-grid/use-drag-sensors"
import { AttributesGridProps, Attribute } from "./attributes-grid/types"

export const AttributesGrid = memo(function AttributesGrid({
    initialAttributes,
    onAttributesChange,
    disabled = false,
    editable = true
}: AttributesGridProps = {}) {
    const [isEditMode, setIsEditMode] = useState(false)
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
    }, [])
    
    const { attributes, handleDragEnd, updateAttribute } = useAttributesGrid(
        initialAttributes,
        onAttributesChange
    )
    
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
        >
            {isEditMode ? <Edit3 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        </button>
    )

    const renderAttributeCards = () => attributes.map((attr: Attribute) => (
        <AttributeCard
            key={attr.id}
            id={attr.id}
            name={attr.name}
            abbreviation={attr.abbreviation}
            color={attr.color}
            value={attr.value}
            bonus={attr.bonus}
            disabled={disabled}
            editable={isEditable}
            onValueChange={isEditable ? (value: number) => updateAttribute(attr.id, { value }) : undefined}
            onBonusChange={isEditable ? (bonus: number) => updateAttribute(attr.id, { bonus }) : undefined}
        />
    ))

    if (!mounted) {
        return (
            <div className="bg-muted/50 aspect-video rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Atributos</h2>
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
                <h2 className="text-lg font-semibold">Atributos</h2>
                {renderEditButton()}
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={isEditable ? closestCenter : undefined}
                onDragEnd={isEditable ? handleDragEnd : undefined}
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
