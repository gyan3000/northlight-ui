import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, ReactElement } from "react";

/**
 * Props for a component that can render as another element (`as="section"`)
 * or hand its props to a child (`asChild`). The element's own props are typed
 * from `as`, so `<Box as="a" href="/x">` is checked and `<Box href="/x">` is not.
 */
export type PolymorphicProps<T extends ElementType, Own = object> = Own & {
  /** Render this element or component instead of the default. */
  as?: T;
  /** Render the single child element instead, merging props onto it (like Button's `asChild`). */
  asChild?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, keyof Own | "as" | "asChild">;

/** The type of a polymorphic component: generic over `as`, with a correctly typed `ref`. */
export type PolymorphicComponent<Default extends ElementType, Own = object> = {
  <T extends ElementType = Default>(
    props: PolymorphicProps<T, Own> & { ref?: ComponentPropsWithRef<T>["ref"] },
  ): ReactElement | null;
  displayName?: string;
};
