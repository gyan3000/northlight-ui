import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ElementType } from "react";
import type { PolymorphicComponent, PolymorphicProps } from "../internal/polymorphic";
import styles from "./Text.module.css";

const textVariants = cva(styles.text, {
  variants: {
    size: {
      xs: styles.xs,
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
      xl: styles.xl,
      "2xl": styles.xl2,
    },
    weight: { regular: styles.regular, medium: styles.medium, semibold: styles.semibold },
    tone: {
      default: styles.toneDefault,
      muted: styles.toneMuted,
      danger: styles.toneDanger,
      success: styles.toneSuccess,
      warning: styles.toneWarning,
      info: styles.toneInfo,
    },
    truncate: { true: styles.truncate, false: undefined },
  },
  defaultVariants: { size: "md", weight: "regular", tone: "default", truncate: false },
});

export type TextOwnProps = VariantProps<typeof textVariants>;
export type TextProps<T extends ElementType = "span"> = PolymorphicProps<T, TextOwnProps>;

/**
 * Text with the theme's type scale, weights and tones. Renders a `span`; use
 * `as` for the right semantics (`as="p"`, `as="h2"`) and `size` for the look,
 * so a heading's level is never chosen by its size. `truncate` clips a single
 * line with an ellipsis.
 */
export const Text = forwardRef(function Text(
  { as, asChild, className, size, weight, tone, truncate, ...rest }: TextProps<ElementType> & { className?: string },
  ref: React.ForwardedRef<Element>,
) {
  const Comp: ElementType = asChild ? Slot : (as ?? "span");
  return (
    <Comp
      ref={ref}
      className={[textVariants({ size, weight, tone, truncate }), className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}) as PolymorphicComponent<"span", TextOwnProps>;

Text.displayName = "Text";
