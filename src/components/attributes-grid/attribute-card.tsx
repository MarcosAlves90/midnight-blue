"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface AttributeCardProps {
    id: string;
    name: string;
    abbreviation: string;
    borderColor: string;
    value?: number;
    bonus?: number;
}

export default function AttributeCard({
    id,
    name,
    abbreviation,
    borderColor,
    value = 0,
    bonus = 0,
}: AttributeCardProps) {
    const [baseValue, setBaseValue] = useState(value);
    const [bonusValue, setBonusValue] = useState(bonus);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const total = baseValue + bonusValue;

    return (
        <div 
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`bg-muted/50 rounded p-3 space-y-2 border-t-4 ${borderColor} ${
                isDragging ? "opacity-50" : ""
            } relative`}>
            
            <div 
                {...listeners}
                className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1 hover:bg-muted/80 rounded transition-colors"
            >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="text-center">
                <h3 className="text-sm font-medium text-center">{name}</h3>
                <p className="text-xs text-muted-foreground">{abbreviation}</p>
            </div>

            <div className="text-center">
                <div className="text-2xl font-bold">{total}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <input
                    value={baseValue}
                    onChange={(e) => setBaseValue(Number(e.target.value) || 0)}
                    className="w-full text-center text-sm font-medium px-1 py-0.5 bg-primary/10 rounded transition-colors duration-200 focus:bg-primary/15 border-0 outline-none"
                />
                <input
                    value={bonusValue}
                    onChange={(e) => setBonusValue(Number(e.target.value) || 0)}
                    className="w-full text-center text-sm font-medium px-1 py-0.5 bg-purple-500/30 rounded transition-colors duration-200 focus:bg-purple-500/40 border-0 outline-none"
                />
            </div>
        </div>
    );
}
