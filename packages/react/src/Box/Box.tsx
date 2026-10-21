import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ElementType } from "react";
import type { PolymorphicComponent, PolymorphicProps } from "../internal/polymorphic";
import styles from "./Box.module.css";

const boxVariants = cva(styles.box, {
  variants: {
    padding: {
      "0": styles.p0,
      "1": styles.p1,
      "2": styles.p2,
      "3": styles.p3,
      "4": styles.p4,
      "5": styles.p5,
      "6": styles.p6,
      "8": styles.p8,
    },
    radius: {
      none: styles.rNone,
      sm: styles.rSm,
      md: styles.rMd,
      lg: styles.rLg,
      full: styles.rFull,
    },
    surface: {
      none: undefined,
      base: styles.sBase,
      subtle: styles.sSubtle,
      raised: styles.sRaised,
    },
    bordered: { true: styles.bordered, false: undefined },
  },
  defaultVariants: { padding: "0", radius: "none", surface: "none", bordered: false },
});

export type BoxOwnProps = VariantProps<typeof boxVariants>;
export type BoxProps<T extends ElementType = "div"> = PolymorphicProps<T, BoxOwnProps>;

/**
 * A generic container with token-based padding, radius and surface. Use it
 * instead of a bare `div` when you need spacing or a background from the theme.
 * Render a different element with `as` (`<Box as="section">`) or merge onto a
 * child with `asChild`.
 */
export const Box = forwardRef(function Box(
  { as, asChild, className, padding, radius, surface, bordered, ...rest }: BoxProps<ElementType> & { className?: string },
  ref: React.ForwardedRef<Element>,
) {
  const Comp: ElementType = asChild ? Slot : (as ?? "div");
  return (
    <Comp
      ref={ref}
      className={[boxVariants({ padding, radius, surface, bordered }), className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}) as PolymorphicComponent<"div", BoxOwnProps>;

Box.displayName = "Box";
