import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef } from "react";
import { vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button with its label and defaults to type=button", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("calls onClick, and works from the keyboard", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Save</Button>);
    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Save</Button>);
    await userEvent.setup().click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("when loading: stays focusable, is busy, and ignores clicks", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button loading onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards ref, className and extra props", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} className="custom" data-testid="b">Save</Button>);
    expect(ref.current).toBe(screen.getByTestId("b"));
    expect(ref.current).toHaveClass("custom");
  });

  it("supports variant, tone and size classes", () => {
    render(<Button variant="outline" tone="danger" size="lg">Delete</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("outline", "danger", "lg");
  });

  it("asChild renders the child element (e.g. a link) with button styling", () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).not.toHaveAttribute("type");
    expect(link).toHaveClass("button");
  });

  it("renders start and end icons as decorative and keeps the accessible name", () => {
    render(
      <Button startIcon={<svg data-testid="start" />} endIcon={<svg data-testid="end" />}>
        Next
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(screen.getByTestId("start").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("end").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("swaps the start icon for the spinner while loading", () => {
    render(<Button loading startIcon={<svg data-testid="start" />}>Save</Button>);
    expect(screen.queryByTestId("start")).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Button>Default</Button>
        <Button variant="outline" tone="danger">Delete</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
        <Button startIcon={<svg viewBox="0 0 16 16" />} endIcon={<svg viewBox="0 0 16 16" />}>With icons</Button>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
