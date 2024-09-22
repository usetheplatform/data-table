import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export function DataTable<T extends TableRowDef>({
  data,
  filters,
  columns,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfigDef<T>>(null);
  const [filterValues, setFilterValues] = useState<{
    [key in keyof T]?: string;
  }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  function onSort(key: keyof T) {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({
      key,
      direction,
    });
  }

  function onFilterChange(key: keyof T, value: string) {
    setFilterValues((fv) => ({
      ...fv,
      [key]: value,
    }));
  }

  const onSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const debouncedSearch = useDebounce(onSearch, 500);

  useEffect(() => {
    return () => {
      debouncedSearch?.cancel();
    };
  }, [debouncedSearch]);

  const filteredData = data.filter((row) => {
    return (
      Object.keys(filterValues).every((filterKey) => {
        const filterValue = filterValues[filterKey as keyof T];

        if (!filterValue) return true;

        return row[filterKey as keyof T] === filterValue;
      }) &&
      columns.some((column) => {
        const value = row[column.accessorKey];
        return value
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      })
    );
  });

  const sortedData = sortConfig
    ? [...filteredData].sort((rowA, rowB) => {
        const rowAValue = rowA[sortConfig.key];
        const rowBValue = rowB[sortConfig.key];

        if (rowAValue < rowBValue)
          return sortConfig.direction === "asc" ? -1 : 1;
        if (rowAValue > rowBValue)
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      })
    : filteredData;

  return (
    <div>
      <div className="mb-4">
        <label>
          Search
          <input
            type="text"
            placeholder="Search everywhere"
            defaultValue={searchQuery}
            onChange={debouncedSearch}
            className="border p-2"
          />
        </label>
      </div>

      {filters && (
        <div>
          {filters.map((filter) => {
            return (
              <div key={filter.accessorKey.toString()} className="mb-2">
                <label htmlFor="filter-select">{filter.label}: </label>
                <select
                  id="filter-select"
                  value={filterValues[filter.accessorKey] || ""}
                  onChange={(event) =>
                    onFilterChange(filter.accessorKey, event.target.value)
                  }
                >
                  <option value="">All</option>

                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
      <table className="table-auto">
        <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
          <tr>
            {columns.map((column) => {
              return (
                <th
                  scope="col"
                  className="px-6 py-4"
                  data-testid={`data-table-header-${column.accessorKey.toString()}`}
                  key={column.accessorKey.toString()}
                  onClick={() =>
                    column.sortable && onSort
                      ? onSort(column.accessorKey)
                      : undefined
                  }
                >
                  {column.header}
                  <span>
                    {sortConfig?.key === column.accessorKey &&
                    sortConfig.direction === "asc"
                      ? " 🔼"
                      : " 🔽"}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => {
            return (
              <tr
                data-testid="data-table-row"
                className="border-b border-neutral-200 dark:border-white/10"
                key={row.id}
              >
                {columns.map((column) => {
                  const value = row[column.accessorKey];

                  return (
                    <td
                      data-testid={`data-table-cell-${column.accessorKey.toString()}`}
                      className="whitespace-nowrap px-6 py-4 font-medium"
                      key={`${column.accessorKey.toString()}-${row.id}`}
                    >
                      {column.cell({
                        value,
                        row,
                      })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
