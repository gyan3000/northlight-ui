import * as RadixSlider from "@radix-ui/react-slider";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import styles from "./Slider.module.css";

export interface SliderProps
  extends Omit<ComponentPropsWithoutRef<typeof RadixSlider.Root>, "value" | "defaultValue" | "onValueChange" | "aria-label"> {
  /** Current values, one per thumb. One value is a normal slider; two make a range. */
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  /** Accessible name, for example "Volume". Required: a slider has no visible text of its own. */
  label: string;
  /** For a range, a name per thumb, for example `["Minimum price", "Maximum price"]`. Falls back to `label`. */
  thumbLabels?: string[];
}

/**
 * Picks a number (or a range) by dragging or with the keyboard: arrows move by
 * `step`, Page Up/Down by ten steps, Home/End jump to the ends. Works controlled
 * (`value` + `onValueChange`) or uncontrolled (`defaultValue`). Each thumb is a
 * separate `slider` for screen readers.
 */
export const Slider = forwardRef<ElementRef<typeof RadixSlider.Root>, SliderProps>(function Slider(
  { className, value, defaultValue, label, thumbLabels, min = 0, ...rest },
  ref,
) {
  const thumbCount = (value ?? defaultValue ?? [min]).length;

  return (
    <RadixSlider.Root
      ref={ref}
      value={value}
      defaultValue={value === undefined ? (defaultValue ?? [min]) : undefined}
      min={min}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <RadixSlider.Track className={styles.track}>
        <RadixSlider.Range className={styles.range} />
      </RadixSlider.Track>
      {Array.from({ length: thumbCount }, (_, i) => (
        <RadixSlider.Thumb key={i} className={styles.thumb} aria-label={thumbLabels?.[i] ?? label} />
      ))}
    </RadixSlider.Root>
  );
});
