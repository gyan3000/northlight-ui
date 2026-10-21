import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./Switch.module.css";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "role"> {
  /** Label text. Without it, pass `aria-label`. */
  children?: ReactNode;
  /** Marks the value as wrong: sets `aria-invalid`. */
  invalid?: boolean;
}

/**
 * An on/off toggle for settings that apply immediately. Built on a native
 * checkbox with `role="switch"`, so Space toggles it and it submits with forms.
 * Works controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`).
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, children, invalid = false, ...rest },
  ref,
) {
  return (
    <label className={[styles.root, className].filter(Boolean).join(" ")} data-disabled={rest.disabled || undefined}>
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className={styles.input}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {children && <span className={styles.text}>{children}</span>}
    </label>
  );
});
