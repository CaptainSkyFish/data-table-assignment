import { createContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type Artworks from '../types/artworks';

type ID = number;

function setAdd<T>(set: Set<T>, item: T): Set<T> {
  const next = new Set(set);
  next.add(item);
  return next;
}

function setDelete<T>(set: Set<T>, item: T): Set<T> {
  const next = new Set(set);
  next.delete(item);
  return next;
}

function setsEqual<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) return false;
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}

interface SelectionContextValue {
  manualSelectionRowIds: Set<ID>;
  bulkSelectionRowIds: number;
  excludedRowIds: Set<number>;
  count: number;
  isBulkMode: boolean;
  onToggle: (items: Artworks[], first: number, newSelection: Artworks[]) => void;
  selectAll: (items: Artworks[], first: number) => void;
  unselectAll: (items: Artworks[], first: number) => void;
  selectRows: (count: number) => void;
  clearSelection: () => void;
  isSelected: (item: Artworks, position: number) => boolean;
  getSelectedRows: (items: Artworks[], first: number) => Artworks[];
  getSelectAllState: (items: Artworks[], first: number) => boolean | undefined;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export { SelectionContext };

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [manualSelectionRowIds, setManualSelections] = useState<Set<ID>>(() => new Set());
  const [bulkSelectionRowIds, setBulkSize] = useState(0);
  const [excludedRowIds, setExclusions] = useState<Set<number>>(() => new Set());

  const isBulkMode = bulkSelectionRowIds > 0;

  const count = useMemo(() => {
    if (bulkSelectionRowIds > 0) {
      return Math.max(0, bulkSelectionRowIds - excludedRowIds.size) +
             [...manualSelectionRowIds].filter(id => id >= bulkSelectionRowIds).length;
    }
    return manualSelectionRowIds.size;
  }, [bulkSelectionRowIds, excludedRowIds.size, manualSelectionRowIds]);

  const isSelected = useCallback((item: Artworks, position: number): boolean => {
    if (bulkSelectionRowIds > 0 && position < bulkSelectionRowIds) {
      return !excludedRowIds.has(position);
    }
    return manualSelectionRowIds.has(item.id);
  }, [bulkSelectionRowIds, excludedRowIds, manualSelectionRowIds]);

  const getSelectedRows = useCallback((items: Artworks[], first: number): Artworks[] => {
    return items.filter((item, index) => isSelected(item, first + index));
  }, [isSelected]);

  const getSelectAllState = useCallback((items: Artworks[], first: number): boolean | undefined => {
    if (items.length === 0) return false;
    const allSelected = items.every((item, index) => isSelected(item, first + index));
    const noneSelected = items.every((item, index) => !isSelected(item, first + index));
    if (allSelected) return true;
    if (noneSelected) return false;
    return undefined;
  }, [isSelected]);

  const toggleInBulkMode = useCallback((
    items: Artworks[],
    first: number,
    newSelectionIds: Set<ID>
  ) => {
    items.forEach((item, index) => {
      const position = first + index;
      const inRange = position < bulkSelectionRowIds;
      const isNowSelected = newSelectionIds.has(item.id);

      if (inRange) {
        setExclusions(prev => isNowSelected ? setDelete(prev, position) : setAdd(prev, position));
      } else {
        setManualSelections(prev => isNowSelected ? setAdd(prev, item.id) : setDelete(prev, item.id));
      }
    });
  }, [bulkSelectionRowIds]);

  const updateBulkSelections = useCallback((
    items: Artworks[],
    first: number,
    shouldSelect: boolean
  ) => {
    items.forEach((item, index) => {
      const position = first + index;
      const isInRange = position < bulkSelectionRowIds;

      if (isInRange) {
        setExclusions(prev => shouldSelect ? setDelete(prev, position) : setAdd(prev, position));
      } else if (shouldSelect) {
        setManualSelections(prev => setAdd(prev, item.id));
      } else {
        setManualSelections(prev => setDelete(prev, item.id));
      }
    });
  }, [bulkSelectionRowIds]);

  const onToggle = useCallback((items: Artworks[], first: number, newSelection: Artworks[]) => {
    const newSelectionIds = new Set(newSelection.map(item => item.id));

    const expectedSelection = items.filter((item, index) =>
      isSelected(item, first + index)
    );
    const expectedIds = new Set(expectedSelection.map(item => item.id));

    if (setsEqual(newSelectionIds, expectedIds)) {
      return;
    }

    if (bulkSelectionRowIds > 0) {
      toggleInBulkMode(items, first, newSelectionIds);
    } else {
      const inPageIds = new Set(items.map(item => item.id));
      setManualSelections(prev => {
        const next = new Set(prev);
        for (const id of next) {
          if (inPageIds.has(id)) next.delete(id);
        }
        for (const item of newSelection) {
          next.add(item.id);
        }
        return next;
      });
    }
  }, [bulkSelectionRowIds, isSelected, toggleInBulkMode]);

  const selectAll = useCallback((items: Artworks[], first: number) => {
    const allAlreadySelected = items.every((item, index) =>
      isSelected(item, first + index)
    );
    if (allAlreadySelected) return;
    updateBulkSelections(items, first, true);
  }, [isSelected, updateBulkSelections]);

  const unselectAll = useCallback((items: Artworks[], first: number) => {
    const noneSelected = items.every((item, index) =>
      !isSelected(item, first + index)
    );
    if (noneSelected) return;
    updateBulkSelections(items, first, false);
  }, [isSelected, updateBulkSelections]);

  const selectRows = useCallback((count: number) => {
    setBulkSize(count);
    setExclusions(() => new Set());
    setManualSelections(() => new Set());
  }, []);

  const clearSelection = useCallback(() => {
    setManualSelections(() => new Set());
    setBulkSize(0);
    setExclusions(() => new Set());
  }, []);

  const value: SelectionContextValue = {
    manualSelectionRowIds,
    bulkSelectionRowIds,
    excludedRowIds,
    count,
    isBulkMode,
    onToggle,
    selectAll,
    unselectAll,
    selectRows,
    clearSelection,
    isSelected,
    getSelectedRows,
    getSelectAllState,
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}
