import * as RadixRadio from "@radix-ui/react-radio-group";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";
import styles from "./Radio.module.css";

const cx = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(" ");

export interface RadioGroupProps extends ComponentPropsWithoutRef<typeof RadixRadio.Root> {
  /** Marks the choice as wrong: sets `aria-invalid` and the error styling. */
  invalid?: boolean;
}

/**
 * Groups `Radio`s so exactly one can be chosen. Works controlled
 * (`value` + `onValueChange`) or uncontrolled (`defaultValue`). Arrow keys move
 * and select; Tab enters and leaves the group as one stop. Name the group with
 * `aria-label` or `aria-labelledby`.
 */
export const RadioGroup = forwardRef<ElementRef<typeof RadixRadio.Root>, RadioGroupProps>(function RadioGroup(
  { className, invalid = false, ...rest },
  ref,
) {
  return (
    <RadixRadio.Root
      ref={ref}
      className={cx(styles.group, className)}
      aria-invalid={invalid || undefined}
      data-invalid={invalid || undefined}
      {...rest}
    />
  );
});

export interface RadioProps extends Omit<ComponentPropsWithoutRef<typeof RadixRadio.Item>, "children"> {
  /** Label text. Without it, pass `aria-label`. */
  children?: ReactNode;
}

/** One option in a `RadioGroup`. Clicking the label text selects it too. */
export const Radio = forwardRef<ElementRef<typeof RadixRadio.Item>, RadioProps>(function Radio(
  { className, children, ...rest },
  ref,
) {
  return (
    <label className={cx(styles.root, className)} data-disabled={rest.disabled || undefined}>
      <RadixRadio.Item ref={ref} className={styles.radio} {...rest}>
        <RadixRadio.Indicator className={styles.dot} />
      </RadixRadio.Item>
      {children && <span className={styles.text}>{children}</span>}
    </label>
  );
});
