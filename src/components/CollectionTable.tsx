import { DataTable } from 'primereact/datatable';
import type { DataTableSelectAllChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectionOverlay } from './SelectionOverlay';
import type Artworks from '../types/artworks';
import { useSelection } from '../hooks/useSelection';

interface CollectionTableProps {
  items: Artworks[];
  loading: boolean;
  totalRecords: number;
  first: number;
}

export const CollectionTable = ({
  items,
  loading,
  totalRecords,
  first,
}: CollectionTableProps) => {
  const { 
    getSelectedRows, 
    getSelectAllState, 
    onToggle, 
    selectAll, 
    unselectAll,
  } = useSelection();

  const currentPageSelection = getSelectedRows(items, first);
  const selectAllState = getSelectAllState(items, first);

  const handleSelectAllChange = (e: DataTableSelectAllChangeEvent) => {
    if (e.checked) {
      selectAll(items, first);
    } else {
      unselectAll(items, first);
    }
  };

  return (
    <DataTable
      value={items}
      dataKey="id"
      loading={loading}
      selection={currentPageSelection}
      onSelectionChange={(e) => onToggle(items, first, e.value || [])}
      onSelectAllChange={handleSelectAllChange}
      selectAll={selectAllState}
      tableStyle={{ minWidth: '50rem' }}
      selectionMode="multiple"
      compareSelectionBy="deepEquals"
    >
      <Column
        selectionMode="multiple"
        header={
          <SelectionOverlay totalRecords={totalRecords} />
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
