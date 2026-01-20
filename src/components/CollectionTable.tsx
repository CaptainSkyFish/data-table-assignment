import { DataTable } from 'primereact/datatable';
import type { DataTableSelectAllChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectionOverlay } from './SelectionOverlay';
import type Artworks from '../types/artworks';

interface CollectionTableProps {
  items: Artworks[];
  loading: boolean;
  totalRecords: number;
  selectedCount: number;
  isInBulkMode: boolean;
  selectRows: (count: number) => void;
  clearSelection: () => void;
  handleSelectionChange: (currentPageItems: Artworks[], firstOffset: number, newSelection: Artworks[]) => void;
  handleAllRowsSelect: (currentPageItems: Artworks[], firstOffset: number) => void;
  handleAllRowsUnselect: (currentPageItems: Artworks[], firstOffset: number) => void;
  currentPageSelection: Artworks[];
  selectAllState: boolean | undefined;
  first: number;
}

export const CollectionTable = ({
  items,
  loading,
  totalRecords,
  selectedCount,
  isInBulkMode,
  selectRows,
  clearSelection,
  handleSelectionChange,
  handleAllRowsSelect,
  handleAllRowsUnselect,
  currentPageSelection,
  selectAllState,
  first,
}: CollectionTableProps) => {
  const handleSelectAllChange = (e: DataTableSelectAllChangeEvent) => {
    if (e.checked) {
      handleAllRowsSelect(items, first);
    } else {
      handleAllRowsUnselect(items, first);
    }
  };

  return (
    <DataTable
      value={items}
      dataKey="id"
      loading={loading}
      selection={currentPageSelection}
      onSelectionChange={(e) => handleSelectionChange(items, first, e.value || [])}
      onSelectAllChange={handleSelectAllChange}
      selectAll={selectAllState}
      tableStyle={{ minWidth: '50rem' }}
      selectionMode="multiple"
      compareSelectionBy="deepEquals"
    >
      <Column
        selectionMode="multiple"
        header={
          <SelectionOverlay
            selectRows={selectRows}
            clearSelection={clearSelection}
            selectedCount={selectedCount}
            isInBulkMode={isInBulkMode}
            totalRecords={totalRecords}
          />
        }
        headerStyle={{ width: '5%' }}
      />
      <Column field="title" header="TITLE" className='title-cell' style={{ width: '25%' }} />
      <Column field="place_of_origin" header="PLACE OF ORIGIN" style={{ width: '10%' }} />
      <Column field="artist_display" header="ARTIST" style={{ width: '25%' }} />
      <Column field="inscriptions" header="INSCRIPTIONS" style={{ width: '25%' }} />
      <Column field="date_start" header="START DATE" style={{ width: '5%' }} />
      <Column field="date_end" header="END DATE" style={{ width: '5%' }} />
    </DataTable>
  );
};
