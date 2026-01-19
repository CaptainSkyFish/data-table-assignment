import { useState, useCallback, useMemo } from 'react';
import type Artworks from '../types/artworks';

type ID = number;

interface UseRowSelectionReturn {
  selectedIds: Set<ID>;
  excludedIds: Set<ID>;
  bulkSelectCount: number;
  selectedCount: number;
  handleSelectionChange: (newSelection: Artworks[], currentPageItems: Artworks[], first: number) => void;
  handleSelectAllChange: (isAllSelected: boolean, currentPageItems: Artworks[]) => void;
  selectRows: (count: number) => void;
  clearSelection: () => void;
  getCurrentPageSelection: (currentPageItems: Artworks[], first: number) => Artworks[];
  isInBulkMode: boolean;
  isAllCurrentPageSelected: (currentPageItems: Artworks[], first: number) => boolean;
}

export function useRowSelection(): UseRowSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<ID>>(new Set());
  const [excludedIds, setExcludedIds] = useState<Set<ID>>(new Set());
  const [bulkSelectCount, setBulkSelectCount] = useState(0);
  const [selectedRowPositions, setSelectedRowPositions] = useState<Set<number>>(new Set());
  const [excludedRowPositions, setExcludedRowPositions] = useState<Set<number>>(new Set());

  const isInBulkMode = bulkSelectCount > 0;

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setExcludedIds(new Set());
    setBulkSelectCount(0);
    setSelectedRowPositions(new Set());
    setExcludedRowPositions(new Set());
  }, []);

  const selectRows = useCallback((count: number) => {
    setBulkSelectCount(count);
    setExcludedRowPositions(new Set());
    
    const positions = new Set<number>();
    for (let i = 0; i < count; i++) {
      positions.add(i);
    }
    setSelectedRowPositions(positions);
  }, []);

  const handleSelectAllChange = useCallback((isAllSelected: boolean, currentPageItems: Artworks[]) => {
    const currentPageIds = currentPageItems.map(item => item.id);
    
    if (isAllSelected) {
      setBulkSelectCount(0);
      setExcludedIds(new Set());
      setSelectedRowPositions(new Set());
      setExcludedRowPositions(new Set());
      setSelectedIds(prev => {
        const next = new Set(prev);
        currentPageIds.forEach(id => { next.add(id); });
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        currentPageIds.forEach(id => { next.delete(id); });
        return next;
      });
    }
  }, []);

  const handleSelectionChange = useCallback((newSelection: Artworks[], currentPageItems: Artworks[], first: number) => {
    const newSelectionIds = new Set(newSelection.map(item => item.id));
    
    setSelectedIds(prevSelectedIds => {
      const newSelectedIds = new Set(prevSelectedIds);
      
      if (isInBulkMode) {
        currentPageItems.forEach((item, index) => {
          const absolutePosition = first + index;
          const wasSelected = selectedRowPositions.has(absolutePosition);
          const isNowSelected = newSelectionIds.has(item.id);
          
          if (wasSelected && !isNowSelected) {
            newSelectedIds.delete(item.id);
            setExcludedRowPositions(prev => new Set(prev).add(absolutePosition));
          } else if (!wasSelected && isNowSelected) {
            newSelectedIds.add(item.id);
            setExcludedRowPositions(prev => {
              const next = new Set(prev);
              next.delete(absolutePosition);
              return next;
            });
          }
        });
      } else {
        currentPageItems.forEach(item => {
          const wasSelected = prevSelectedIds.has(item.id);
          const isNowSelected = newSelectionIds.has(item.id);
          
          if (isNowSelected && !wasSelected) {
            newSelectedIds.add(item.id);
            setExcludedIds(prev => {
              const next = new Set(prev);
              next.delete(item.id);
              return next;
            });
          } else if (!isNowSelected && wasSelected) {
            newSelectedIds.delete(item.id);
          }
        });
      }
      
      return newSelectedIds;
    });
  }, [isInBulkMode, selectedRowPositions]);

  const getCurrentPageSelection = useCallback((currentPageItems: Artworks[], first: number): Artworks[] => {
    return currentPageItems.filter((item, index) => {
      const absolutePosition = first + index;
      
      if (isInBulkMode) {
        const isSelected = selectedRowPositions.has(absolutePosition);
        const isExcluded = excludedRowPositions.has(absolutePosition);
        return isSelected && !isExcluded;
      }
      
      return selectedIds.has(item.id) && !excludedIds.has(item.id);
    });
  }, [selectedIds, excludedIds, selectedRowPositions, excludedRowPositions, isInBulkMode]);

  const selectedCount = useMemo(() => {
    if (isInBulkMode) {
      return Math.max(0, bulkSelectCount - excludedRowPositions.size);
    }
    return selectedIds.size;
  }, [isInBulkMode, bulkSelectCount, excludedRowPositions.size, selectedIds.size]);

  const isAllCurrentPageSelected = useCallback((currentPageItems: Artworks[], first: number): boolean => {
    if (currentPageItems.length === 0) return false;
    
    return currentPageItems.every((item, index) => {
      const absolutePosition = first + index;
      
      if (isInBulkMode) {
        return selectedRowPositions.has(absolutePosition) && !excludedRowPositions.has(absolutePosition);
      }
      
      return selectedIds.has(item.id) && !excludedIds.has(item.id);
    });
  }, [selectedIds, excludedIds, selectedRowPositions, excludedRowPositions, isInBulkMode]);

  return {
    selectedIds,
    excludedIds,
    bulkSelectCount,
    selectedCount,
    handleSelectionChange,
    handleSelectAllChange,
    selectRows,
    clearSelection,
    getCurrentPageSelection,
    isInBulkMode,
    isAllCurrentPageSelected,
  };
}
