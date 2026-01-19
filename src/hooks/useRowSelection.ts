import { useState, useCallback, useMemo } from 'react';

export type SelectionMode = 'none' | 'first_n';
export type ID = number | string;

interface UseRowSelectionOptions {
  totalRecords: number;
  getRowPosition?: (id: ID) => number; // Optional: for first_n mode
}

interface UseRowSelectionReturn {
  // States
  mode: SelectionMode;
  selectFirstN: number;
  selectedIds: Set<ID>;
  deselectedIds: Set<ID>;
  // Derived values
  selectedCount: number;
  isRowSelected: (id: ID, position?: number) => boolean;
  // Actions
  toggleRow: (id: ID, checked: boolean, position?: number) => void;
  selectAll: () => void;
  selectFirstNRows: (n: number) => void;
  clearSelection: () => void;
  toggleAllOnPage: (pageIds: ID[], checked: boolean) => void;
}

export const useRowSelection = () => {
  const [ mode, setMode ] = useState<SelectionMode>('none');
  const [deselectedIds, setDeselectedIds] = useState<Set<ID>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<ID>>(new Set());
  const [selectFirstN, setSelectFirstN] = useState(0);

  const isRowSelected = useCallback((id: ID, position?: number): boolean => {
    if (deselectedIds.has(id)) {
      return false;
    }
    
    if (selectedIds.has(id)) {
      return true;
    }
    
    // if (mode === 'all') {
    //   return true;
    // }
    if (mode === 'first_n' && position !== undefined && position < selectFirstN) {
      return true;
    }
    
    return false;
  }, [mode, selectFirstN, selectedIds, deselectedIds]);

  const clearSelection = () => {
    setMode('none')
    setSelectFirstN(0)
    setSelectedIds(new Set<ID>())
    setDeselectedIds(new Set<ID>())
  }

  return {isRowSelected, setSelectFirstN, clearSelection}

  
};
