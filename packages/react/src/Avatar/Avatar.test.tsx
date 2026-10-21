import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("shows the fallback when there is no image and is named by alt", () => {
    render(<Avatar alt="Ada Lovelace" fallback="AL" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("shows the fallback while the image has not loaded (jsdom never loads images)", () => {
    render(<Avatar alt="Ada" src="https://example.com/ada.png" fallback="AL" />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("hides the fallback initials from assistive tech so the name is announced once", () => {
    render(<Avatar alt="Ada Lovelace" fallback="AL" />);
    expect(screen.getByText("AL")).toHaveAttribute("aria-hidden", "true");
  });

  it("is decorative (no role, no name) when alt is empty", () => {
    render(<Avatar alt="" fallback="AL" data-testid="a" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByTestId("a")).not.toHaveAttribute("aria-label");
  });

  it("applies size classes and forwards ref and className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} alt="Ada" fallback="AL" size="lg" className="custom" />);
    expect(ref.current).toHaveClass("lg", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Avatar alt="Ada Lovelace" fallback="AL" />
        <Avatar alt="Grace Hopper" src="https://example.com/g.png" fallback="GH" size="sm" />
        <Avatar alt="" fallback="?" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
