import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef } from "react";
import { vi } from "vitest";
import { IconButton } from "./IconButton";

const icon = <svg data-testid="icon" viewBox="0 0 24 24" />;

describe("IconButton", () => {
  it("is a button named by its label, not by the icon", () => {
    render(<IconButton icon={icon} label="Delete" />);
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("calls onClick and works from the keyboard", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<IconButton icon={icon} label="Delete" onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("passes variant, tone and size through to Button", () => {
    render(<IconButton icon={icon} label="Delete" variant="ghost" tone="danger" size="lg" />);
    expect(screen.getByRole("button")).toHaveClass("ghost", "danger", "lg", "square");
  });

  it("defaults to md", () => {
    render(<IconButton icon={icon} label="Delete" />);
    expect(screen.getByRole("button")).toHaveClass("md");
  });

  it("supports loading and disabled", () => {
    const { rerender } = render(<IconButton icon={icon} label="Save" loading />);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("aria-busy", "true");
    rerender(<IconButton icon={icon} label="Save" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} icon={icon} label="Delete" className="custom" />);
    expect(ref.current).toBe(screen.getByRole("button"));
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <IconButton icon={icon} label="One" />
        <IconButton icon={icon} label="Two" variant="outline" size="sm" />
        <IconButton icon={icon} label="Three" tone="danger" disabled />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
