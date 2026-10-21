import { forwardRef, useCallback, useEffect, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Label text. Without it, pass `aria-label`. */
  children?: ReactNode;
  /** Mixed state, for a parent that controls a partly-selected group. */
  indeterminate?: boolean;
  /** Marks the value as wrong: sets `aria-invalid` and the error styling. */
  invalid?: boolean;
}

/**
 * A native checkbox with custom visuals, so keyboard, form submission and
 * screen-reader behavior come from the browser. Works controlled
 * (`checked` + `onChange`) or uncontrolled (`defaultChecked`).
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, children, indeterminate = false, invalid = false, ...rest },
  forwardedRef,
) {
  const innerRef = useRef<HTMLInputElement | null>(null);

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  // `indeterminate` is a DOM property with no HTML attribute.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={[styles.root, className].filter(Boolean).join(" ")} data-disabled={rest.disabled || undefined}>
      <input
        ref={setRefs}
        type="checkbox"
        className={styles.input}
        aria-invalid={invalid || undefined}
        data-invalid={invalid || undefined}
        {...rest}
      />
      <span className={styles.box} aria-hidden="true">
        <svg className={styles.check} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8.5l3.5 3.5L13 4.5" />
        </svg>
        <svg className={styles.dash} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M4 8h8" />
        </svg>
      </span>
      {children && <span className={styles.text}>{children}</span>}
    </label>
  );
});
