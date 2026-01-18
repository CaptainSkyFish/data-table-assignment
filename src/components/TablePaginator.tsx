
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
// import { Dropdown } from 'primereact/dropdown';
import type { PaginatorPageChangeEvent } from 'primereact/paginator';

type TablePaginatorProps = {
  first: number;
  rows: number;
  totalRecords: number;
  rowsPerPageOptions?: number[];
  onPageChange: (e: PaginatorPageChangeEvent) => void;
};

export function TablePaginator({
  first,
  rows,
  totalRecords,
  // rowsPerPageOptions = [12, 24, 48],
  onPageChange
}: TablePaginatorProps) {
  const leftContent = (
    <span className="text-sm">
      Showing {first + 1}–{Math.min(first + rows, totalRecords)} of {totalRecords}
    </span>
  );

  // const rightContent = (
  //   <Dropdown
  //     value={rows}
  //     options={[
  //       ...rowsPerPageOptions.map(v => ({ label: v, value: v })),
  //     ]}
  //     onChange={(e) =>
  //       onPageChange({ first: 0, rows: e.value, page: 0, pageCount: 0 })
  //     }
  //   />
  // );

  const template = {
    layout: 'PrevPageLink PageLinks NextPageLink',
    PrevPageLink: (o: any) => (
      <Button text disabled={o.disabled} onClick={o.onClick} label="Prev" />
    ),
    NextPageLink: (o: any) => (
      <Button text disabled={o.disabled} onClick={o.onClick} label="Next" />
    )
  };

  return (
    <Paginator
      first={first}
      rows={rows}
      totalRecords={totalRecords}
      onPageChange={onPageChange}
      template={template}
      leftContent={leftContent}
    // rightContent={rightContent}
    />
  );
}

