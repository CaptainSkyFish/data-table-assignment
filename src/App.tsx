import './App.css';
import { useState, useEffect } from 'react';
import { DataTable, type DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getArtworks } from './lib/api';
import type { Artworks } from './types/artworks';
import { InputSwitch } from 'primereact/inputswitch';
import { DataTableSkeleton } from './components/DataTableSkeleton';
import { SelectionOverlay } from './components/SelectionOverlay';

function App() {
  const [artworks, setArtworks] = useState<Artworks[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtworks, setSelectedArtworks] = useState<Artworks[]>([]);
  const [rowClick, setRowClick] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    fetchArtworks();
  }, [first, rows]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const page = Math.floor(first / rows) + 1;
      const res = await getArtworks(page, rows);
      setArtworks(res.data);
      setTotalRecords(res.pagination.total);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRows = (count: number) => {
    const rowsToAdd = artworks.slice(0, Math.min(count, artworks.length));
    setSelectedArtworks(rowsToAdd);
  };

  const handleClearAll = () => {
    setSelectedArtworks([]);
  };


  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (

    <div className="card">

      <div className='mb-1 p-1' >
        <h3>Selected {selectedArtworks.length} of {rows} </h3>
      </div>

      <div className="flex justify-end items-center mb-4 gap-2" style={{ marginBottom: '1rem' }}>
        <InputSwitch
          inputId="input-rowclick"
          checked={rowClick}
          onChange={(e) => setRowClick(e.value)}
        />
        <label htmlFor="input-rowclick">Row Click Selection</label>
      </div>
      {loading ? <DataTableSkeleton rows={rows} /> :
        <DataTable<Artworks[]>
          value={artworks}
          selection={selectedArtworks}
          onSelectionChange={(e: DataTableSelectionMultipleChangeEvent<Artworks[]>) => setSelectedArtworks(e.value)}
          selectionMode={rowClick ? null : 'checkbox'}
          dataKey="id"
          paginator
          loading={loading}
          lazy
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPage={onPageChange}
          rowsPerPageOptions={[12, 24, 50, 100]}
          tableStyle={{ minWidth: '50rem' }}
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} artworks"
        >
          <Column
            selectionMode="multiple"
            header={<SelectionOverlay artworks={artworks} onSelect={handleSelectRows} onClearAll={handleClearAll} />}
            headerStyle={{ width: '3rem' }} />
          <Column field="title" header="Title" className='font-semibold' style={{ width: '30%' }} />
          <Column field="place_of_origin" header="Place of Origin" style={{ width: '10%' }} />
          <Column field="artist_display" header="Artist" style={{ width: '25%' }} />
          <Column field="inscriptions" header="Inscriptions" style={{ width: '25%' }} />
          <Column field="date_start" header="Start Date" style={{ width: '5%' }} />
          <Column field="date_end" header="End Date" style={{ width: '5%' }} />
        </DataTable>
      }
    </div >
  );
}

export default App
