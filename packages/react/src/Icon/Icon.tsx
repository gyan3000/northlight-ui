import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Icon.module.css";

const iconVariants = cva(styles.icon, {
  variants: {
    size: { sm: styles.sm, md: styles.md, lg: styles.lg, xl: styles.xl, inherit: styles.inherit },
  },
  defaultVariants: { size: "md" },
});

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children">, VariantProps<typeof iconVariants> {
  /** The SVG (or any element) to draw. Use `currentColor` for stroke/fill so it follows the text color. */
  children: ReactNode;
  /**
   * Accessible name. Give one only when the icon carries meaning on its own;
   * leave it out for decoration (the usual case, next to visible text).
   */
  label?: string;
}

/**
 * Sizes and aligns an icon consistently, and handles its accessibility:
 * decorative by default (`aria-hidden`), or a named image when you pass `label`.
 * It works with any icon source: inline SVG, Font Awesome, Lucide, Heroicons.
 */
export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  { className, size, label, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={[iconVariants({ size }), className].filter(Boolean).join(" ")}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      {children}
    </span>
  );
});
