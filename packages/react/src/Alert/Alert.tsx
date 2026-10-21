import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { toneIcons, type Tone } from "../internal/ToneIcons";
import styles from "./Alert.module.css";

const alertVariants = cva(styles.alert, {
  variants: {
    tone: {
      info: styles.info,
      success: styles.success,
      warning: styles.warning,
      danger: styles.danger,
    },
  },
  defaultVariants: { tone: "info" },
});

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof alertVariants> {
  /** Short heading shown above the message. */
  title?: ReactNode;
}

/**
 * An inline message about the state of the page or a form. `danger` and
 * `warning` use `role="alert"` (announced immediately); `info` and `success`
 * use `role="status"` (announced politely). Pass `role` to override.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, tone, title, children, role, ...rest },
  ref,
) {
  const resolvedTone: Tone = tone ?? "info";
  const defaultRole = resolvedTone === "danger" || resolvedTone === "warning" ? "alert" : "status";

  return (
    <div
      ref={ref}
      role={role ?? defaultRole}
      className={[alertVariants({ tone: resolvedTone }), className].filter(Boolean).join(" ")}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        {toneIcons[resolvedTone]}
      </span>
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.body}>{children}</div>}
      </div>
    </div>
  );
});
