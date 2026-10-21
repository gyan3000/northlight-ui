import * as RadixMenu from "@radix-ui/react-dropdown-menu";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import styles from "./DropdownMenu.module.css";

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(" ");

/** Controls open state. Use `open` + `onOpenChange` (controlled) or leave it to the component. */
export const DropdownMenu = RadixMenu.Root;
/** The element that opens the menu. Use `asChild` to wrap your own `Button` or `IconButton`. */
export const DropdownMenuTrigger = RadixMenu.Trigger;

/**
 * The menu panel. Arrow keys move, Enter or Space activates, typing jumps to an
 * item, Escape closes and returns focus to the trigger.
 */
export const DropdownMenuContent = forwardRef<
  ElementRef<typeof RadixMenu.Content>,
  ComponentPropsWithoutRef<typeof RadixMenu.Content>
>(function DropdownMenuContent({ className, sideOffset = 8, ...rest }, ref) {
  return (
    <RadixMenu.Portal>
      <RadixMenu.Content ref={ref} sideOffset={sideOffset} className={cx(styles.content, className)} {...rest} />
    </RadixMenu.Portal>
  );
});

export interface DropdownMenuItemProps extends ComponentPropsWithoutRef<typeof RadixMenu.Item> {
  /** `danger` for destructive actions such as Delete. */
  tone?: "default" | "danger";
}

/** An action. `onSelect` runs when it is chosen; the menu then closes. */
export const DropdownMenuItem = forwardRef<ElementRef<typeof RadixMenu.Item>, DropdownMenuItemProps>(
  function DropdownMenuItem({ className, tone = "default", ...rest }, ref) {
    return <RadixMenu.Item ref={ref} className={cx(styles.item, tone === "danger" && styles.danger, className)} {...rest} />;
  },
);

/** An item that toggles a boolean, with a check mark when on. */
export const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof RadixMenu.CheckboxItem>,
  ComponentPropsWithoutRef<typeof RadixMenu.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, ...rest }, ref) {
  return (
    <RadixMenu.CheckboxItem ref={ref} className={cx(styles.item, className)} {...rest}>
      {children}
      <RadixMenu.ItemIndicator className={styles.indicator}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8.5l3.5 3.5L13 4.5" />
        </svg>
      </RadixMenu.ItemIndicator>
    </RadixMenu.CheckboxItem>
  );
});

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof RadixMenu.Separator>,
  ComponentPropsWithoutRef<typeof RadixMenu.Separator>
>(function DropdownMenuSeparator({ className, ...rest }, ref) {
  return <RadixMenu.Separator ref={ref} className={cx(styles.separator, className)} {...rest} />;
});

/** A non-interactive heading for a group of items. */
export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof RadixMenu.Label>,
  ComponentPropsWithoutRef<typeof RadixMenu.Label>
>(function DropdownMenuLabel({ className, ...rest }, ref) {
  return <RadixMenu.Label ref={ref} className={cx(styles.label, className)} {...rest} />;
});

export const DropdownMenuGroup = RadixMenu.Group;
