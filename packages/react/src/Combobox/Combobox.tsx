import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { joinIds, useFormField } from "../FormField/context";
import inputStyles from "../Input/Input.module.css";
import { useControllableState } from "../internal/useControllableState";
import styles from "./Combobox.module.css";

const inputVariants = cva([inputStyles.input, styles.input], {
  variants: {
    size: { sm: inputStyles.sm, md: inputStyles.md, lg: inputStyles.lg },
  },
  defaultVariants: { size: "md" },
});

export interface ComboboxOption {
  /** Value reported to `onValueChange`. */
  value: string;
  /** Text shown in the list and used for filtering. */
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps extends VariantProps<typeof inputVariants> {
  options: ComboboxOption[];
  /** Selected value. `null` means nothing is selected. Use with `onValueChange` to control it. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  /** Shown when typing matches no option, for example "No results". Required so nothing is hardcoded. */
  emptyLabel: string;
  disabled?: boolean;
  required?: boolean;
  /** Marks the value as wrong: sets `aria-invalid` and the error styling. */
  invalid?: boolean;
  /** Name for native form submission (submits the selected value). */
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

/** The first enabled index after (`delta` 1) or before (`delta` -1) `from`, wrapping around. */
function nextEnabled(options: ComboboxOption[], from: number, delta: 1 | -1): number {
  const count = options.length;
  for (let step = 1; step <= count; step++) {
    const index = (((from + delta * step) % count) + count) % count;
    if (!options[index]?.disabled) return index;
  }
  return -1;
}

/**
 * A text field with a filterable list of options, for choosing one value from
 * many. Follows the WAI-ARIA combobox pattern: focus stays in the field while
 * Up/Down move through the list, Enter picks, Escape closes. Works controlled
 * (`value` + `onValueChange`) or uncontrolled (`defaultValue`). Inside a
 * `FormField` it gets its id, description and invalid state automatically.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    options,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    placeholder,
    emptyLabel,
    disabled,
    required,
    invalid,
    name,
    id,
    className,
    size,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": describedBy,
  },
  ref,
) {
  const field = useFormField();
  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const optionId = (index: number) => `${uid}-option-${index}`;

  const [value, setValue] = useControllableState<string | null>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const selected = options.find((o) => o.value === value) ?? null;

  const [inputValue, setInputValue] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  // Filter only after the person has typed; opening an already-chosen field shows everything.
  const [typed, setTyped] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the text in step with a selection changed from outside (controlled use).
  useEffect(() => {
    setInputValue(selected?.label ?? "");
    setTyped(false);
  }, [selected?.label]);

  const filtered = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    return typed && query ? options.filter((o) => o.label.toLowerCase().includes(query)) : options;
  }, [options, inputValue, typed]);

  const expanded = open && filtered.length > 0;

  // Whenever the list opens or its contents change, start on the chosen option or the first enabled one.
  useEffect(() => {
    if (!open) return;
    const chosen = typed ? -1 : filtered.findIndex((o) => o.value === value && !o.disabled);
    setActiveIndex(chosen >= 0 ? chosen : nextEnabled(filtered, -1, 1));
  }, [open, filtered, typed, value]);

  useEffect(() => {
    if (expanded && activeIndex >= 0) {
      listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView?.({ block: "nearest" });
    }
  }, [expanded, activeIndex]);

  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    setValue(option.value);
    setInputValue(option.label);
    setTyped(false);
    setOpen(false);
  };

  const close = () => {
    setOpen(false);
    setInputValue(selected?.label ?? "");
    setTyped(false);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setTyped(true);
    setOpen(true);
    if (event.target.value === "" && value !== null) setValue(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) return setOpen(true);
        const delta = event.key === "ArrowDown" ? 1 : -1;
        return setActiveIndex((current) => nextEnabled(filtered, current, delta));
      }
      case "Home":
      case "End": {
        if (!expanded) return;
        event.preventDefault();
        return setActiveIndex(event.key === "Home" ? nextEnabled(filtered, -1, 1) : nextEnabled(filtered, 0, -1));
      }
      case "Enter": {
        const option = expanded ? filtered[activeIndex] : undefined;
        if (!option) return;
        event.preventDefault();
        return choose(option);
      }
      case "Escape": {
        if (!open) return;
        // Normally the dismissable layer handles this first; this covers the rest.
        event.preventDefault();
        return close();
      }
    }
  };

  const isInvalid = invalid ?? field?.invalid ?? false;
  const listLabelledBy = ariaLabelledby ?? field?.labelId;

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <input
        ref={ref}
        type="text"
        role="combobox"
        autoComplete="off"
        id={id ?? field?.controlId}
        className={inputVariants({ size })}
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        required={required ?? field?.required}
        aria-expanded={expanded}
        aria-controls={expanded ? listboxId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={expanded && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-invalid={isInvalid || undefined}
        aria-describedby={joinIds(describedBy, field?.describedBy)}
        data-invalid={isInvalid || undefined}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onClick={() => !disabled && setOpen(true)}
        onBlur={close}
      />
      <span className={styles.chevron} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
      {name && <input type="hidden" name={name} value={value ?? ""} />}
      {open && (
        // A dismissable layer, so inside a Dialog or Popover Escape closes this list first
        // (Radix sends Escape to the topmost layer only) and the container stays open.
        <DismissableLayer
          className={styles.popup}
          // Keeps real focus in the input, so pressing on the box (for example its scrollbar) does not blur
          // the field and close the list.
          onMouseDown={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => {
            event.preventDefault();
            close();
          }}
        >
          {filtered.length > 0 ? (
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              className={styles.list}
              aria-label={listLabelledBy ? undefined : (ariaLabel ?? placeholder)}
              aria-labelledby={listLabelledBy}
            >
              {filtered.map((option, index) => (
                <li
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  data-index={index}
                  data-active={index === activeIndex || undefined}
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled || undefined}
                  // The list scrolls when it is long, and axe requires a scrolling box to contain focusable
                  // content (scrollable-region-focusable). -1 makes each option focusable by script only,
                  // so there are no extra Tab stops; real focus stays in the input.
                  tabIndex={-1}
                  className={styles.option}
                  // Keep focus in the field so the list does not close before the click lands.
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseMove={() => !option.disabled && setActiveIndex(index)}
                  onClick={() => choose(option)}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <span className={styles.check} aria-hidden="true">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8.5l3.5 3.5L13 4.5" />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div role="status" className={styles.empty}>
              {emptyLabel}
            </div>
          )}
        </DismissableLayer>
      )}
    </div>
  );
});
