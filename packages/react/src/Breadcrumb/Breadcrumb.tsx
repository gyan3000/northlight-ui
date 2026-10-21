import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type LiHTMLAttributes } from "react";
import styles from "./Breadcrumb.module.css";

const cx = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(" ");

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, "aria-label"> {
  /** Accessible name of the navigation landmark, for example "Breadcrumb". Required so the library holds no hardcoded strings. */
  label: string;
}

/**
 * Shows where the current page sits in a hierarchy. Renders a named `nav` with
 * an ordered list. Mark the last entry with `BreadcrumbPage` so it is announced
 * as the current page.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { className, label, children, ...rest },
  ref,
) {
  return (
    <nav ref={ref} aria-label={label} className={cx(styles.nav, className)} {...rest}>
      <ol className={styles.list}>{children}</ol>
    </nav>
  );
});

/** One entry. Its separator is drawn automatically and hidden from assistive tech. */
export const BreadcrumbItem = forwardRef<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>(function BreadcrumbItem(
  { className, children, ...rest },
  ref,
) {
  return (
    <li ref={ref} className={cx(styles.item, className)} {...rest}>
      {children}
      <span className={styles.separator} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </span>
    </li>
  );
});

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Render your router's link component instead of an `<a>`. */
  asChild?: boolean;
}

/** A link to an ancestor page. Use `asChild` with your router's `Link`. */
export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(function BreadcrumbLink(
  { className, asChild = false, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : "a";
  return <Comp ref={ref} className={cx(styles.link, className)} {...rest} />;
});

/** The current page: plain text with `aria-current="page"`, not a link. */
export const BreadcrumbPage = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function BreadcrumbPage(
  { className, ...rest },
  ref,
) {
  return <span ref={ref} aria-current="page" className={cx(styles.page, className)} {...rest} />;
});
