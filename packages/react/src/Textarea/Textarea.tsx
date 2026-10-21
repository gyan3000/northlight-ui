import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type TextareaHTMLAttributes } from "react";
import { joinIds, useFormField } from "../FormField/context";
import inputStyles from "../Input/Input.module.css";
import styles from "./Textarea.module.css";

// Shares the Input look so the two always match.
const textareaVariants = cva([inputStyles.input, styles.textarea], {
  variants: {
    size: { sm: inputStyles.sm, md: inputStyles.md, lg: inputStyles.lg },
  },
  defaultVariants: { size: "md" },
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {
  /** Marks the value as wrong: sets `aria-invalid` and the error styling. */
  invalid?: boolean;
}

/**
 * A multi-line text field. Works controlled (`value` + `onChange`) or
 * uncontrolled (`defaultValue`), like a native `<textarea>`. Inside a
 * `FormField` it gets its id, description and invalid state automatically.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, size, invalid, rows = 3, id, required, "aria-describedby": describedBy, ...rest },
  ref,
) {
  const field = useFormField();
  const isInvalid = invalid ?? field?.invalid ?? false;

  return (
    <textarea
      ref={ref}
      rows={rows}
      id={id ?? field?.controlId}
      required={required ?? field?.required}
      className={[textareaVariants({ size }), className].filter(Boolean).join(" ")}
      aria-invalid={isInvalid || rest["aria-invalid"] || undefined}
      aria-describedby={joinIds(describedBy, field?.describedBy)}
      data-invalid={isInvalid || undefined}
      {...rest}
    />
  );
});
