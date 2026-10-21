import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { forwardRef, type CSSProperties, type ElementType } from "react";
import type { PolymorphicComponent, PolymorphicProps } from "../internal/polymorphic";
import styles from "./Stack.module.css";

/** Keys of the spacing scale in the tokens (`--nl-space-N`). */
export type StackGap = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12";

const stackVariants = cva(styles.stack, {
  variants: {
    direction: { column: styles.column, row: styles.row },
    align: {
      start: styles.alignStart,
      center: styles.alignCenter,
      end: styles.alignEnd,
      stretch: styles.alignStretch,
      baseline: styles.alignBaseline,
    },
    justify: {
      start: styles.justifyStart,
      center: styles.justifyCenter,
      end: styles.justifyEnd,
      between: styles.justifyBetween,
    },
    wrap: { true: styles.wrap, false: undefined },
  },
  defaultVariants: { direction: "column", align: "stretch", justify: "start", wrap: false },
});

export interface StackOwnProps {
  /** Main axis. `column` stacks vertically, `row` lays out horizontally. */
  direction?: "column" | "row";
  /** Space between children, as a key of the spacing scale. */
  gap?: StackGap;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between";
  /** Let children wrap onto new lines (useful for `row`). */
  wrap?: boolean;
}
export type StackProps<T extends ElementType = "div"> = PolymorphicProps<T, StackOwnProps>;

/**
 * Lays children out in a line with consistent spacing from the theme.
 * Uses logical flex directions, so `row` flips automatically in right-to-left layouts.
 */
export const Stack = forwardRef(function Stack(
  { as, asChild, className, style, direction, gap = "3", align, justify, wrap, ...rest }: StackProps<ElementType> & {
    className?: string;
    style?: CSSProperties;
  },
  ref: React.ForwardedRef<Element>,
) {
  const Comp: ElementType = asChild ? Slot : (as ?? "div");
  return (
    <Comp
      ref={ref}
      className={[stackVariants({ direction, align, justify, wrap }), className].filter(Boolean).join(" ")}
      style={{ gap: `var(--nl-space-${gap})`, ...style }}
      {...rest}
    />
  );
}) as PolymorphicComponent<"div", StackOwnProps>;

Stack.displayName = "Stack";
