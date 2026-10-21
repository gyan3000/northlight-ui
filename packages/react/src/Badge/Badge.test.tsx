import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its text with neutral md styling by default", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toHaveClass("neutral", "md");
  });

  it("applies tone and size classes", () => {
    render(<Badge tone="danger" size="sm">Failed</Badge>);
    expect(screen.getByText("Failed")).toHaveClass("danger", "sm");
  });

  it("forwards ref, className and props", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref} className="custom" data-testid="b">3</Badge>);
    expect(ref.current).toBe(screen.getByTestId("b"));
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        {(["neutral", "info", "success", "warning", "danger"] as const).map((tone) => (
          <Badge key={tone} tone={tone}>{tone}</Badge>
        ))}
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
