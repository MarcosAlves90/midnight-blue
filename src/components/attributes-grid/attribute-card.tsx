"use client";

import { useState } from "react";

interface AttributeCardProps {
    name: string;
    abbreviation: string;
    borderColor: string;
}

export default function AttributeCard({
    name,
    abbreviation,
    borderColor,
}: AttributeCardProps) {
    const [baseValue, setBaseValue] = useState(0);
    const [bonus, setBonus] = useState(0);

    const total = baseValue + bonus;

    return (
        <div 
            className={`bg-muted/50 rounded p-3 space-y-2 border-t-4 ${borderColor}`}>
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
                    value={bonus}
                    onChange={(e) => setBonus(Number(e.target.value) || 0)}
                    className="w-full text-center text-sm font-medium px-1 py-0.5 bg-purple-500/30 rounded transition-colors duration-200 focus:bg-purple-500/40 border-0 outline-none"
                />
            </div>
        </div>
    );
}
