import * as RadixProgress from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import styles from "./Progress.module.css";

const progressVariants = cva(styles.track, {
  variants: {
    size: { sm: styles.sm, md: styles.md, lg: styles.lg },
  },
  defaultVariants: { size: "md" },
});

export interface ProgressProps
  extends Omit<ComponentPropsWithoutRef<typeof RadixProgress.Root>, "value" | "max" | "aria-label">,
    VariantProps<typeof progressVariants> {
  /** Current amount, from 0 to `max`. Leave it out (or pass `null`) when the total is unknown. */
  value?: number | null;
  /** The value that means "done". Defaults to 100. */
  max?: number;
  /** Accessible name, for example "Uploading report". Required: a bar has no visible text. */
  label: string;
}

/**
 * Shows how far a task has got. With a `value` it fills proportionally; without
 * one it shows a moving bar (indeterminate). Announced as a `progressbar`.
 */
export const Progress = forwardRef<ElementRef<typeof RadixProgress.Root>, ProgressProps>(function Progress(
  { className, size, value = null, max = 100, label, ...rest },
  ref,
) {
  const percent = value === null ? null : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <RadixProgress.Root
      ref={ref}
      value={value}
      max={max}
      aria-label={label}
      className={[progressVariants({ size }), className].filter(Boolean).join(" ")}
      {...rest}
    >
      <RadixProgress.Indicator
        className={styles.indicator}
        style={percent === null ? undefined : { inlineSize: `${percent}%` }}
      />
    </RadixProgress.Root>
  );
});
