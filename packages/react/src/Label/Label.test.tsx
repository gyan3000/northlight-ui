import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Label } from "./Label";

describe("Label", () => {
  it("names the control it is linked to", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows a required marker that is hidden from assistive tech", () => {
    render(<Label required>Name</Label>);
    const marker = screen.getByText("*");
    expect(marker).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards ref, className and extra props", () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref} className="custom" data-testid="l">Name</Label>);
    expect(ref.current).toBe(screen.getByTestId("l"));
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Label htmlFor="a" required>Name</Label>
        <input id="a" required />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
