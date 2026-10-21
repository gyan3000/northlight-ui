import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef, useState } from "react";
import { vi } from "vitest";
import { Label } from "../Label";
import { Input } from "./Input";

describe("Input", () => {
  it("renders a text input by default", () => {
    render(<Input aria-label="Name" />);
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("type", "text");
  });

  it("works uncontrolled with defaultValue", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" defaultValue="Ada" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("Ada");
    await user.type(input, "!");
    expect(input).toHaveValue("Ada!");
  });

  it("works controlled with value + onChange", async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState("");
      return <Input aria-label="Name" value={value} onChange={(e) => { onChange(e.target.value); setValue(e.target.value.toUpperCase()); }} />;
    }
    render(<Controlled />);
    await userEvent.setup().type(screen.getByRole("textbox"), "ab");
    expect(onChange).toHaveBeenLastCalledWith("Ab"); // "A" was stored uppercased, then "b" typed after it
    expect(screen.getByRole("textbox")).toHaveValue("AB");
  });

  it("sets aria-invalid when invalid", () => {
    render(<Input aria-label="Name" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid by default, but respects a passed aria-invalid", () => {
    const { rerender } = render(<Input aria-label="Name" />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
    rerender(<Input aria-label="Name" aria-invalid="true" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not accept typing when disabled", async () => {
    render(<Input aria-label="Name" disabled />);
    await userEvent.setup().type(screen.getByRole("textbox"), "x");
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("applies size classes and forwards ref/className", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Name" size="lg" className="custom" />);
    expect(ref.current).toHaveClass("lg", "custom");
  });

  it("supports other input types", () => {
    render(<Input aria-label="Email" type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("has no axe violations when labelled", async () => {
    const { container } = render(
      <>
        <Label htmlFor="a">Name</Label>
        <Input id="a" />
        <Label htmlFor="b">Email</Label>
        <Input id="b" invalid aria-describedby="b-error" />
        <p id="b-error">Enter a valid email</p>
        <Input aria-label="Disabled" disabled />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
