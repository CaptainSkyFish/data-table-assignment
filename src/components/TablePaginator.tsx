
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import type { PaginatorPageChangeEvent, PaginatorFirstPageLinkOptions, PaginatorPrevPageLinkOptions, PaginatorNextPageLinkOptions, PaginatorLastPageLinkOptions } from 'primereact/paginator';

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
  onPageChange
}: TablePaginatorProps) {
  const leftContent = (
    <span className="text-sm">
      Showing {first + 1}–{Math.min(first + rows, totalRecords)} of {totalRecords}
    </span>
  );

  const template = {
    layout: 'FirstPageLink PrevPageLink PageLinks  NextPageLink LastPageLink',
    FirstPageLink: (o: PaginatorFirstPageLinkOptions) => (
      <Button text disabled={o.disabled} onClick={o.onClick} label="First" />
    ),
    PrevPageLink: (o: PaginatorPrevPageLinkOptions) => (
      <Button text disabled={o.disabled} onClick={o.onClick} label="Prev" />
    ),
    LastPageLink: (o: PaginatorLastPageLinkOptions) => (
      <Button text disabled={o.disabled} onClick={o.onClick} label="Last" />
    ),
    NextPageLink: (o: PaginatorNextPageLinkOptions) => (
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
      pageLinkSize={4}
      leftContent={leftContent}
    // rightContent={rightContent}
    />
  );
}

