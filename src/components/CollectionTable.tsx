import { DataTable, type DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectionOverlay } from './SelectionOverlay';
import type Artworks from '../types/artworks';
import type { ID } from '../hooks/useCollection';
import { useEffect, useMemo, useState } from 'react';


interface CollectionTableProps {
  items: Artworks[];
  loading: boolean;
  isRowSelected: (id: ID, position?: number) => boolean;
  setSelectFirstN: number;
  // toggleRow: (id: ID, checked: boolean) => void;
  // selectRows: (count: number) => void;
  // clearSelection: () => void;
}

export const CollectionTable = ({
  items,
  loading,
  isRowSelected,
  setSelectFirstN
  // selectRows,
  // clearSelection
}: CollectionTableProps) => {
  const selectedRows = useMemo(
    () => items.filter((row, i) => isRowSelected(row.id, i)),
    [items, isRowSelected]
  );  
  const setSelectedRows = (rows: Artworks[]) => {
    // user manually selected rows on current page
    const next = new Set<ID>();
    rows.forEach(r => next.add(r.id));
  
    setMode('manual');        // or 'page'
    setSelectFirstN(0);
    setDeselectedIds(new Set());
    setSelectedIds(next);
  };


  return (
    <DataTable<Artworks[]>
    value={items}
    selection={selectedRows}
    onSelectionChange={(e: DataTableSelectionMultipleChangeEvent<Artworks[]>) => setSelectedItems(e.value)}
    selectionMode={'checkbox'}
    dataKey="id"
    loading={loading}
    tableStyle={{ minWidth: '50rem' }}
  >
    <Column
      selectionMode="multiple"
      // header={
        // <SelectionOverlay
          // selectRows={selectRows}
          // clearSelection={clearSelection}
        // />}
        headerStyle={{ width: '5%' }} />
      <Column field="title" header="TITLE"style={{ width: '25%' }}  />
      <Column field="place_of_origin" header="PLACE OF ORIGIN"style={{ width: '10%' }}  />
      <Column field="artist_display" header="ARTIST"style={{ width: '25%' }}  />
      <Column field="inscriptions" header="INSCRIPTIONS" />
      <Column field="date_start" header="START DATE"style={{ width: '5%' }}  />
      <Column field="date_end" header="END DATE"style={{ width: '5%' }}  />
    </DataTable >
  );
};

