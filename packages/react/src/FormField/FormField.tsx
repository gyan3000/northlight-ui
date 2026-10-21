import { forwardRef, useId, useMemo, type HTMLAttributes, type ReactNode } from "react";
import { Label } from "../Label";
import { FormFieldContext, joinIds, type FormFieldContextValue } from "./context";
import styles from "./FormField.module.css";

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Visible label text. */
  label: ReactNode;
  /** Helper text shown under the control. */
  hint?: ReactNode;
  /** Error message. When set, the control is marked invalid. */
  error?: ReactNode;
  /** Shows the required marker and marks the control `required`. */
  required?: boolean;
  /** Override the generated control id. */
  controlId?: string;
  /** One `Input` (or another control that reads the form-field context). */
  children: ReactNode;
}

/**
 * Wires a label, a control, hint text and an error message together:
 * the label targets the control, and the hint and error are linked through
 * `aria-describedby`. `Input` picks all of this up automatically.
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  { label, hint, error, required = false, controlId, className, children, ...rest },
  ref,
) {
  const generatedId = useId();
  const id = controlId ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const labelId = `${id}-label`;

  const value = useMemo<FormFieldContextValue>(
    () => ({
      controlId: id,
      labelId,
      describedBy: joinIds(hint ? hintId : undefined, error ? errorId : undefined),
      invalid: Boolean(error),
      required,
    }),
    [id, labelId, hint, error, hintId, errorId, required],
  );

  return (
    <FormFieldContext.Provider value={value}>
      <div ref={ref} className={[styles.field, className].filter(Boolean).join(" ")} {...rest}>
        <Label id={labelId} htmlFor={id} required={required}>
          {label}
        </Label>
        {children}
        {hint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className={styles.error}>
            {error}
          </p>
        )}
      </div>
    </FormFieldContext.Provider>
  );
});
