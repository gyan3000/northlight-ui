import * as RadixSelect from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";
import { joinIds, useFormField } from "../FormField/context";
import styles from "./Select.module.css";

const triggerVariants = cva(styles.trigger, {
  variants: {
    size: { sm: styles.sm, md: styles.md, lg: styles.lg },
  },
  defaultVariants: { size: "md" },
});

export interface SelectProps extends VariantProps<typeof triggerVariants> {
  /** `SelectItem` elements. */
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Controls whether the list is open. Usually leave it to the component. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Text shown while nothing is selected. */
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /** Name for native form submission. */
  name?: string;
  id?: string;
  className?: string;
  /** Marks the value as wrong: sets `aria-invalid` and the error styling. */
  invalid?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

/**
 * A dropdown for choosing one value from a list. Works controlled
 * (`value` + `onValueChange`) or uncontrolled (`defaultValue`). Inside a
 * `FormField` it gets its id, description and invalid state automatically.
 * Keyboard: Enter, Space or arrows open it; type to jump to an option.
 */
export const Select = forwardRef<ElementRef<typeof RadixSelect.Trigger>, SelectProps>(function Select(
  {
    children,
    value,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    placeholder,
    disabled,
    required,
    name,
    id,
    className,
    size,
    invalid,
    "aria-describedby": describedBy,
    ...aria
  },
  ref,
) {
  const field = useFormField();
  const isInvalid = invalid ?? field?.invalid ?? false;

  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      required={required ?? field?.required}
      name={name}
    >
      <RadixSelect.Trigger
        ref={ref}
        id={id ?? field?.controlId}
        className={[triggerVariants({ size }), className].filter(Boolean).join(" ")}
        aria-invalid={isInvalid || undefined}
        aria-describedby={joinIds(describedBy, field?.describedBy)}
        data-invalid={isInvalid || undefined}
        {...aria}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className={styles.chevron} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className={styles.content} position="popper" sideOffset={8}>
          <RadixSelect.Viewport className={styles.viewport}>{children}</RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
});

export interface SelectItemProps extends Omit<ComponentPropsWithoutRef<typeof RadixSelect.Item>, "value"> {
  /** Value reported to `onValueChange`. Must not be an empty string. */
  value: string;
}

/** One option in a `Select`. The children are the visible label. */
export const SelectItem = forwardRef<ElementRef<typeof RadixSelect.Item>, SelectItemProps>(function SelectItem(
  { className, children, ...rest },
  ref,
) {
  return (
    <RadixSelect.Item ref={ref} className={[styles.item, className].filter(Boolean).join(" ")} {...rest}>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className={styles.indicator}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8.5l3.5 3.5L13 4.5" />
        </svg>
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});
