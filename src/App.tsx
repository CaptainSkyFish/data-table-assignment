import './App.css';
import { InputSwitch } from 'primereact/inputswitch';
import { CollectionTableSkeleton } from './components/CollectionTableSkeleton.tsx';
import { TablePaginator } from './components/TablePaginator';
import { useCollection } from './hooks/useCollection.ts';
import { CollectionTable } from './components/CollectionTable.tsx';

function App() {
  const {
    items,
    selectedItems,
    loading,
    rowClick,
    setRowClick,
    rows,
    first,
    totalRecords,
    setSelectedItems,
    onPageChange,
    clearSelection,
    selectRows
  } = useCollection();


  return (
    <div className="card">
      <div className='flex justify-between mb-1 p-1' >
        <h3>Selected {selectedItems.length} of {rows} </h3>

        <div className="flex justify-end items-center mb-4 gap-2" style={{ marginBottom: '1rem' }}>
          <InputSwitch
            inputId="input-rowclick"
            checked={rowClick}
            onChange={(e) => setRowClick(e.value)}
          />
          <label htmlFor="input-rowclick">Row Click Selection</label>
        </div>
      </div>
      {loading ?
        <CollectionTableSkeleton rows={rows} /> :
        <CollectionTable
          items={items}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          loading={loading}
          rowClick={rowClick}
          selectRows={selectRows}
          clearSelection={clearSelection}
        />
      }
      <TablePaginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />
    </div >
  );
}

export default App
