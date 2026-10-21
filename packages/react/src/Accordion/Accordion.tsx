import * as RadixAccordion from "@radix-ui/react-accordion";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import styles from "./Accordion.module.css";

const cx = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(" ");

export type AccordionProps =
  | (RadixAccordion.AccordionSingleProps & { className?: string })
  | (RadixAccordion.AccordionMultipleProps & { className?: string });

/**
 * A stack of sections that expand and collapse. `type="single"` keeps one open
 * (add `collapsible` to allow closing it); `type="multiple"` allows several.
 * Works controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`).
 * Up/Down move between headers, Home/End jump to the first/last.
 */
export const Accordion = forwardRef<ElementRef<typeof RadixAccordion.Root>, AccordionProps>(function Accordion(
  { className, ...rest },
  ref,
) {
  return <RadixAccordion.Root ref={ref} className={cx(styles.root, className)} {...(rest as RadixAccordion.AccordionSingleProps)} />;
});

export const AccordionItem = forwardRef<
  ElementRef<typeof RadixAccordion.Item>,
  ComponentPropsWithoutRef<typeof RadixAccordion.Item>
>(function AccordionItem({ className, ...rest }, ref) {
  return <RadixAccordion.Item ref={ref} className={cx(styles.item, className)} {...rest} />;
});

/** The always-visible header button. It is wrapped in a heading (`h3`) for screen-reader navigation. */
export const AccordionTrigger = forwardRef<
  ElementRef<typeof RadixAccordion.Trigger>,
  ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>
>(function AccordionTrigger({ className, children, ...rest }, ref) {
  return (
    <RadixAccordion.Header className={styles.header}>
      <RadixAccordion.Trigger ref={ref} className={cx(styles.trigger, className)} {...rest}>
        {children}
        <span className={styles.chevron} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  );
});

export const AccordionContent = forwardRef<
  ElementRef<typeof RadixAccordion.Content>,
  ComponentPropsWithoutRef<typeof RadixAccordion.Content>
>(function AccordionContent({ className, children, ...rest }, ref) {
  return (
    <RadixAccordion.Content ref={ref} className={cx(styles.content, className)} {...rest}>
      <div className={styles.inner}>{children}</div>
    </RadixAccordion.Content>
  );
});
