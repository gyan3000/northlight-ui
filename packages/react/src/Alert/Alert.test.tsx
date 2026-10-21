import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders title and message", () => {
    render(<Alert title="Saved">Your changes are live.</Alert>);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Your changes are live.")).toBeInTheDocument();
  });

  it.each([
    ["info", "status"],
    ["success", "status"],
    ["warning", "alert"],
    ["danger", "alert"],
  ] as const)("%s tone uses role=%s", (tone, role) => {
    render(<Alert tone={tone}>Message</Alert>);
    expect(screen.getByRole(role)).toBeInTheDocument();
  });

  it("defaults to the info tone", () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByRole("status")).toHaveClass("info");
  });

  it("lets the caller override the role", () => {
    render(<Alert tone="danger" role="status">Message</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("hides the decorative icon from assistive tech", () => {
    const { container } = render(<Alert tone="success">Done</Alert>);
    expect(container.querySelector("svg")?.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards ref, className and props", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref} className="custom" data-testid="a">Message</Alert>);
    expect(ref.current).toBe(screen.getByTestId("a"));
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Alert title="Info">Message</Alert>
        <Alert tone="success" title="Success">Message</Alert>
        <Alert tone="warning">Message only</Alert>
        <Alert tone="danger" title="Danger">Message</Alert>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
