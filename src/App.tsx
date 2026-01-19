import './App.css';
import { CollectionTableSkeleton } from './components/CollectionTableSkeleton.tsx';
import { TablePaginator } from './components/TablePaginator';
import { useCollection } from './hooks/useCollection.ts';
import { CollectionTable } from './components/CollectionTable.tsx';
import type Artworks from './types/artworks';

function App() {
  const {
    items,
    loading,
    first,
    rows,
    totalRecords,
    onPageChange,
    selectedCount,
    selectRows,
    clearSelection,
    handleSelectionChange,
    handleSelectAllChange,
    bulkSelectCount,
    currentPageSelection,
    isInBulkMode,
    isAllCurrentPageSelected,
  } = useCollection();

  const handleSelectRows = (count: number) => {
    selectRows(count);
  };

  const handleSelectionChangeWrapper = (selection: Artworks[], firstOffset: number) => {
    handleSelectionChange(selection, items, firstOffset);
  };

  const handleSelectAllChangeWrapper = (isAllSelected: boolean) => {
    handleSelectAllChange(isAllSelected, items);
  };

  return (
    <div className="card">
      <div className=' mb-1 p-1' >
        <h3>Selected {selectedCount} of {totalRecords} </h3>
      </div>
      {loading ?
        <CollectionTableSkeleton rows={rows} /> :
        <CollectionTable
          items={items}
          loading={loading}
          selectRows={handleSelectRows}
          clearSelection={clearSelection}
          onSelectionChange={handleSelectionChangeWrapper}
          onSelectAllChange={handleSelectAllChangeWrapper}
          selectedCount={selectedCount}
          bulkSelectCount={bulkSelectCount}
          currentPageSelection={currentPageSelection}
          isInBulkMode={isInBulkMode}
          first={first}
          isAllCurrentPageSelected={isAllCurrentPageSelected(items, first)}
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
