import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./Button.module.css";

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      solid: styles.solid,
      outline: styles.outline,
      ghost: styles.ghost,
    },
    tone: {
      accent: styles.accent,
      danger: styles.danger,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
  },
  defaultVariants: { variant: "solid", tone: "accent", size: "md" },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the child element instead of a `<button>`, merging props onto it. */
  asChild?: boolean;
  /** Shows a spinner and blocks interaction. Sets `aria-busy` and keeps the label. */
  loading?: boolean;
  /** Icon shown before the label. Decorative: hidden from assistive tech. Replaced by the spinner while `loading`. */
  startIcon?: ReactNode;
  /** Icon shown after the label. Decorative: hidden from assistive tech. */
  endIcon?: ReactNode;
}

/**
 * Triggers an action. Use `variant` for emphasis, `tone` for meaning
 * (`danger` for destructive actions) and `size` for density.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, tone, size, asChild = false, loading = false, startIcon, endIcon, disabled, type, children, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  const classes = [buttonVariants({ variant, tone, size }), className].filter(Boolean).join(" ");

  return (
    <Comp
      ref={ref}
      className={classes}
      // `aria-disabled` while loading keeps the button focusable so
      // screen-reader users do not lose their place.
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      disabled={disabled}
      type={asChild ? undefined : (type ?? "button")}
      {...rest}
      onClick={loading ? (e) => e.preventDefault() : rest.onClick}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : (
            startIcon && (
              <span className={styles.icon} aria-hidden="true">
                {startIcon}
              </span>
            )
          )}
          {children}
          {endIcon && (
            <span className={styles.icon} aria-hidden="true">
              {endIcon}
            </span>
          )}
        </>
      )}
    </Comp>
  );
});
