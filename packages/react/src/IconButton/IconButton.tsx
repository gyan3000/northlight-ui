import { forwardRef, type ReactNode } from "react";
import { Button, type ButtonProps } from "../Button";
import styles from "./IconButton.module.css";

export interface IconButtonProps extends Omit<ButtonProps, "children" | "startIcon" | "endIcon" | "aria-label"> {
  /** The icon. Decorative: the `label` is what assistive technology announces. */
  icon: ReactNode;
  /** Accessible name, for example "Delete". Required because there is no visible text. */
  label: string;
}

/**
 * A square button that shows only an icon. Everything `Button` supports
 * (variant, tone, size, loading, asChild) works here too. Pair it with a
 * `Tooltip` so sighted users can see the label.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, size = "md", className, ...rest },
  ref,
) {
  return (
    <Button
      ref={ref}
      size={size}
      aria-label={label}
      className={[styles.square, styles[size ?? "md"], className].filter(Boolean).join(" ")}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </Button>
  );
});
