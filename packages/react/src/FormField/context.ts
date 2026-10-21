import { createContext, useContext } from "react";

export interface FormFieldContextValue {
  /** `id` the control must use so the label's `htmlFor` points at it. */
  controlId: string;
  /** `id` of the visible label, so popups (like a combobox list) can be named by it. */
  labelId: string;
  /** Ids of the hint/error elements that currently exist, for `aria-describedby`. */
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/** Returns the surrounding `FormField` state, or `null` when used on its own. */
export function useFormField(): FormFieldContextValue | null {
  return useContext(FormFieldContext);
}

/** Joins aria-describedby id lists, skipping empty values. */
export function joinIds(...ids: Array<string | undefined>): string | undefined {
  const joined = ids.filter(Boolean).join(" ");
  return joined || undefined;
}
