import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Badge.module.css";

const badgeVariants = cva(styles.badge, {
  variants: {
    tone: {
      neutral: styles.neutral,
      info: styles.info,
      success: styles.success,
      warning: styles.warning,
      danger: styles.danger,
    },
    size: { sm: styles.sm, md: styles.md },
  },
  defaultVariants: { tone: "neutral", size: "md" },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

/**
 * A short status or count label. Color alone never carries the meaning:
 * always include text such as "Paid" or "3".
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ className, tone, size, ...rest }, ref) {
  return <span ref={ref} className={[badgeVariants({ tone, size }), className].filter(Boolean).join(" ")} {...rest} />;
});
