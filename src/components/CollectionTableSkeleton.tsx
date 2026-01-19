import { Column } from "primereact/column";
import { DataTable, type DataTableValue } from "primereact/datatable"
import { Skeleton } from "primereact/skeleton";

export const CollectionTableSkeleton = ({ rows = 12 }: { rows?: number }) => {
  const items: DataTableValue[] = Array.from({ length: rows });

  const cell = () => <Skeleton width="100%" height="1.5rem" />;

  return (
    <DataTable value={items} className="p-datatable-striped">
      <Column header="" body={cell} style={{ width: '5%' }} />
      <Column header="TITLE" body={cell} style={{ width: '25%' }} />
      <Column header="PLACE OF ORIGIN" body={cell} style={{ width: '10%' }} />
      <Column header="ARTIST" body={cell} style={{ width: '25%' }} />
      <Column header="INSCRIPTIONS" body={cell} style={{ width: '25%' }} />
      <Column header="START DATE" body={cell} style={{ width: '5%' }} />
      <Column header="END DATE" body={cell} style={{ width: '5%' }} />
    </DataTable>
  );
};

