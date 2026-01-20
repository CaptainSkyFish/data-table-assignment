import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { useSelection } from '../hooks/useSelection';

interface SelectionOverlayProps {
  totalRecords: number;
}

export const SelectionOverlay = ({ totalRecords }: SelectionOverlayProps) => {
  const { count, isBulkMode, selectRows, clearSelection } = useSelection();
  const [bulkSelectCount, setBulkSelectCount] = useState<number | null>(null);
  const overlayRef = useRef<OverlayPanel>(null);

  const handleToggle = (e: React.MouseEvent) => {
    overlayRef.current?.toggle(e);
  };

  const handleSubmit = () => {
    if (bulkSelectCount && bulkSelectCount > 0) {
      const rowsToSelect = Math.min(bulkSelectCount, totalRecords);
      selectRows(rowsToSelect);
      overlayRef.current?.hide();
      setBulkSelectCount(null);
    }
  };

  return <div className="flex items-center justify-center">
    <Button
      icon="pi pi-chevron-down"
      onClick={handleToggle}
      text
      size="small"
    />
    <OverlayPanel ref={overlayRef}>
      <div className="p-1 min-w-2xs">
        <h3 className="font-semibold">Select Rows</h3>
        {isBulkMode && (
          <p className="text-sm text-gray-600 mb-2">
            Currently in bulk selection mode
          </p>
        )}
        <div className='flex flex-col'>
          <label htmlFor="rowsInput">
            Enter number of rows to select across all pages:
          </label>
          <InputNumber
            autoFocus
            value={bulkSelectCount}
            onChange={(e) => setBulkSelectCount(e.value ?? null)}
            placeholder="Enter count"
            min={1}
          /></div>
        <div className="flex gap-2 mt-5 justify-end">
          <Button
            label="Clear All"
            onClick={() => {
              clearSelection();
              overlayRef.current?.hide();
            }}
            severity="secondary"
            size="small"
            disabled={count === 0}
          />
          <Button
            autoFocus
            label="Select"
            onClick={handleSubmit}
            size="small"
            disabled={bulkSelectCount === null || bulkSelectCount === undefined || bulkSelectCount === 0}
          />
        </div>
      </div>
    </OverlayPanel>
  </div>
};
