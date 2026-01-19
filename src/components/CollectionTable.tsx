import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import type { DataTableSelectionMultipleChangeEvent, DataTableSelectAllChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectionOverlay } from './SelectionOverlay';
import type Artworks from '../types/artworks';

interface CollectionTableProps {
  items: Artworks[];
  loading: boolean;
  onSelectionChange: (selection: Artworks[], first: number) => void;
  onSelectAllChange: (isAllSelected: boolean, currentPageItems: Artworks[]) => void;
  selectRows: (count: number) => void;
  clearSelection: () => void;
  selectedCount?: number;
  bulkSelectCount?: number;
  currentPageSelection: Artworks[];
  isInBulkMode: boolean;
  first: number;
  isAllCurrentPageSelected: boolean;
}

export const CollectionTable = ({
  items,
  loading,
  onSelectionChange,
  onSelectAllChange,
  selectRows,
  clearSelection,
  selectedCount,
  bulkSelectCount,
  currentPageSelection,
  isInBulkMode,
  first,
  isAllCurrentPageSelected,
}: CollectionTableProps) => {
  const [localSelection, setLocalSelection] = useState<Artworks[]>([]);
  const prevItemsRef = useRef<Artworks[]>([]);
  const prevBulkSelectCountRef = useRef(0);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalSelection(currentPageSelection);
      prevItemsRef.current = items;
      prevBulkSelectCountRef.current = bulkSelectCount || 0;
      isInitializedRef.current = true;
      return;
    }

    const itemsChanged = items.length !== prevItemsRef.current.length ||
      items.some((item, idx) => prevItemsRef.current[idx]?.id !== item.id);
    
    const bulkCountChanged = bulkSelectCount !== prevBulkSelectCountRef.current;
    
    if (itemsChanged || bulkCountChanged) {
      setLocalSelection(currentPageSelection);
      prevItemsRef.current = items;
      prevBulkSelectCountRef.current = bulkSelectCount || 0;
    }
  }, [items, bulkSelectCount, currentPageSelection]);

  const handleSelectionChange = (e: DataTableSelectionMultipleChangeEvent<Artworks[]>) => {
    setLocalSelection(e.value || []);
    onSelectionChange(e.value || [], first);
  };

  const handleSelectAllChange = (e: DataTableSelectAllChangeEvent) => {
    if (e.checked) {
      onSelectAllChange(true, items);
    } else {
      onSelectAllChange(false, items);
    }
  };

  return <DataTable
    value={items}
    dataKey="id"
    loading={loading}
    selection={localSelection}
    onSelectionChange={handleSelectionChange}
    selectAll={isAllCurrentPageSelected}
    onSelectAllChange={handleSelectAllChange}
    tableStyle={{ minWidth: '50rem' }}
    selectionMode="multiple"
  >

    <Column
      selectionMode="multiple"
      header={
        <SelectionOverlay
          selectRows={selectRows}
          clearSelection={clearSelection}
          selectedCount={selectedCount}
          isInBulkMode={isInBulkMode}
        />}
      headerStyle={{ width: '5%' }} />
    
    <Column field="title" header="TITLE" className='title-cell' style={{ width: '25%' }} />
    <Column field="place_of_origin" header="PLACE OF ORIGIN" style={{ width: '10%' }} />
    <Column field="artist_display" header="ARTIST" style={{ width: '25%' }} />
    <Column field="inscriptions" header="INSCRIPTIONS" style={{ width: '25%' }} />
    <Column field="date_start" header="START DATE" style={{ width: '5%' }} />
    <Column field="date_end" header="END DATE" style={{ width: '5%' }} />
  </DataTable>

};
