"use client";

import { useState, useCallback, memo } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
    restrictToParentElement,
} from "@dnd-kit/modifiers";
import AttributeCard from "./attributes-grid/attribute-card";

const INITIAL_ATTRIBUTES = [
    { id: "FOR", name: "Força", abbreviation: "FOR", borderColor: "border-t-red-500", value: 0, bonus: 0 },
    { id: "DES", name: "Destreza", abbreviation: "DES", borderColor: "border-t-yellow-500", value: 0, bonus: 0 },
    { id: "VIG", name: "Vigor", abbreviation: "VIG", borderColor: "border-t-green-500", value: 0, bonus: 0 },
    { id: "INT", name: "Inteligência", abbreviation: "INT", borderColor: "border-t-blue-500", value: 0, bonus: 0 },
    { id: "PRE", name: "Presença", abbreviation: "PRE", borderColor: "border-t-purple-500", value: 0, bonus: 0 },
];

type Attribute = typeof INITIAL_ATTRIBUTES[number];

const AttributesGrid = memo(function AttributesGrid() {
    const [attributes, setAttributes] = useState<Attribute[]>(INITIAL_ATTRIBUTES);
    
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id && over) {
            setAttributes((items: Attribute[]) => {
                const oldIndex = items.findIndex((item: Attribute) => item.id === active.id);
                const newIndex = items.findIndex((item: Attribute) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }, []);

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
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
});

export default AttributesGrid;
