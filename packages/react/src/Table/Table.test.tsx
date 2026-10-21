import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef } from "react";
import { vi } from "vitest";
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

function Example({ sort = "none", onSort = vi.fn() }: { sort?: "ascending" | "descending" | "none"; onSort?: () => void }) {
  return (
    <Table label="Invoices">
      <TableCaption>Recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableSortHead direction={sort} onSort={onSort}>Invoice</TableSortHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead scope="row">INV-001</TableHead>
          <TableCell>Paid</TableCell>
        </TableRow>
        <TableRow>
          <TableHead scope="row">INV-002</TableHead>
          <TableCell>Pending</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>2</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe("Table", () => {
  it("uses real table semantics", () => {
    render(<Example />);
    expect(screen.getByRole("table", { name: "Recent invoices" })).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getAllByRole("rowheader")).toHaveLength(2);
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getByRole("cell", { name: "Paid" })).toBeInTheDocument();
  });

  it("gives column headers scope=col and allows scope=row", () => {
    render(<Example />);
    expect(screen.getByRole("columnheader", { name: "Status" })).toHaveAttribute("scope", "col");
    expect(screen.getByRole("rowheader", { name: "INV-001" })).toHaveAttribute("scope", "row");
  });

  it("announces the sort state on a sortable header", () => {
    const { rerender } = render(<Example sort="none" />);
    expect(screen.getByRole("columnheader", { name: "Invoice" })).toHaveAttribute("aria-sort", "none");
    rerender(<Example sort="ascending" />);
    expect(screen.getByRole("columnheader", { name: "Invoice" })).toHaveAttribute("aria-sort", "ascending");
    rerender(<Example sort="descending" />);
    expect(screen.getByRole("columnheader", { name: "Invoice" })).toHaveAttribute("aria-sort", "descending");
  });

  it("sorts from a click and from the keyboard", async () => {
    const onSort = vi.fn();
    const user = userEvent.setup();
    render(<Example onSort={onSort} />);
    await user.click(screen.getByRole("button", { name: "Invoice" }));
    // The click focused the header button, so the keys below act on it.
    expect(screen.getByRole("button", { name: "Invoice" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onSort).toHaveBeenCalledTimes(3);
  });

  it("adds no extra Tab stop when the table fits", () => {
    const { container } = render(<Example />);
    expect(container.firstElementChild).not.toHaveAttribute("tabindex");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  describe("when it overflows", () => {
    const original = {
      scrollWidth: Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollWidth"),
      clientWidth: Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth"),
    };
    beforeEach(() => {
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", { configurable: true, get: () => 800 });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 300 });
    });
    afterEach(() => {
      for (const [name, desc] of Object.entries(original)) {
        if (desc) Object.defineProperty(HTMLElement.prototype, name, desc);
        else delete (HTMLElement.prototype as unknown as Record<string, unknown>)[name];
      }
    });

    it("becomes a named, focusable region so keyboard users can scroll it", async () => {
      render(<Example />);
      const region = await screen.findByRole("region", { name: "Invoices" });
      expect(region).toHaveAttribute("tabindex", "0");
      await userEvent.setup().tab();
      expect(region).toHaveFocus();
    });
  });

  it("forwards refs and classNames", () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref} label="x" className="table-x" wrapperClassName="wrap-x">
        <TableBody>
          <TableRow className="row-x"><TableCell className="cell-x">c</TableCell></TableRow>
        </TableBody>
      </Table>,
    );
    expect(ref.current).toHaveClass("table-x");
    expect(ref.current?.parentElement).toHaveClass("wrap-x");
    expect(screen.getByRole("row")).toHaveClass("row-x");
    expect(screen.getByRole("cell")).toHaveClass("cell-x");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Example sort="ascending" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
