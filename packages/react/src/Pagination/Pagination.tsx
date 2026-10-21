import { forwardRef, type HTMLAttributes } from "react";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { useControllableState } from "../internal/useControllableState";
import styles from "./Pagination.module.css";

export type PageItem = number | "ellipsis-start" | "ellipsis-end";

/**
 * Which page buttons to show: always the first and last page, the current page
 * with `siblingCount` neighbours on each side, and an ellipsis for each gap.
 * The number of slots stays constant so the control does not jump as you page.
 */
export function getPageRange(page: number, pageCount: number, siblingCount = 1): PageItem[] {
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const totalSlots = siblingCount * 2 + 5;
  if (pageCount <= totalSlots) return range(1, pageCount);

  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, pageCount);
  const showLeftDots = left > 2;
  const showRightDots = right < pageCount - 1;
  const edgeCount = 3 + 2 * siblingCount;

  if (!showLeftDots && showRightDots) return [...range(1, edgeCount), "ellipsis-end", pageCount];
  if (showLeftDots && !showRightDots) return [1, "ellipsis-start", ...range(pageCount - edgeCount + 1, pageCount)];
  return [1, "ellipsis-start", ...range(left, right), "ellipsis-end", pageCount];
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange" | "aria-label" | "defaultValue"> {
  /** Total number of pages. */
  pageCount: number;
  /** Current page (1-based). Use with `onPageChange` to control it. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Page buttons shown on each side of the current page. Defaults to 1. */
  siblingCount?: number;
  /** Accessible name of the navigation landmark, for example "Pagination". */
  label: string;
  /** Accessible name of the previous button, for example "Previous page". */
  previousLabel: string;
  /** Accessible name of the next button, for example "Next page". */
  nextLabel: string;
  /** Accessible name of a page button, for example `(page) => \`Page ${page}\``. */
  pageLabel: (page: number, isCurrent: boolean) => string;
}

const chevron = (flip: boolean) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={flip ? styles.flip : undefined}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

/**
 * Navigation between pages of results. Works controlled (`page` +
 * `onPageChange`) or uncontrolled (`defaultPage`). The current page is marked
 * with `aria-current="page"`. All text comes from props, so it can be translated.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { pageCount, page, defaultPage = 1, onPageChange, siblingCount = 1, label, previousLabel, nextLabel, pageLabel, className, ...rest },
  ref,
) {
  const [current, setCurrent] = useControllableState({ value: page, defaultValue: defaultPage, onChange: onPageChange });
  const safeCurrent = Math.min(Math.max(current, 1), Math.max(pageCount, 1));
  const items = getPageRange(safeCurrent, pageCount, siblingCount);
  const go = (next: number) => next !== safeCurrent && next >= 1 && next <= pageCount && setCurrent(next);

  return (
    <nav ref={ref} aria-label={label} className={[styles.nav, className].filter(Boolean).join(" ")} {...rest}>
      <ul className={styles.list}>
        <li>
          <IconButton
            variant="outline"
            size="sm"
            label={previousLabel}
            icon={chevron(false)}
            disabled={safeCurrent <= 1}
            onClick={() => go(safeCurrent - 1)}
            className={styles.rtlFlip}
          />
        </li>
        {items.map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <Button
                size="sm"
                variant={item === safeCurrent ? "solid" : "ghost"}
                aria-label={pageLabel(item, item === safeCurrent)}
                aria-current={item === safeCurrent ? "page" : undefined}
                onClick={() => go(item)}
                className={styles.page}
              >
                {item}
              </Button>
            </li>
          ) : (
            <li key={item} aria-hidden="true" className={styles.ellipsis}>
              …
            </li>
          ),
        )}
        <li>
          <IconButton
            variant="outline"
            size="sm"
            label={nextLabel}
            icon={chevron(true)}
            disabled={safeCurrent >= pageCount}
            onClick={() => go(safeCurrent + 1)}
            className={styles.rtlFlip}
          />
        </li>
      </ul>
    </nav>
  );
});
