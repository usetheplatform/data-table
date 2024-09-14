"use client";

import { DataTable } from "@/components/DataTable";

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

// 1 Search
// 2 Filters
export default function App() {
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

  return <DataTable data={orders} columns={columns} filters={filters} />;
}
