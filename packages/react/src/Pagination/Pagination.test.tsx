import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef, useState } from "react";
import { vi } from "vitest";
import { getPageRange, Pagination, type PaginationProps } from "./Pagination";

const labels = {
  label: "Pagination",
  previousLabel: "Previous page",
  nextLabel: "Next page",
  pageLabel: (page: number) => `Page ${page}`,
};

function Example(props: Partial<PaginationProps> = {}) {
  return <Pagination pageCount={10} {...labels} {...props} />;
}

describe("getPageRange", () => {
  it("shows every page when they all fit", () => {
    expect(getPageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageRange(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("collapses the far end near the start", () => {
    expect(getPageRange(1, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 10]);
    expect(getPageRange(3, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 10]);
  });

  it("collapses the near end near the finish", () => {
    expect(getPageRange(10, 10)).toEqual([1, "ellipsis-start", 6, 7, 8, 9, 10]);
    expect(getPageRange(8, 10)).toEqual([1, "ellipsis-start", 6, 7, 8, 9, 10]);
  });

  it("collapses both ends in the middle", () => {
    expect(getPageRange(5, 10)).toEqual([1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 10]);
  });

  it("keeps the number of slots constant while paging", () => {
    const lengths = new Set(Array.from({ length: 20 }, (_, i) => getPageRange(i + 1, 20).length));
    expect(lengths).toEqual(new Set([7]));
  });

  it("honours siblingCount", () => {
    expect(getPageRange(10, 20, 2)).toEqual([1, "ellipsis-start", 8, 9, 10, 11, 12, "ellipsis-end", 20]);
  });
});

describe("Pagination", () => {
  it("is a named navigation landmark", () => {
    render(<Example />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("marks the current page and names the page buttons", () => {
    render(<Example defaultPage={1} />);
    const current = screen.getByRole("button", { name: "Page 1" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Page 2" })).not.toHaveAttribute("aria-current");
  });

  it("hides the ellipses from assistive tech", () => {
    render(<Example />);
    const hidden = screen.getAllByText("…");
    expect(hidden.length).toBeGreaterThan(0);
    for (const el of hidden) expect(el.closest("li")).toHaveAttribute("aria-hidden", "true");
  });

  it("goes to a page on click (uncontrolled) and reports it", async () => {
    const onPageChange = vi.fn();
    render(<Example onPageChange={onPageChange} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Page 3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute("aria-current", "page");
  });

  it("steps with previous and next", async () => {
    const user = userEvent.setup();
    render(<Example defaultPage={4} />);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute("aria-current", "page");
  });

  it("disables previous on the first page and next on the last", () => {
    const { rerender } = render(<Example defaultPage={1} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    rerender(<Example page={10} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("works controlled: the parent owns the page", async () => {
    const onPageChange = vi.fn();
    function Controlled() {
      const [page, setPage] = useState(1);
      return <Example page={page} onPageChange={(p) => { onPageChange(p); setPage(p); }} />;
    }
    render(<Controlled />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Page 2" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  });

  it("does not move on its own when controlled and the parent ignores the change", async () => {
    render(<Example page={1} onPageChange={() => {}} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Page 2" }));
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
  });

  it("can be operated from the keyboard", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Example defaultPage={1} onPageChange={onPageChange} />);
    await user.tab();
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveFocus();
    await user.tab();
    await user.keyboard("{Enter}");
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("does not report a change when the current page is clicked", async () => {
    const onPageChange = vi.fn();
    render(<Example defaultPage={2} onPageChange={onPageChange} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Page 2" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("clamps an out-of-range page and handles a single page", () => {
    const { rerender } = render(<Example page={99} />);
    expect(screen.getByRole("button", { name: "Page 10" })).toHaveAttribute("aria-current", "page");
    rerender(<Example pageCount={1} page={1} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLElement>();
    render(<Pagination ref={ref} className="custom" pageCount={3} {...labels} />);
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Example defaultPage={5} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
