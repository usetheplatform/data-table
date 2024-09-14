import { afterEach, describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { cleanup } from "@testing-library/react";
import { DataTable } from "./DataTable";

type Order = {
  id: string;
  order: string;
  date: string;
  customer: string;
  total: string;
  paymentStatus: string;
  fulfillmentStatus: string;
};

const orders: Order[] = [
  {
    id: "1020",
    order: "#1020",
    date: "Jul 20 at 4:34pm",
    customer: "Jaydon Stanton",
    total: "$969.44",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
  },
  {
    id: "1019",
    order: "#1019",
    date: "Jul 20 at 3:46pm",
    customer: "Ruben Westerfelt",
    total: "$701.19",
    paymentStatus: "partially paid",
    fulfillmentStatus: "unfulfilled",
  },
  {
    id: "1018",
    order: "#1018",
    date: "Jul 20 at 3.44pm",
    customer: "Leo Carder",
    total: "$798.24",
    paymentStatus: "paid",
    fulfillmentStatus: "unfulfilled",
  },
];

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "order",
    header: "Order",
    sortable: true,
    cell: ({ value, _row }) => value,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    sortable: true,
    cell: ({ value, _row }) => value,
  },
  {
    accessorKey: "total",
    header: "Total",
    sortable: true,
    cell: ({ value, _row }) => (
      <div className="text-right font-medium">{value}</div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment status",
    cell: ({ value, _row }) => value,
  },
  {
    accessorKey: "fulfillmentStatus",
    header: "Fulfillment status",
    cell: ({ value, _row }) => value,
  },
];

const filters: FilterDef<Order>[] = [
  {
    accessorKey: "paymentStatus",
    label: "Payment Status",
    options: Array.from(new Set(orders.map((order) => order.paymentStatus))),
  },
  {
    accessorKey: "fulfillmentStatus",
    label: "Fulfillment Status",
    options: Array.from(
      new Set(orders.map((order) => order.fulfillmentStatus)),
    ),
  },
];

describe("DataTable", () => {
  const renderComponent = () => {
    const container = render(
      <DataTable data={orders} columns={columns} filters={filters} />,
    );

    return container;
  };

  test("should render rows in DataTable", () => {
    renderComponent();
    expect(screen.getAllByTestId("data-table-row").length).toBe(3);
  });

  test("should sort in DataTable", () => {
    renderComponent();
    let rows = screen.getAllByTestId("data-table-cell-order");

    expect(rows[0].textContent).toContain(orders[0].order);

    fireEvent.click(screen.getByTestId("data-table-header-order"));

    rows = screen.getAllByTestId("data-table-cell-order");

    expect(rows[0].textContent).toContain(orders[2].order);
  });

  test("should search in DataTable", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Search everywhere");

    expect(input).toBeDefined();

    fireEvent.change(input, {
      target: {
        value: "Jaydon",
      },
    });

    expect(screen.getAllByTestId("data-table-row").length).toBe(1);
  });

  test("should filter in DataTable", () => {
    renderComponent();

    const input = screen.getByLabelText(/Payment Status/i);
    expect(input).toBeDefined();

    fireEvent.change(input, {
      target: {
        value: "partially paid",
      },
    });

    const rows = screen.getAllByTestId("data-table-cell-order");

    expect(rows[0].textContent).toContain(orders[1].order);
  });

  afterEach(() => {
    cleanup();
  });
});
