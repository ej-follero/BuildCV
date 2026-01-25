import { useState, useEffect, useCallback } from 'react';
import { FieldArrayWithId, UseFieldArrayMove } from 'react-hook-form';

/**
 * Interface for drag items that must have an id property
 */
export interface DragItem {
  id: string;
  index?: number;
}

/**
 * Reorders an array by moving an item from startIndex to endIndex
 * @param list - The array to reorder
 * @param startIndex - The index of the item to move
 * @param endIndex - The target index for the item
 * @returns A new array with the item reordered
 */
export function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/**
 * Reorders an array of items with id property by moving an item from startIndex to endIndex
 * @param items - The array of items with id property
 * @param startIndex - The index of the item to move
 * @param endIndex - The target index for the item
 * @returns A new array with the item reordered
 */
export function reorderById<T extends DragItem>(
  items: T[],
  startIndex: number,
  endIndex: number
): T[] {
  return reorder(items, startIndex, endIndex);
}

/**
 * Finds the index of an item in an array by its id
 * @param items - The array to search
 * @param id - The id to find
 * @returns The index of the item, or -1 if not found
 */
export function findIndexById<T extends DragItem>(items: T[], id: string): number {
  return items.findIndex((item) => item.id === id);
}

/**
 * Syncs the order of items with react-hook-form's useFieldArray
 * @param newOrder - The new order of items
 * @param fields - The current fields from useFieldArray
 * @param move - The move function from useFieldArray
 */
export function syncFieldArrayOrder<T extends DragItem>(
  newOrder: T[],
  fields: Array<FieldArrayWithId<T, any, any>>,
  move: UseFieldArrayMove
): void {
  newOrder.forEach((item, newIndex) => {
    const currentIndex = fields.findIndex((field) => field.id === item.id);
    if (currentIndex !== -1 && currentIndex !== newIndex) {
      move(currentIndex, newIndex);
    }
  });
}

/**
 * Hook for managing drag and drop state with react-hook-form
 * @param fields - The fields from useFieldArray
 * @param move - The move function from useFieldArray
 * @returns An object with items state and handleReorder function
 */
export function useDragDrop<T extends DragItem>(
  fields: Array<FieldArrayWithId<T, any, any>>,
  move: UseFieldArrayMove
) {
  const [items, setItems] = useState<T[]>(fields as T[]);

  // Sync items when fields change (e.g., when items are added/removed)
  useEffect(() => {
    setItems(fields as T[]);
  }, [fields]);

  const handleReorder = useCallback(
    (newOrder: T[]) => {
      setItems(newOrder);
      syncFieldArrayOrder(newOrder, fields, move);
    },
    [fields, move]
  );

  return {
    items,
    setItems,
    handleReorder,
  };
}

/**
 * Creates a handler for framer-motion's Reorder component
 * @param handleReorder - The reorder handler function
 * @returns A function that can be passed to Reorder.Group's onReorder prop
 */
export function createReorderHandler<T extends DragItem>(
  handleReorder: (newOrder: T[]) => void
) {
  return (newOrder: T[]) => {
    handleReorder(newOrder);
  };
}

/**
 * Validates that all items in an array have unique ids
 * @param items - The array of items to validate
 * @returns true if all items have unique ids, false otherwise
 */
export function validateUniqueIds<T extends DragItem>(items: T[]): boolean {
  const ids = items.map((item) => item.id);
  return ids.length === new Set(ids).size;
}

/**
 * Gets the next valid index for a drag operation
 * @param currentIndex - The current index
 * @param targetIndex - The target index
 * @param listLength - The length of the list
 * @returns The next valid index
 */
export function getNextValidIndex(
  currentIndex: number,
  targetIndex: number,
  listLength: number
): number {
  if (targetIndex < 0) return 0;
  if (targetIndex >= listLength) return listLength - 1;
  return targetIndex;
}
