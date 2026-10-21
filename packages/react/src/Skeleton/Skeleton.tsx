import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import styles from "./Skeleton.module.css";

const skeletonVariants = cva(styles.skeleton, {
  variants: {
    variant: { text: styles.text, rect: styles.rect, circle: styles.circle },
  },
  defaultVariants: { variant: "text" },
});

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children">, VariantProps<typeof skeletonVariants> {
  /** CSS width, for example `"12rem"` or `"60%"`. Text defaults to full width. */
  width?: CSSProperties["inlineSize"];
  /** CSS height. Text defaults to one line; circles use `width` for both. */
  height?: CSSProperties["blockSize"];
}

/**
 * A placeholder shown while content loads. It is hidden from assistive tech;
 * mark the loading region with `aria-busy="true"` (and announce completion
 * yourself, or use a `Spinner` with a label).
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { className, style, variant, width, height, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={[skeletonVariants({ variant }), className].filter(Boolean).join(" ")}
      style={{ inlineSize: width, blockSize: variant === "circle" ? (height ?? width) : height, ...style }}
      {...rest}
    />
  );
});
