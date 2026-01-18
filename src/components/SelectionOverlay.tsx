import { useRef, useState } from "react";
import { OverlayPanel } from 'primereact/overlaypanel';
import type Artworks from "../types/artworks";
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
    <Button
      text
      size="small"
      severity="secondary"
      icon="pi pi-chevron-down"
      onClick={(e) => overlayRef.current?.toggle(e)} />

    <OverlayPanel ref={overlayRef}>
      <div className="p-1 min-w-2xs ">
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
        <div className="flex mt-5 gap-2 justify-end">
          <Button
            label="Clear All"
            text
            icon="pi pi-times"
            onClick={(e) => { onClearAll(); overlayRef.current?.toggle(e) }}
            severity="danger"
          />
          <Button
            label="Select"
            icon="pi pi-check"
            onClick={(e) => { onSelect(rowsToSelect); overlayRef.current?.toggle(e) }}
          />
        </div>
      </div>
    </OverlayPanel>
  </div >
}
