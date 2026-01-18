import { useRef, useState } from "react";
import { OverlayPanel } from 'primereact/overlaypanel';
import type { Artworks } from "../types/artworks";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

interface SelectionOverlayProps {
  artworks: Artworks[];
  onSelect: (count: number) => void;
  onClearAll: () => void;
}

export const SelectionOverlay = ({ artworks, onSelect, onClearAll }: SelectionOverlayProps) => {
  const [rowsToSelect, setRowsToSelect] = useState<number>(1);
  const overlayRef = useRef<OverlayPanel>(null);

  return <div className="flex items-center justify-center">
    <button onClick={(e) => overlayRef.current?.toggle(e)}>
      <i className="pi pi-chevron-down pointer-cursor"> </i>
    </button>
    <OverlayPanel ref={overlayRef}>
      <div style={{ padding: '1rem', minWidth: '250px' }}>
        <h2 className="font-semibold">Select Rows</h2>
        <div className="mb-1">
          <label htmlFor="rowsInput" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Enter number of rows to select across all pages:
          </label>
          <InputNumber
            id="rowsInput"
            value={rowsToSelect}
            onValueChange={(e) => setRowsToSelect(e.value || 1)}
            min={1}
            max={artworks.length}
            showButtons
            style={{ width: '100%' }}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            label="Clear All"
            icon="pi pi-times"
            onClick={() => onClearAll()}
            severity="secondary"
          />
          <Button
            label="Select"
            icon="pi pi-check"
            onClick={() => onSelect(rowsToSelect)}
          />
        </div>
      </div>
    </OverlayPanel>
  </div>
}
