import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Card.module.css";

const cardVariants = cva(styles.card, {
  variants: {
    variant: { outline: styles.outline, elevated: styles.elevated },
    padding: { none: styles.padNone, sm: styles.padSm, md: styles.padMd, lg: styles.padLg },
  },
  defaultVariants: { variant: "outline", padding: "md" },
});

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  /** Render the child element instead of a `<div>`, for example an `<article>` or `<a>`. */
  asChild?: boolean;
}

/** A bordered or raised surface that groups related content. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, padding, asChild = false, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={[cardVariants({ variant, padding }), className].filter(Boolean).join(" ")} {...rest} />;
});
