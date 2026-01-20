import './App.css';
import { CollectionTableSkeleton } from './components/CollectionTableSkeleton.tsx';
import { TablePaginator } from './components/TablePaginator';
import { useCollection } from './hooks/useCollection.ts';
import { CollectionTable } from './components/CollectionTable.tsx';
import { SelectionProvider } from './context/SelectionContext';
import { useSelection } from './hooks/useSelection';

function AppContent() {
  const {
    items,
    loading,
    first,
    rows,
    totalRecords,
    onPageChange,
  } = useCollection();

  const { count } = useSelection();

  return (
    <div className="card">
      <div className=' mb-1 p-1' >
        <h3>Selected {count} of {totalRecords} </h3>
      </div>
      {loading ?
        <CollectionTableSkeleton rows={rows} /> :
        <CollectionTable
          items={items}
          loading={loading}
          totalRecords={totalRecords}
          first={first}
        />
      }
      <TablePaginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />
    </div>
  );
}

function App() {
  return (
    <SelectionProvider>
      <AppContent />
    </SelectionProvider>
  );
}

export default App
