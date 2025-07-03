import { useState, useCallback } from "react"
import { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { Attribute } from "./types"
import { INITIAL_ATTRIBUTES } from "./constants"

export const useAttributesGrid = (
    initialAttributes = INITIAL_ATTRIBUTES,
    onAttributesChange?: (attributes: Attribute[]) => void
) => {
    const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes)

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id && over) {
            setAttributes((items: Attribute[]) => {
                const oldIndex = items.findIndex((item: Attribute) => item.id === active.id)
                const newIndex = items.findIndex((item: Attribute) => item.id === over.id)

                const newItems = arrayMove(items, oldIndex, newIndex)
                onAttributesChange?.(newItems)
                return newItems
            })
        }
    }, [onAttributesChange])

    const updateAttribute = useCallback((id: string, updates: Partial<Attribute>) => {
        setAttributes((items: Attribute[]) => {
            const newItems = items.map(item => 
                item.id === id ? { ...item, ...updates } : item
            )
            onAttributesChange?.(newItems)
            return newItems
        })
    }, [onAttributesChange])

    return {
        attributes,
        setAttributes,
        handleDragEnd,
        updateAttribute
    }
}
