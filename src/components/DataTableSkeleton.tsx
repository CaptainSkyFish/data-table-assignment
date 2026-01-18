import { Column } from "primereact/column";
import { DataTable, type DataTableValue } from "primereact/datatable"
import { Skeleton } from "primereact/skeleton";



export const DataTableSkeleton = ({ rows = 12 }: { rows?: number }) => {
  const items: DataTableValue[] = Array.from({ length: rows });

  const cell = () => <Skeleton width="100%" height="2rem" />;

  return (
    <DataTable value={items} className="p-datatable-striped">
      <Column header="" body={cell} style={{ width: '3rem' }} />
      <Column header="Title" body={cell} style={{ width: '30%' }} />
      <Column header="Place of Origin" body={cell} style={{ width: '10%' }} />
      <Column header="Artist" body={cell} style={{ width: '25%' }} />
      <Column header="Inscriptions" body={cell} style={{ width: '25%' }} />
      <Column header="Start Date" body={cell} style={{ width: '5%' }} />
      <Column header="End Date" body={cell} style={{ width: '5%' }} />
    </DataTable>
  );
};

