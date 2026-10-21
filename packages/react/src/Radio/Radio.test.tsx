import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef, useState } from "react";
import { vi } from "vitest";
import { Radio, RadioGroup } from "./Radio";

function Example(props: Partial<React.ComponentProps<typeof RadioGroup>> = {}) {
  return (
    <RadioGroup aria-label="Plan" {...props}>
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="team" disabled>Team</Radio>
    </RadioGroup>
  );
}

describe("Radio", () => {
  it("exposes a named radiogroup with labelled radios", () => {
    render(<Example />);
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Free" })).not.toBeChecked();
  });

  it("selects on click and unselects the previous one", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("radio", { name: "Free" }));
    await user.click(screen.getByRole("radio", { name: "Pro" }));
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Free" })).not.toBeChecked();
  });

  it("clicking the label text selects it", async () => {
    render(<Example />);
    await userEvent.setup().click(screen.getByText("Pro"));
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
  });

  it("supports defaultValue", () => {
    render(<Example defaultValue="pro" />);
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
  });

  it("works controlled", async () => {
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState("free");
      return <Example value={value} onValueChange={(v) => { onValueChange(v); setValue(v); }} />;
    }
    render(<Controlled />);
    await userEvent.setup().click(screen.getByRole("radio", { name: "Pro" }));
    expect(onValueChange).toHaveBeenCalledWith("pro");
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
  });

  it("is one Tab stop and moves with arrow keys, skipping disabled", async () => {
    const user = userEvent.setup();
    render(<Example defaultValue="free" />);
    await user.tab();
    expect(screen.getByRole("radio", { name: "Free" })).toHaveFocus();
    // Radix moves focus on a timer and only selects while the arrow key is still held,
    // as it is in a real browser, so hold the key instead of tapping it instantly.
    await user.keyboard("{ArrowDown>}");
    await waitFor(() => expect(screen.getByRole("radio", { name: "Pro" })).toHaveFocus());
    await user.keyboard("{/ArrowDown}");
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    await user.keyboard("{ArrowDown>}");
    await waitFor(() => expect(screen.getByRole("radio", { name: "Free" })).toHaveFocus());
    await user.keyboard("{/ArrowDown}");
    expect(screen.getByRole("radio", { name: "Free" })).toBeChecked();
  });

  it("does not select a disabled radio", async () => {
    render(<Example />);
    await userEvent.setup().click(screen.getByRole("radio", { name: "Team" }));
    expect(screen.getByRole("radio", { name: "Team" })).not.toBeChecked();
  });

  it("marks the group invalid", () => {
    render(<Example invalid />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-invalid", "true");
  });

  it("forwards refs and classNames", () => {
    const groupRef = createRef<HTMLDivElement>();
    const radioRef = createRef<HTMLButtonElement>();
    render(
      <RadioGroup ref={groupRef} aria-label="x" className="group-x">
        <Radio ref={radioRef} value="a" className="radio-x">A</Radio>
      </RadioGroup>,
    );
    expect(groupRef.current).toHaveClass("group-x");
    expect(radioRef.current).toBe(screen.getByRole("radio"));
    expect(radioRef.current?.closest("label")).toHaveClass("radio-x");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Example defaultValue="free" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
