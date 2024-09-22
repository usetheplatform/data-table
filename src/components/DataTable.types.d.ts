type TableRowDef = {
  id: React.Key;
};

type DataTableProps<T extends TableRowDef> = {
  data: T[];
  columns: ColumnDef<T>[];
  filters?: FilterDef<T>[];
};

type CellDef<T> = {
  value: T[keyof T];
  row: T;
};

type ColumnDef<T> = {
  accessorKey: keyof T;
  header: React.ReactNode;
  cell: (cell: CellDef<T>) => React.ReactNode;
  sortable?: boolean;
};

type FilterDef<T> = {
  accessorKey: keyof T;
  label: string;
  options: string[];
};

type SortConfigDef<T> = {
  key: keyof T;
  direction: "asc" | "desc";
} | null;
