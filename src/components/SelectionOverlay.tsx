import { useState } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

interface Props {
  selectRows: (n: number) => void;
  clearSelection: () => void;
}

export function SelectionOverlay({ selectRows, clearSelection }: Props) {
  const [value, setValue] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <InputNumber
        value={value}
        onValueChange={e => setValue(e.value ?? null)}
        placeholder="Select N"
        min={0}
      />
      <Button
        size="small"
        label="Apply"
        onClick={() => value != null && selectRows(value)}
      />
      <Button
        size="small"
        severity="secondary"
        label="Clear"
        onClick={clearSelection}
      />
    </div>
  );
}
