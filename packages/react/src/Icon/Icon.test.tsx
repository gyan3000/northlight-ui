import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Icon } from "./Icon";

const svg = <svg data-testid="svg" viewBox="0 0 24 24" />;

describe("Icon", () => {
  it("is decorative by default: hidden from assistive tech, no role", () => {
    render(<Icon data-testid="i">{svg}</Icon>);
    expect(screen.getByTestId("i")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("is a named image when given a label", () => {
    render(<Icon label="Warning">{svg}</Icon>);
    const icon = screen.getByRole("img", { name: "Warning" });
    expect(icon).not.toHaveAttribute("aria-hidden");
  });

  it("applies size classes, md by default", () => {
    const { rerender } = render(<Icon data-testid="i">{svg}</Icon>);
    expect(screen.getByTestId("i")).toHaveClass("md");
    rerender(<Icon data-testid="i" size="xl">{svg}</Icon>);
    expect(screen.getByTestId("i")).toHaveClass("xl");
    rerender(<Icon data-testid="i" size="inherit">{svg}</Icon>);
    expect(screen.getByTestId("i")).toHaveClass("inherit");
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Icon ref={ref} className="custom">{svg}</Icon>);
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Icon>{svg}</Icon>
        <Icon label="Info">{svg}</Icon>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
