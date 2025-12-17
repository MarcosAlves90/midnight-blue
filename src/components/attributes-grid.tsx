"use client";

import { memo, useState, useEffect, useCallback } from "react";
import { Edit3, Lock } from "lucide-react";
import { AttributeCard } from "./attributes-grid/attribute-card";
import { AttributesGridProps, Attribute } from "./attributes-grid/types";
import {
  DEFAULT_INPUT_LIMITS,
  INITIAL_ATTRIBUTES,
} from "./attributes-grid/constants";
import { useAttributesContext } from "@/contexts/AttributesContext";

export const AttributesGrid = memo(function AttributesGrid({
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
  const { attributes, setAttributes } = useAttributesContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isEditable = editable && isEditMode && !disabled;

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  const updateAttribute = useCallback(
    (id: string, changes: Partial<Attribute>) => {
      setAttributes((prev) =>
        prev.map((attr) => (attr.id === id ? { ...attr, ...changes } : attr)),
      );
    },
    [setAttributes],
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
      <div className="bg-muted/50 rounded-xl p-6">
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
    <div className="bg-muted/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Atributos</h3>
        <button
          onClick={toggleEditMode}
          className={`p-2 rounded cursor-pointer transition-all duration-200 ${
            isEditMode
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30"
          }`}
          title={
            isEditMode ? "Desativar modo de edição" : "Ativar modo de edição"
          }
          aria-label={
            isEditMode ? "Desativar modo de edição" : "Ativar modo de edição"
          }
          aria-pressed={isEditMode}
        >
          {isEditMode ? (
            <Edit3 className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
        </button>
      </div>

      {renderCards()}
    </div>
  );
});

export default AttributesGrid;
