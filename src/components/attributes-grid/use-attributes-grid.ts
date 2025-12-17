import { useState, useCallback } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

// Função pura para mover item em array
export function moveItemById<T extends { id: string }>(
  items: T[],
  fromId: string,
  toId: string,
): T[] {
  const oldIndex = items.findIndex((item) => item.id === fromId);
  const newIndex = items.findIndex((item) => item.id === toId);
  if (oldIndex === -1 || newIndex === -1) return items;
  return arrayMove(items, oldIndex, newIndex);
}

// Função pura para atualizar item por id
export function updateItemById<T extends { id: string }>(
  items: T[],
  id: string,
  updates: Partial<T>,
): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...updates } : item));
}

// Hook genérico para grids ordenáveis
export function useGenericGrid<T extends { id: string }>(
  initialItems: T[],
  onChange?: (items: T[]) => void,
) {
  const [items, setItems] = useState<T[]>(initialItems);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id && over) {
        setItems((prev) => {
          const newItems = moveItemById(
            prev,
            active.id as string,
            over.id as string,
          );
          onChange?.(newItems);
          return newItems;
        });
      }
    },
    [onChange],
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<T>) => {
      setItems((prev) => {
        const newItems = updateItemById(prev, id, updates);
        onChange?.(newItems);
        return newItems;
      });
    },
    [onChange],
  );

  return {
    items,
    setItems,
    handleDragEnd,
    updateItem,
  };
}
