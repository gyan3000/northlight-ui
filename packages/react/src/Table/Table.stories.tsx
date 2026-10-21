import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Badge } from "../Badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHead,
} from "./Table";

const invoices = [
  { id: "INV-003", customer: "Acme Corp", amount: 1250, status: "Paid" },
  { id: "INV-001", customer: "Globex", amount: 480, status: "Pending" },
  { id: "INV-004", customer: "Initech", amount: 3100, status: "Overdue" },
  { id: "INV-002", customer: "Umbrella", amount: 920, status: "Paid" },
];
const tone = { Paid: "success", Pending: "warning", Overdue: "danger" } as const;
const money = (n: number) => `$${n.toLocaleString()}`;

const meta = {
  title: "Data display/Table",
  component: Table,
  args: { label: "Invoices", children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((row) => (
          <TableRow key={row.id}>
            <TableHead scope="row">{row.id}</TableHead>
            <TableCell>{row.customer}</TableCell>
            <TableCell><Badge tone={tone[row.status as keyof typeof tone]} size="sm">{row.status}</Badge></TableCell>
            <TableCell>{money(row.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell>{money(invoices.reduce((sum, r) => sum + r.amount, 0))}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

type SortKey = "id" | "customer" | "amount";

function SortableDemo(args: React.ComponentProps<typeof Table>) {
  const [sort, setSort] = useState<{ key: SortKey; direction: "ascending" | "descending" }>({ key: "id", direction: "ascending" });
  const rows = useMemo(() => {
    const sorted = [...invoices].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0));
    return sort.direction === "ascending" ? sorted : sorted.reverse();
  }, [sort]);
  const dir = (key: SortKey) => (sort.key === key ? sort.direction : "none");
  const toggle = (key: SortKey) =>
    setSort((s) => ({ key, direction: s.key === key && s.direction === "ascending" ? "descending" : "ascending" }));

  return (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableSortHead direction={dir("id")} onSort={() => toggle("id")}>Invoice</TableSortHead>
          <TableSortHead direction={dir("customer")} onSort={() => toggle("customer")}>Customer</TableSortHead>
          <TableHead>Status</TableHead>
          <TableSortHead direction={dir("amount")} onSort={() => toggle("amount")}>Amount</TableSortHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableHead scope="row">{row.id}</TableHead>
            <TableCell>{row.customer}</TableCell>
            <TableCell><Badge tone={tone[row.status as keyof typeof tone]} size="sm">{row.status}</Badge></TableCell>
            <TableCell>{money(row.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const Sortable: Story = { render: (args) => <SortableDemo {...args} /> };

export const ScrollsOnNarrowScreens: Story = {
  render: (args) => (
    <div style={{ maxInlineSize: "18rem" }}>
      <SortableDemo {...args} />
    </div>
  ),
};

export const RightToLeft: Story = {
  args: { label: "الفواتير" },
  render: (args) => (
    <div dir="rtl">
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>الفاتورة</TableHead>
            <TableHead>العميل</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV-001</TableCell>
            <TableCell>شركة</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  render: (args) => <SortableDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Invoice" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("columnheader", { name: "Invoice" })).toHaveAttribute("aria-sort", "descending");
  },
};
