import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("is hidden from assistive tech", () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveAttribute("aria-hidden", "true");
  });

  it("is a full-width text line by default", () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveClass("text");
  });

  it("takes a width and height", () => {
    render(<Skeleton data-testid="s" variant="rect" width="12rem" height="4rem" />);
    const el = screen.getByTestId("s");
    expect(el).toHaveClass("rect");
    expect(el.style.inlineSize).toBe("12rem");
    expect(el.style.blockSize).toBe("4rem");
  });

  it("makes a circle square from its width", () => {
    render(<Skeleton data-testid="s" variant="circle" width="3rem" />);
    const el = screen.getByTestId("s");
    expect(el).toHaveClass("circle");
    expect(el.style.blockSize).toBe("3rem");
  });

  it("forwards ref, className and style", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Skeleton ref={ref} className="custom" style={{ margin: "1px" }} data-testid="s" />);
    expect(ref.current).toHaveClass("custom");
    expect(ref.current?.style.margin).toBe("1px");
  });

  it("has no axe violations inside a busy region", async () => {
    const { container } = render(
      <div aria-busy="true">
        <Skeleton variant="circle" width="2rem" />
        <Skeleton />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
