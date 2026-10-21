import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type InputHTMLAttributes } from "react";
import { joinIds, useFormField } from "../FormField/context";
import styles from "./Input.module.css";

const inputVariants = cva(styles.input, {
  variants: {
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
  },
  defaultVariants: { size: "md" },
});

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Marks the value as wrong: sets `aria-invalid` and the error styling. */
  invalid?: boolean;
}

/**
 * A single-line text field. Works controlled (`value` + `onChange`) or
 * uncontrolled (`defaultValue`), exactly like a native `<input>`.
 * Inside a `FormField` it gets its id, description and invalid state automatically;
 * on its own, pair it with a `Label` (or `aria-label`).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, invalid, type = "text", id, required, "aria-describedby": describedBy, ...rest },
  ref,
) {
  const field = useFormField();
  const isInvalid = invalid ?? field?.invalid ?? false;

  return (
    <input
      ref={ref}
      type={type}
      id={id ?? field?.controlId}
      required={required ?? field?.required}
      className={[inputVariants({ size }), className].filter(Boolean).join(" ")}
      aria-invalid={isInvalid || rest["aria-invalid"] || undefined}
      aria-describedby={joinIds(describedBy, field?.describedBy)}
      data-invalid={isInvalid || undefined}
      {...rest}
    />
  );
});
