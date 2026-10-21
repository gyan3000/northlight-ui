import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("is a status region named by its label", () => {
    render(<Spinner label="Loading orders" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading orders");
  });

  it("applies size classes and forwards ref, className and props", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} label="Loading" size="lg" className="custom" data-testid="s" />);
    expect(ref.current).toBe(screen.getByTestId("s"));
    expect(ref.current).toHaveClass("lg", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Spinner label="Loading" size="sm" />
        <Spinner label="Saving" />
        <Spinner label="Fetching" size="lg" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
