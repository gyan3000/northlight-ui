import { useCallback, useRef, useState } from "react";

/**
 * State that is either owned by the parent (`value` given) or by the component
 * (`defaultValue`), the same way a native input works. `onChange` fires in both
 * modes; only the uncontrolled mode updates its own state.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined;
  defaultValue: T;
  onChange?: (next: T) => void;
}): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  // Read the latest values inside the stable setter without re-creating it.
  const latest = useRef({ isControlled, onChange });
  latest.current = { isControlled, onChange };

  const set = useCallback((next: T) => {
    if (!latest.current.isControlled) setInternal(next);
    latest.current.onChange?.(next);
  }, []);

  return [current, set];
}
