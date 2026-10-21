import * as RadixTabs from "@radix-ui/react-tabs";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import styles from "./Tabs.module.css";

const cx = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(" ");

/**
 * Groups related panels, showing one at a time. Works controlled
 * (`value` + `onValueChange`) or uncontrolled (`defaultValue`).
 * Arrow keys move between tabs, Home/End jump to the first/last.
 */
export const Tabs = forwardRef<ElementRef<typeof RadixTabs.Root>, ComponentPropsWithoutRef<typeof RadixTabs.Root>>(
  function Tabs({ className, ...rest }, ref) {
    return <RadixTabs.Root ref={ref} className={cx(styles.root, className)} {...rest} />;
  },
);

/** The row of tab buttons. Give it an `aria-label` so the tablist has a name. */
export const TabsList = forwardRef<ElementRef<typeof RadixTabs.List>, ComponentPropsWithoutRef<typeof RadixTabs.List>>(
  function TabsList({ className, ...rest }, ref) {
    return <RadixTabs.List ref={ref} className={cx(styles.list, className)} {...rest} />;
  },
);

export const TabsTrigger = forwardRef<
  ElementRef<typeof RadixTabs.Trigger>,
  ComponentPropsWithoutRef<typeof RadixTabs.Trigger>
>(function TabsTrigger({ className, ...rest }, ref) {
  return <RadixTabs.Trigger ref={ref} className={cx(styles.trigger, className)} {...rest} />;
});

export const TabsContent = forwardRef<
  ElementRef<typeof RadixTabs.Content>,
  ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(function TabsContent({ className, ...rest }, ref) {
  return <RadixTabs.Content ref={ref} className={cx(styles.content, className)} {...rest} />;
});
