import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef, useState } from "react";
import { vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("exposes the switch role with its label", () => {
    render(<Switch>Notifications</Switch>);
    expect(screen.getByRole("switch", { name: "Notifications" })).not.toBeChecked();
  });

  it("toggles uncontrolled by click and by Space", async () => {
    const user = userEvent.setup();
    render(<Switch>Notifications</Switch>);
    const toggle = screen.getByRole("switch");
    await user.click(toggle);
    expect(toggle).toBeChecked();
    await user.keyboard(" ");
    expect(toggle).not.toBeChecked();
  });

  it("supports defaultChecked", () => {
    render(<Switch defaultChecked>Notifications</Switch>);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("works controlled", async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [on, setOn] = useState(false);
      return <Switch checked={on} onChange={(e) => { onChange(e.target.checked); setOn(e.target.checked); }}>Notifications</Switch>;
    }
    render(<Controlled />);
    await userEvent.setup().click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("clicking the label text toggles it", async () => {
    render(<Switch>Notifications</Switch>);
    await userEvent.setup().click(screen.getByText("Notifications"));
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("is not toggleable when disabled", async () => {
    render(<Switch disabled>Notifications</Switch>);
    await userEvent.setup().click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("sets aria-invalid, forwards ref and className", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch ref={ref} invalid className="custom">Notifications</Switch>);
    expect(ref.current).toBe(screen.getByRole("switch"));
    expect(ref.current).toHaveAttribute("aria-invalid", "true");
    expect(ref.current?.closest("label")).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Switch>Off</Switch>
        <Switch defaultChecked>On</Switch>
        <Switch disabled>Disabled</Switch>
        <Switch aria-label="No visible text" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
