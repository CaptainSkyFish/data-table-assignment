import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';

interface SelectionOverlayProps {
  selectRows: (count: number) => void;
  clearSelection: () => void;
  selectedCount?: number;
  isInBulkMode?: boolean;
  totalRecords: number;
}

export const SelectionOverlay = ({ selectRows, clearSelection, selectedCount, isInBulkMode, totalRecords }: SelectionOverlayProps) => {
  const [selectCount, setSelectCount] = useState<number | null>(null);
  const overlayRef = useRef<OverlayPanel>(null);

  const handleToggle = (e: React.MouseEvent) => {
    overlayRef.current?.toggle(e);
  };

  const handleSubmit = () => {
    if (selectCount && selectCount > 0) {
      const clampedCount = Math.min(selectCount, totalRecords);
      selectRows(clampedCount);
      overlayRef.current?.hide();
      setSelectCount(null);
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
        {isInBulkMode && (
          <p className="text-sm text-gray-600 mb-2">
            Currently in bulk selection mode
          </p>
        )}
        <div className='flex flex-col'>
          <label htmlFor="rowsInput">
            Enter number of rows to select across all pages:
          </label>
          <InputNumber
            value={selectCount}
            onValueChange={(e) => setSelectCount(e.value ?? null)}
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
            disabled={selectedCount === 0}
          />
          <Button
            label="Select"
            onClick={handleSubmit}
            size="small"
            disabled={selectCount === null || selectCount === undefined || selectCount === 0}
          />
        </div>
      </div>
    </OverlayPanel>
  </div>
};
