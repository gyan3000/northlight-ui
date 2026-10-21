import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Input } from "../Input";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("links the label to the input", () => {
    render(<FormField label="Email"><Input /></FormField>);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("describes the input with the hint", () => {
    render(<FormField label="Email" hint="We never share it"><Input /></FormField>);
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription("We never share it");
  });

  it("marks the input invalid and describes it with the error", () => {
    render(<FormField label="Email" error="Enter a valid email"><Input /></FormField>);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a valid email");
  });

  it("describes with both hint and error", () => {
    render(<FormField label="Email" hint="Work address" error="Required"><Input /></FormField>);
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription("Work address Required");
  });

  it("passes required to the input and shows the marker", () => {
    render(<FormField label="Email" required><Input /></FormField>);
    expect(screen.getByRole("textbox")).toBeRequired();
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps a caller's own aria-describedby and explicit id", () => {
    render(
      <>
        <p id="extra">Extra help</p>
        <FormField label="Email" hint="Hint" controlId="my-id"><Input aria-describedby="extra" /></FormField>
      </>,
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "my-id");
    expect(input).toHaveAccessibleDescription("Extra help Hint");
  });

  it("lets an explicit invalid prop win over the field state", () => {
    render(<FormField label="Email" error="Bad"><Input invalid={false} /></FormField>);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("forwards ref and className to the wrapper", () => {
    const ref = createRef<HTMLDivElement>();
    render(<FormField ref={ref} className="custom" label="Email"><Input /></FormField>);
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <FormField label="Name" required><Input /></FormField>
        <FormField label="Email" hint="Hint" error="Error"><Input /></FormField>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
