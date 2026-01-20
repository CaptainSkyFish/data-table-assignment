import './App.css';
import { CollectionTableSkeleton } from './components/CollectionTableSkeleton.tsx';
import { TablePaginator } from './components/TablePaginator';
import { useCollection } from './hooks/useCollection.ts';
import { CollectionTable } from './components/CollectionTable.tsx';

function App() {
  const {
    items,
    loading,
    first,
    rows,
    totalRecords,
    onPageChange,
    selectedCount,
    isInBulkMode,
    clearSelection,
    selectRows,
    handleSelectionChange,
    handleAllRowsSelect,
    handleAllRowsUnselect,
    currentPageSelection,
    selectAllState,
  } = useCollection();

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
          totalRecords={totalRecords}
          selectedCount={selectedCount}
          isInBulkMode={isInBulkMode}
          selectRows={selectRows}
          clearSelection={clearSelection}
          handleSelectionChange={handleSelectionChange}
          handleAllRowsSelect={handleAllRowsSelect}
          handleAllRowsUnselect={handleAllRowsUnselect}
          currentPageSelection={currentPageSelection}
          selectAllState={selectAllState}
          first={first}
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
