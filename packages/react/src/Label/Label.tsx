import { forwardRef, type LabelHTMLAttributes } from "react";
import styles from "./Label.module.css";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Shows a required marker. This is visual only: also set `required` on the
   * input so assistive technology announces it.
   */
  required?: boolean;
}

/** Names a form control. Connect it with `htmlFor`, or wrap the control inside it. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, required = false, children, ...rest },
  ref,
) {
  return (
    <label ref={ref} className={[styles.label, className].filter(Boolean).join(" ")} {...rest}>
      {children}
      {required && (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
});
