import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("is a named progressbar with its value", () => {
    render(<Progress label="Uploading" value={40} />);
    const bar = screen.getByRole("progressbar", { name: "Uploading" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("fills proportionally to value / max", () => {
    render(<Progress label="Steps" value={2} max={4} />);
    const indicator = screen.getByRole("progressbar").firstElementChild as HTMLElement;
    expect(indicator.style.inlineSize).toBe("50%");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "4");
  });

  it("clamps out-of-range values", () => {
    const { rerender } = render(<Progress label="x" value={150} />);
    expect((screen.getByRole("progressbar").firstElementChild as HTMLElement).style.inlineSize).toBe("100%");
    rerender(<Progress label="x" value={-10} />);
    expect((screen.getByRole("progressbar").firstElementChild as HTMLElement).style.inlineSize).toBe("0%");
  });

  it("is indeterminate without a value: no aria-valuenow", () => {
    render(<Progress label="Working" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("data-state", "indeterminate");
  });

  it("applies size classes and forwards ref and className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress ref={ref} label="x" value={1} size="lg" className="custom" />);
    expect(ref.current).toHaveClass("lg", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Progress label="Determinate" value={60} />
        <Progress label="Indeterminate" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
