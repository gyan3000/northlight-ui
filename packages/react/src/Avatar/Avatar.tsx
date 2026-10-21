import * as RadixAvatar from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";
import styles from "./Avatar.module.css";

const avatarVariants = cva(styles.root, {
  variants: {
    size: { sm: styles.sm, md: styles.md, lg: styles.lg },
  },
  defaultVariants: { size: "md" },
});

export interface AvatarProps
  extends Omit<ComponentPropsWithoutRef<typeof RadixAvatar.Root>, "children">,
    VariantProps<typeof avatarVariants> {
  /** Image URL. If it is missing or fails to load, `fallback` is shown. */
  src?: string;
  /** Who or what this is, for example "Ada Lovelace". Pass `""` if the avatar is purely decorative. */
  alt: string;
  /** Shown when there is no image, usually initials such as "AL". */
  fallback: ReactNode;
}

/** A person or entity as a round image, with initials as the fallback. */
export const Avatar = forwardRef<ElementRef<typeof RadixAvatar.Root>, AvatarProps>(function Avatar(
  { className, size, src, alt, fallback, ...rest },
  ref,
) {
  return (
    <RadixAvatar.Root
      ref={ref}
      // One name for the whole avatar, whether the image or the initials are showing.
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      className={[avatarVariants({ size }), className].filter(Boolean).join(" ")}
      {...rest}
    >
      {src && <RadixAvatar.Image className={styles.image} src={src} alt="" />}
      <RadixAvatar.Fallback className={styles.fallback} aria-hidden="true">
        {fallback}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
});
