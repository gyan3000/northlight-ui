import * as RadixDialog from "@radix-ui/react-dialog";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";
import { closeIcon } from "../internal/ToneIcons";
import styles from "./Dialog.module.css";

/** Controls open state. Use `open` + `onOpenChange` (controlled) or `defaultOpen`. */
export const Dialog = RadixDialog.Root;
/** The element that opens the dialog. Use `asChild` to wrap your own `Button`. */
export const DialogTrigger = RadixDialog.Trigger;
/** Closes the dialog. Use `asChild` to wrap your own `Button`. */
export const DialogClose = RadixDialog.Close;

export interface DialogContentProps extends Omit<ComponentPropsWithoutRef<typeof RadixDialog.Content>, "title"> {
  /** Names the dialog for screen readers and is shown as its heading. */
  title: ReactNode;
  /** Optional supporting text, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Accessible name of the corner close button, for example "Close". */
  closeLabel: string;
}

/**
 * The dialog panel with its backdrop. Focus is trapped inside while open,
 * Escape closes it, background scrolling is locked, and focus returns to the
 * trigger on close.
 */
export const DialogContent = forwardRef<ElementRef<typeof RadixDialog.Content>, DialogContentProps>(
  function DialogContent({ className, title, description, closeLabel, children, ...rest }, ref) {
    return (
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={styles.overlay} />
        <RadixDialog.Content
          ref={ref}
          className={[styles.content, className].filter(Boolean).join(" ")}
          // Radix warns when there is no description unless this is set explicitly.
          {...(description ? {} : { "aria-describedby": undefined })}
          {...rest}
        >
          <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
          {description && <RadixDialog.Description className={styles.description}>{description}</RadixDialog.Description>}
          <div className={styles.body}>{children}</div>
          <RadixDialog.Close className={styles.close} aria-label={closeLabel}>
            <span className={styles.closeIcon} aria-hidden="true">
              {closeIcon}
            </span>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    );
  },
);

/** Row for the dialog's action buttons, aligned to the end. */
export const DialogFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(function DialogFooter(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={[styles.footer, className].filter(Boolean).join(" ")} {...rest} />;
});
