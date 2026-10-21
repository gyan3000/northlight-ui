import * as RadixDialog from "@radix-ui/react-dialog";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";
import dialogStyles from "../Dialog/Dialog.module.css";
import { closeIcon } from "../internal/ToneIcons";
import styles from "./Drawer.module.css";

const cx = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(" ");

/** Controls open state. Use `open` + `onOpenChange` (controlled) or `defaultOpen`. */
export const Drawer = RadixDialog.Root;
/** The element that opens the drawer. Use `asChild` to wrap your own `Button`. */
export const DrawerTrigger = RadixDialog.Trigger;
/** Closes the drawer. Use `asChild` to wrap your own `Button`. */
export const DrawerClose = RadixDialog.Close;

export interface DrawerContentProps extends Omit<ComponentPropsWithoutRef<typeof RadixDialog.Content>, "title"> {
  /** Edge it slides from. `start` and `end` follow the text direction (right-to-left aware). Defaults to `end`. */
  side?: "start" | "end" | "top" | "bottom";
  /** Names the drawer for screen readers and is shown as its heading. */
  title: ReactNode;
  /** Optional supporting text, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Accessible name of the corner close button, for example "Close". */
  closeLabel: string;
}

/**
 * A panel that slides in from an edge, for secondary tasks such as filters or
 * settings. It is a modal like `Dialog`: focus is trapped inside, Escape closes
 * it, background scrolling is locked, and focus returns to the trigger.
 */
export const DrawerContent = forwardRef<ElementRef<typeof RadixDialog.Content>, DrawerContentProps>(
  function DrawerContent({ className, side = "end", title, description, closeLabel, children, ...rest }, ref) {
    return (
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={dialogStyles.overlay} />
        <RadixDialog.Content
          ref={ref}
          className={cx(styles.panel, styles[side], className)}
          // Radix warns when there is no description unless this is set explicitly.
          {...(description ? {} : { "aria-describedby": undefined })}
          {...rest}
        >
          <RadixDialog.Title className={dialogStyles.title}>{title}</RadixDialog.Title>
          {description && (
            <RadixDialog.Description className={dialogStyles.description}>{description}</RadixDialog.Description>
          )}
          <div className={cx(dialogStyles.body, styles.body)}>{children}</div>
          <RadixDialog.Close className={dialogStyles.close} aria-label={closeLabel}>
            <span className={dialogStyles.closeIcon} aria-hidden="true">
              {closeIcon}
            </span>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    );
  },
);

/** Row for the drawer's action buttons, pinned to the bottom of the panel. */
export const DrawerFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(function DrawerFooter(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx(dialogStyles.footer, styles.footer, className)} {...rest} />;
});
