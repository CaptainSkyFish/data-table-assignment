import './App.css';
import { CollectionTableSkeleton } from './components/CollectionTableSkeleton.tsx';
import { TablePaginator } from './components/TablePaginator';
import { useCollection } from './hooks/useCollection.ts';
import { CollectionTable } from './components/CollectionTable.tsx';
import { SelectionProvider } from './context/SelectionContext';
import { useSelection } from './hooks/useSelection';
import { useTheme } from './hooks/useTheme.ts';
import { Button } from 'primereact/button';

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
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="card">
      <div className='flex  items-center justify-between'><div className=' mb-5' >
        <h3>Selected {count} of {totalRecords} </h3>
      </div>
        <Button
          rounded
          text
          icon={theme === 'light' ? 'pi pi-moon' : 'pi pi-sun'}
          aria-label='theme'
          onClick={toggleTheme}
        />

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
