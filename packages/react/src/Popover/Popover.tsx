import * as RadixPopover from "@radix-ui/react-popover";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import styles from "./Popover.module.css";

/** Controls open state. Use `open` + `onOpenChange` (controlled) or leave it to the component. */
export const Popover = RadixPopover.Root;
/** The element that opens the popover. Use `asChild` to wrap your own `Button`. */
export const PopoverTrigger = RadixPopover.Trigger;
/** Closes the popover. Use `asChild` to wrap your own `Button`. */
export const PopoverClose = RadixPopover.Close;

/**
 * A floating panel for rich content such as a small form. Focus moves inside
 * when it opens, Escape or an outside click closes it, and focus returns to the
 * trigger. For plain hints use `Tooltip`; for a list of actions use `DropdownMenu`.
 */
export const PopoverContent = forwardRef<
  ElementRef<typeof RadixPopover.Content>,
  ComponentPropsWithoutRef<typeof RadixPopover.Content>
>(function PopoverContent({ className, sideOffset = 8, ...rest }, ref) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        ref={ref}
        sideOffset={sideOffset}
        className={[styles.content, className].filter(Boolean).join(" ")}
        {...rest}
      />
    </RadixPopover.Portal>
  );
});
