"use client";

import { memo, useState, useEffect, useCallback } from "react";
import { Lock } from "lucide-react";
import { EditToggle } from "@/components/ui/edit-toggle";
import { Tip } from "@/components/ui/tip";
import { AttributeCard } from "./attribute-card";
import { AttributesGridProps, Attribute } from "./types";
import { DEFAULT_INPUT_LIMITS, INITIAL_ATTRIBUTES } from "./constants";
import { useAttributesContext } from "@/contexts/AttributesContext";

const AttributesGrid = memo(function AttributesGrid({
  disabled = false,
  editable = true,
}: Omit<
  AttributesGridProps,
  | "initialAttributes"
  | "onAttributesChange"
  | "initialBiotypes"
  | "onBiotypesChange"
> = {}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { attributes, updateAttributes } = useAttributesContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isEditable = editable && isEditMode && !disabled;

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  const updateAttribute = useCallback(
    (id: string, changes: Partial<Attribute>) => {
      updateAttributes((prev) =>
        prev.map((attr) => (attr.id === id ? { ...attr, ...changes } : attr)),
      );
    },
    [updateAttributes],
  );

  const renderCards = (forceDisabled = false) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {attributes.map((attr) => {
        const initialAttr = INITIAL_ATTRIBUTES.find((a) => a.id === attr.id);
        return (
          <AttributeCard
            key={attr.id}
            id={attr.id}
            name={attr.name}
            abbreviation={attr.abbreviation}
            color={attr.color}
            value={attr.value}
            bonus={attr.bonus}
            type="attribute"
            description={attr.description || initialAttr?.description}
            disabled={disabled || forceDisabled}
            editable={isEditable && !forceDisabled}
            onValueChange={
              isEditable && !forceDisabled
                ? (value) => updateAttribute(attr.id, { value })
                : undefined
            }
            onBonusChange={
              isEditable && !forceDisabled
                ? (bonus) => updateAttribute(attr.id, { bonus })
                : undefined
            }
            inputLimits={DEFAULT_INPUT_LIMITS}
          />
        );
      })}
    </div>
  );

  if (!mounted) {
    return (
      <div className="bg-muted/50 rounded-none p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Atributos</h3>
          <div className="p-2 rounded bg-muted-foreground/20 text-muted-foreground">
            <Lock className="w-4 h-4" />
          </div>
        </div>
        {renderCards(true)}
      </div>
    );
  }

  return (
    <div className="bg-muted/50 rounded-none p-6 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <Tip
          content={
            <div className="max-w-xs text-xs">
              Todo mundo tem certas habilidades básicas, que dizem o quão forte,
              rápido e esperto você é. Essas habilidades influenciavam a maioria
              das coisas que você pode fazer. Personagens mais fortes podem
              erguer mais peso, personagens mais ágeis se equilibram melhor,
              personagens mais durões conseguem absorver mais dano e assim por
              diante.
            </div>
          }
          side="top"
          align="start"
        >
          <h3 className="text-lg font-semibold cursor-help decoration-dotted underline underline-offset-2">
            Atributos
          </h3>
        </Tip>
        <EditToggle 
          isActive={isEditMode} 
          onToggle={toggleEditMode}
          activeTitle="Desativar modo de edição"
          inactiveTitle="Ativar modo de edição"
        />
      </div>

      {renderCards()}
    </div>
  );
});

export default AttributesGrid;
