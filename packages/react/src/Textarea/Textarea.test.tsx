import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef, useState } from "react";
import { vi } from "vitest";
import { FormField } from "../FormField";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a labelled multi-line field with 3 rows by default", () => {
    render(<Textarea aria-label="Bio" />);
    expect(screen.getByRole("textbox", { name: "Bio" })).toHaveAttribute("rows", "3");
  });

  it("works uncontrolled with defaultValue", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Bio" defaultValue="Hi" />);
    const field = screen.getByRole("textbox");
    expect(field).toHaveValue("Hi");
    await user.type(field, "!");
    expect(field).toHaveValue("Hi!");
  });

  it("works controlled", async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState("");
      return <Textarea aria-label="Bio" value={value} onChange={(e) => { onChange(e.target.value); setValue(e.target.value.toUpperCase()); }} />;
    }
    render(<Controlled />);
    await userEvent.setup().type(screen.getByRole("textbox"), "ab");
    expect(onChange).toHaveBeenLastCalledWith("Ab");
    expect(screen.getByRole("textbox")).toHaveValue("AB");
  });

  it("accepts a rows override and size classes", () => {
    render(<Textarea aria-label="Bio" rows={6} size="lg" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "6");
    expect(screen.getByRole("textbox")).toHaveClass("lg");
  });

  it("sets aria-invalid when invalid, and respects a passed aria-invalid", () => {
    const { rerender } = render(<Textarea aria-label="Bio" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    rerender(<Textarea aria-label="Bio" aria-invalid="true" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    rerender(<Textarea aria-label="Bio" />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("is not editable when disabled", async () => {
    render(<Textarea aria-label="Bio" disabled />);
    await userEvent.setup().type(screen.getByRole("textbox"), "x");
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Bio" className="custom" />);
    expect(ref.current).toHaveClass("custom");
  });

  it("gets label, description and invalid state from a FormField", () => {
    render(
      <FormField label="Bio" hint="Short and sweet" error="Too long" required>
        <Textarea />
      </FormField>,
    );
    const field = screen.getByRole("textbox", { name: /Bio/ });
    expect(field).toBeRequired();
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription("Short and sweet Too long");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Textarea aria-label="One" />
        <Textarea aria-label="Two" invalid disabled />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
