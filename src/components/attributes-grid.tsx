"use client";

import { memo } from "react";
import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
    restrictToParentElement,
} from "@dnd-kit/modifiers";
import AttributeCard from "./attributes-grid/attribute-card";
import { useAttributesGrid } from "./attributes-grid/use-attributes-grid";
import { useDragAndDropSensors } from "./attributes-grid/use-drag-sensors";
import { AttributesGridProps, Attribute } from "./attributes-grid/types";

const AttributesGrid = memo(function AttributesGrid({
    initialAttributes,
    onAttributesChange,
    disabled = false,
    editable = true
}: AttributesGridProps = {}) {
    const { attributes, handleDragEnd, updateAttribute } = useAttributesGrid(
        initialAttributes,
        onAttributesChange
    );
    
    const sensors = useDragAndDropSensors();

    return (
        <div className="bg-muted/50 aspect-video rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Atributos</h2>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToParentElement]}
            >
                <SortableContext items={attributes} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {attributes.map((attr: Attribute) => (
                            <AttributeCard
                                key={attr.id}
                                id={attr.id}
                                name={attr.name}
                                abbreviation={attr.abbreviation}
                                borderColor={attr.borderColor}
                                value={attr.value}
                                bonus={attr.bonus}
                                disabled={disabled}
                                editable={editable}
                                onValueChange={(value: number) => updateAttribute(attr.id, { value })}
                                onBonusChange={(bonus: number) => updateAttribute(attr.id, { bonus })}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
});

export default AttributesGrid;
