import './App.css';
import { CollectionTableSkeleton } from './components/CollectionTableSkeleton';
import { TablePaginator } from './components/TablePaginator';
import { useCollection } from './hooks/useCollection';
import { CollectionTable } from './components/CollectionTable';
import { useRowSelection } from './hooks/useRowSelection';

function App() {
  const {
    items,
    loading,
    first,
    rows,
    totalRecords,
    onPageChange,
  } = useCollection();

  const { isRowSelected, setSelectFirstN } = useRowSelection();

  return (
    <div className="card">
      <div className="flex justify-between mb-1 p-1">
        <h3>
          Selected {} of {totalRecords}
        </h3>
      </div>

      {loading ? (
        <CollectionTableSkeleton rows={rows} />
      ) : (
        <CollectionTable
          items={items}
          loading={loading}
          isRowSelected={isRowSelected}
          setSelectFirstN={setSelectFirstN}
          // toggleRow={toggleRow}
          // selectRows={selectRows}
          // clearSelection={clearSelection}
        />
      )}

      <TablePaginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />
    </div>
  );
}



export default App
