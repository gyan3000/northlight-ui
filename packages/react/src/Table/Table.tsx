import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import styles from "./Table.module.css";

const cx = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(" ");

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /**
   * Names the table's scrolling area for assistive tech when it overflows on a
   * narrow screen, for example "Invoices". Required so nothing is hardcoded.
   */
  label: string;
  /** Class for the scrolling wrapper (the `className` prop goes to the `<table>`). */
  wrapperClassName?: string;
}

/**
 * A data table. On narrow screens it scrolls sideways inside its own box; only
 * when it actually overflows does the box become a focusable, named region, so
 * keyboard users can scroll it (and a table that fits adds no extra Tab stop).
 * Build it from `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { label, wrapperClassName, className, children, ...rest },
  ref,
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollWidth > el.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={cx(styles.scroll, wrapperClassName)}
      {...(overflows ? { role: "region", "aria-label": label, tabIndex: 0 } : {})}
    >
      <table ref={ref} className={cx(styles.table, className)} {...rest}>
        {children}
      </table>
    </div>
  );
});

export const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  function TableCaption({ className, ...rest }, ref) {
    return <caption ref={ref} className={cx(styles.caption, className)} {...rest} />;
  },
);

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableHeader({ className, ...rest }, ref) {
    return <thead ref={ref} className={cx(styles.header, className)} {...rest} />;
  },
);

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody({ className, ...rest }, ref) {
    return <tbody ref={ref} className={cx(styles.body, className)} {...rest} />;
  },
);

export const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableFooter({ className, ...rest }, ref) {
    return <tfoot ref={ref} className={cx(styles.footer, className)} {...rest} />;
  },
);

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(function TableRow(
  { className, ...rest },
  ref,
) {
  return <tr ref={ref} className={cx(styles.row, className)} {...rest} />;
});

/** A column header. `scope="col"` by default; pass `scope="row"` for a row header. */
export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(function TableHead(
  { className, scope = "col", ...rest },
  ref,
) {
  return <th ref={ref} scope={scope} className={cx(styles.head, className)} {...rest} />;
});

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(function TableCell(
  { className, ...rest },
  ref,
) {
  return <td ref={ref} className={cx(styles.cell, className)} {...rest} />;
});

export interface TableSortHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "aria-sort"> {
  /** Current sort of this column. Only one column should be sorted at a time. */
  direction?: "ascending" | "descending" | "none";
  /** Called when the header is activated; you decide the next direction. */
  onSort: () => void;
}

/**
 * A column header that sorts. The sorted state is announced with `aria-sort`,
 * and the header is a real button, so Enter and Space work. Sorting the rows is up to you.
 */
export const TableSortHead = forwardRef<HTMLTableCellElement, TableSortHeadProps>(function TableSortHead(
  { className, direction = "none", onSort, children, scope = "col", ...rest },
  ref,
) {
  return (
    <th ref={ref} scope={scope} aria-sort={direction} className={cx(styles.head, className)} {...rest}>
      <button type="button" className={styles.sortButton} onClick={onSort}>
        {children}
        <span className={styles.sortIcon} data-direction={direction} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 10l4-4 4 4" className={styles.up} />
            <path d="M8 14l4 4 4-4" className={styles.down} />
          </svg>
        </span>
      </button>
    </th>
  );
});
