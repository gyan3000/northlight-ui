import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Spinner.module.css";

const spinnerVariants = cva(styles.spinner, {
  variants: {
    size: { sm: styles.sm, md: styles.md, lg: styles.lg },
  },
  defaultVariants: { size: "md" },
});

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof spinnerVariants> {
  /** Text announced to screen readers, for example "Loading". Required so the library holds no hardcoded strings. */
  label: string;
}

/** Shows that something is loading. Announced politely through `role="status"`. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, size, label, ...rest },
  ref,
) {
  return (
    <span ref={ref} role="status" className={[spinnerVariants({ size }), className].filter(Boolean).join(" ")} {...rest}>
      <span className={styles.visuallyHidden}>{label}</span>
    </span>
  );
});
