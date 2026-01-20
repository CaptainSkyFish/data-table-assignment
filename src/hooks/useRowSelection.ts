import { useState, useCallback, useMemo } from 'react';
import type Artworks from '../types/artworks';

type ID = number;

function setsEqual<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) return false;
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}

interface UseRowSelectionReturn {
  selectedIds: Set<ID>;
  bulkSelectCount: number;
  selectedCount: number;
  isInBulkMode: boolean;
  clearSelection: () => void;
  selectRows: (count: number) => void;
  handleSelectionChange: (currentPageItems: Artworks[], firstOffset: number, newSelection: Artworks[]) => void;
  handleAllRowsSelect: (currentPageItems: Artworks[], firstOffset: number) => void;
  handleAllRowsUnselect: (currentPageItems: Artworks[], firstOffset: number) => void;
  isRowSelected: (item: Artworks, position: number) => boolean;
  excludedRowPositions: Set<number>;
}

export function useRowSelection(): UseRowSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<ID>>(new Set());
  const [bulkSelectCount, setBulkSelectCount] = useState(0);
  const [excludedRowPositions, setExcludedRowPositions] = useState<Set<number>>(new Set());

  const isInBulkMode = useMemo(() => bulkSelectCount > 0, [bulkSelectCount]);

  const isRowSelected = useCallback((item: Artworks, position: number): boolean => {
    if (bulkSelectCount > 0) {
      if (position < bulkSelectCount) {
        return !excludedRowPositions.has(position);
      }
      return selectedIds.has(item.id);
    }
    return selectedIds.has(item.id);
  }, [bulkSelectCount, excludedRowPositions, selectedIds]);

  const selectedCount = useMemo(() => {
    if (bulkSelectCount > 0) {
      return Math.max(0, bulkSelectCount - excludedRowPositions.size) + 
             [...selectedIds].filter(id => id >= bulkSelectCount).length;
    }
    return selectedIds.size;
  }, [bulkSelectCount, excludedRowPositions.size, selectedIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setBulkSelectCount(0);
    setExcludedRowPositions(new Set());
  }, []);

  const selectRows = useCallback((count: number) => {
    setBulkSelectCount(count);
    setExcludedRowPositions(new Set());
    setSelectedIds(new Set());
  }, []);

  const handleSelectionChange = useCallback((
    currentPageItems: Artworks[],
    firstOffset: number,
    newSelection: Artworks[]
  ) => {
    const newSelectionIds = new Set(newSelection.map(item => item.id));
    
    const expectedSelection = currentPageItems.filter((item, index) => 
      isRowSelected(item, firstOffset + index)
    );
    const expectedIds = new Set(expectedSelection.map(item => item.id));
    
    if (setsEqual(newSelectionIds, expectedIds)) {
      return;
    }
    
    if (bulkSelectCount > 0) {
      currentPageItems.forEach((item, index) => {
        const position = firstOffset + index;
        const inRange = position < bulkSelectCount;
        const isNowSelected = newSelectionIds.has(item.id);

        if (inRange) {
          if (!isNowSelected) {
            setExcludedRowPositions(prev => new Set(prev).add(position));
          } else {
            setExcludedRowPositions(prev => {
              const next = new Set(prev);
              next.delete(position);
              return next;
            });
          }
        } else {
          if (isNowSelected) {
            setSelectedIds(prev => new Set(prev).add(item.id));
          } else {
            setSelectedIds(prev => {
              const next = new Set(prev);
              next.delete(item.id);
              return next;
            });
          }
        }
      });
    } else {
      // MANUAL MODE: intelligently merge selections across pages
      const inPageIds = new Set(currentPageItems.map(item => item.id));
      
      setSelectedIds(prev => {
        const next = new Set(prev);
        
        // Remove items from current page (will be re-added below)
        for (const id of next) {
          if (inPageIds.has(id)) next.delete(id);
        }
        
        // Add new selection for current page
        for (const item of newSelection) {
          next.add(item.id);
        }
        
        return next;
      });
    }
  }, [bulkSelectCount, isRowSelected]);

  const handleAllRowsSelect = useCallback((currentPageItems: Artworks[], firstOffset: number) => {
    const allAlreadySelected = currentPageItems.every((item, index) => 
      isRowSelected(item, firstOffset + index)
    );
    if (allAlreadySelected) return;
    
    currentPageItems.forEach((item, index) => {
      const position = firstOffset + index;

      setExcludedRowPositions(prev => {
        const next = new Set(prev);
        next.delete(position);
        return next;
      });

      if (position >= bulkSelectCount) {
        setSelectedIds(prev => new Set(prev).add(item.id));
      }
    });
  }, [bulkSelectCount, isRowSelected]);

  const handleAllRowsUnselect = useCallback((currentPageItems: Artworks[], firstOffset: number) => {
    const noneSelected = currentPageItems.every((item, index) => 
      !isRowSelected(item, firstOffset + index)
    );
    if (noneSelected) return;
    
    currentPageItems.forEach((item, index) => {
      const position = firstOffset + index;

      if (position < bulkSelectCount) {
        setExcludedRowPositions(prev => new Set(prev).add(position));
      } else {
        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }
    });
  }, [bulkSelectCount, isRowSelected]);

  return {
    selectedIds,
    bulkSelectCount,
    selectedCount,
    isInBulkMode,
    clearSelection,
    selectRows,
    handleSelectionChange,
    handleAllRowsSelect,
    handleAllRowsUnselect,
    isRowSelected,
    excludedRowPositions,
  };
}
