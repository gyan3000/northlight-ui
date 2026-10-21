import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef, useState } from "react";
import { vi } from "vitest";
import { FormField } from "../FormField";
import { Select, SelectItem } from "./Select";

const options = (
  <>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="cherry" disabled>Cherry</SelectItem>
  </>
);

describe("Select", () => {
  it("shows the placeholder and is a labelled combobox", () => {
    render(<Select aria-label="Fruit" placeholder="Pick a fruit">{options}</Select>);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toHaveTextContent("Pick a fruit");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a listbox with options on click", async () => {
    render(<Select aria-label="Fruit">{options}</Select>);
    await userEvent.setup().click(screen.getByRole("combobox"));
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("selects an option and reports it (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Select aria-label="Fruit" onValueChange={onValueChange}>{options}</Select>);
    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Banana" }));
    expect(onValueChange).toHaveBeenCalledWith("banana");
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveTextContent("Banana"));
  });

  it("supports defaultValue", () => {
    render(<Select aria-label="Fruit" defaultValue="apple">{options}</Select>);
    expect(screen.getByRole("combobox")).toHaveTextContent("Apple");
  });

  it("works controlled", async () => {
    function Controlled() {
      const [value, setValue] = useState("apple");
      return <Select aria-label="Fruit" value={value} onValueChange={setValue}>{options}</Select>;
    }
    const user = userEvent.setup();
    render(<Controlled />);
    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Banana" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveTextContent("Banana"));
  });

  it("opens from the keyboard and selects with arrows and Enter", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Fruit" defaultValue="apple">{options}</Select>);
    await user.tab();
    expect(screen.getByRole("combobox")).toHaveFocus();
    await user.keyboard("{Enter}");
    await screen.findByRole("listbox");
    await user.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveTextContent("Banana"));
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("closes on Escape without changing the value", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Fruit" defaultValue="apple">{options}</Select>);
    await user.click(screen.getByRole("combobox"));
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    expect(screen.getByRole("combobox")).toHaveTextContent("Apple");
  });

  it("does not open when disabled", async () => {
    render(<Select aria-label="Fruit" disabled>{options}</Select>);
    expect(screen.getByRole("combobox")).toBeDisabled();
    await userEvent.setup().click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("sets aria-invalid when invalid", () => {
    render(<Select aria-label="Fruit" invalid>{options}</Select>);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });

  it("applies size classes and forwards ref and className", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Select ref={ref} aria-label="Fruit" size="lg" className="custom">{options}</Select>);
    expect(ref.current).toBe(screen.getByRole("combobox"));
    expect(ref.current).toHaveClass("lg", "custom");
  });

  it("gets its label, description and invalid state from a FormField", () => {
    render(
      <FormField label="Fruit" hint="Pick one" error="Required">
        <Select placeholder="Choose">{options}</Select>
      </FormField>,
    );
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAccessibleDescription("Pick one Required");
  });

  it("has no axe violations (closed)", async () => {
    const { container } = render(
      <>
        <Select aria-label="Fruit" placeholder="Pick">{options}</Select>
        <Select aria-label="Disabled" disabled defaultValue="apple">{options}</Select>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (open)", async () => {
    render(<Select aria-label="Fruit" placeholder="Pick">{options}</Select>);
    await userEvent.setup().click(screen.getByRole("combobox"));
    await screen.findByRole("listbox");
    // The page-level "content must be inside a landmark" rule does not apply to an isolated component.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
