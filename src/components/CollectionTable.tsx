import { DataTable, type DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectionOverlay } from './SelectionOverlay';
import type Artworks from '../types/artworks';


interface CollectionTableProps {
  items: Artworks[];
  selectedItems: Artworks[];
  rowClick: boolean;
  loading: boolean;
  setSelectedItems: (items: Artworks[]) => void;
  selectRows: (count: number) => void;
  clearSelection: () => void;
}
export const CollectionTable = ({
  items,
  selectedItems,
  loading,
  rowClick,
  setSelectedItems,
  selectRows,
  clearSelection }: CollectionTableProps) => {

  return <DataTable<Artworks[]>
    value={items}
    selection={selectedItems}
    onSelectionChange={(e: DataTableSelectionMultipleChangeEvent<Artworks[]>) => setSelectedItems(e.value)}
    selectionMode={rowClick ? null : 'checkbox'}
    dataKey="id"
    // lazy
    loading={loading}
    tableStyle={{ minWidth: '50rem' }}
  >
    <Column
      selectionMode="multiple"
      header={
        <SelectionOverlay
          artworks={items}
          onSelect={selectRows}
          onClearAll={clearSelection}
        />}
      headerStyle={{ width: '5%' }} />
    <Column field="title" header="Title" style={{ width: '25%' }} />
    <Column field="place_of_origin" header="Place of Origin" style={{ width: '10%' }} />
    <Column field="artist_display" header="Artist" style={{ width: '25%' }} />
    <Column field="inscriptions" header="Inscriptions" style={{ width: '25%' }} />
    <Column field="date_start" header="Start Date" style={{ width: '5%' }} />
    <Column field="date_end" header="End Date" style={{ width: '5%' }} />
  </DataTable>


};

