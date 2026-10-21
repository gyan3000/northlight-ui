import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef, useState } from "react";
import { vi } from "vitest";
import { Dialog, DialogContent } from "../Dialog";
import { FormField } from "../FormField";
import { Combobox, type ComboboxOption, type ComboboxProps } from "./Combobox";

const options: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot", disabled: true },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

function Example(props: Partial<ComboboxProps> = {}) {
  return <Combobox aria-label="Fruit" options={options} emptyLabel="No results" placeholder="Pick a fruit" {...props} />;
}

describe("Combobox", () => {
  it("is a labelled combobox, collapsed to start with", () => {
    render(<Example />);
    const input = screen.getByRole("combobox", { name: "Fruit" });
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens the list on click and shows every option", async () => {
    render(<Example />);
    await userEvent.setup().click(screen.getByRole("combobox"));
    expect(await screen.findByRole("listbox", { name: "Fruit" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
  });

  it("filters as you type, case-insensitively", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.type(screen.getByRole("combobox"), "AN");
    const shown = screen.getAllByRole("option").map((o) => o.textContent);
    expect(shown).toEqual(["Banana"]);
  });

  it("highlights the first enabled match and picks it with Enter", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);
    await user.type(screen.getByRole("combobox"), "ap");
    // "Apricot" matches too but is disabled, so the active option is Apple.
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Apple" }).id));
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("apple");
    expect(screen.getByRole("combobox")).toHaveValue("Apple");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("moves with arrow keys, skips disabled options and wraps around", async () => {
    const user = userEvent.setup();
    render(<Example />);
    screen.getByRole("combobox").focus();
    await user.keyboard("{ArrowDown}");
    const active = () => screen.getByRole("option", { selected: false, current: undefined } as never);
    void active;
    const activeId = () => screen.getByRole("combobox").getAttribute("aria-activedescendant");
    const idOf = (name: string) => screen.getByRole("option", { name }).id;
    await waitFor(() => expect(activeId()).toBe(idOf("Apple")));
    await user.keyboard("{ArrowDown}");
    expect(activeId()).toBe(idOf("Banana"));
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(activeId()).toBe(idOf("Apple"));
    await user.keyboard("{ArrowUp}");
    expect(activeId()).toBe(idOf("Cherry"));
    await user.keyboard("{Home}");
    expect(activeId()).toBe(idOf("Apple"));
    await user.keyboard("{End}");
    expect(activeId()).toBe(idOf("Cherry"));
  });

  it("gives the options script-only focusability (for axe's scrollable-region rule) without extra Tab stops", async () => {
    const user = userEvent.setup();
    render(<><Example /><button>After</button></>);
    await user.click(screen.getByRole("combobox"));
    for (const option of await screen.findAllByRole("option")) expect(option).toHaveAttribute("tabindex", "-1");
    // A mouse press on the box (for example the scrollbar) must not blur the input, which would close the list.
    const popup = screen.getByRole("listbox").parentElement as HTMLElement;
    expect(fireEvent.mouseDown(popup)).toBe(false);
    expect(screen.getByRole("combobox")).toHaveFocus();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    // Tab leaves the field straight to the next control: the options are not in the Tab order.
    await user.tab();
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("keeps focus in the field while moving through the list", async () => {
    const user = userEvent.setup();
    render(<Example />);
    screen.getByRole("combobox").focus();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("picks an option with the mouse (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Cherry" }));
    expect(onValueChange).toHaveBeenCalledWith("cherry");
    expect(screen.getByRole("combobox")).toHaveValue("Cherry");
  });

  it("does not pick a disabled option", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);
    await user.click(screen.getByRole("combobox"));
    const apricot = await screen.findByRole("option", { name: "Apricot" });
    expect(apricot).toHaveAttribute("aria-disabled", "true");
    await user.click(apricot);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("marks the chosen option selected and shows all options again when reopened", async () => {
    const user = userEvent.setup();
    render(<Example defaultValue="banana" />);
    expect(screen.getByRole("combobox")).toHaveValue("Banana");
    await user.click(screen.getByRole("combobox"));
    expect(await screen.findAllByRole("option")).toHaveLength(4);
    expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute("aria-selected", "true");
  });

  it("closes on Escape and restores the chosen text", async () => {
    const user = userEvent.setup();
    render(<Example defaultValue="banana" />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.type(input, "xyz");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveValue("Banana");
  });

  it("Escape closes only the list, not an enclosing Dialog", async () => {
    const user = userEvent.setup();
    render(
      <Dialog defaultOpen>
        <DialogContent title="Pick" closeLabel="Close">
          <Example />
        </DialogContent>
      </Dialog>,
    );
    const input = await screen.findByRole("combobox");
    await user.click(input);
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("resets unfinished text to the chosen value on blur", async () => {
    const user = userEvent.setup();
    render(<><Example defaultValue="apple" /><button>Elsewhere</button></>);
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.type(input, "zzz");
    await user.click(screen.getByRole("button", { name: "Elsewhere" }));
    expect(input).toHaveValue("Apple");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("clears the selection when the text is emptied", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example defaultValue="apple" onValueChange={onValueChange} />);
    await user.clear(screen.getByRole("combobox"));
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it("shows an announced message when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(screen.getByRole("status")).toHaveTextContent("No results");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("works controlled, including a change from outside", async () => {
    function Controlled() {
      const [value, setValue] = useState<string | null>("apple");
      return (
        <>
          <Example value={value} onValueChange={setValue} />
          <button onClick={() => setValue("cherry")}>Set cherry</button>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Controlled />);
    expect(screen.getByRole("combobox")).toHaveValue("Apple");
    await user.click(screen.getByRole("button", { name: "Set cherry" }));
    expect(screen.getByRole("combobox")).toHaveValue("Cherry");
  });

  it("does not open when disabled", async () => {
    render(<Example disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
    await userEvent.setup().click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("submits the selected value through a hidden input when it has a name", async () => {
    const user = userEvent.setup();
    const { container } = render(<Example name="fruit" />);
    expect(container.querySelector('input[type="hidden"][name="fruit"]')).toHaveValue("");
    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Banana" }));
    expect(container.querySelector('input[type="hidden"][name="fruit"]')).toHaveValue("banana");
  });

  it("sets aria-invalid when invalid", () => {
    render(<Example invalid />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });

  it("gets its label, description and list name from a FormField", async () => {
    render(
      <FormField label="Fruit" hint="Pick one" error="Required" required>
        <Combobox options={options} emptyLabel="No results" />
      </FormField>,
    );
    const input = screen.getByRole("combobox", { name: /Fruit/ });
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Pick one Required");
    await userEvent.setup().click(input);
    expect(await screen.findByRole("listbox", { name: /Fruit/ })).toBeInTheDocument();
  });

  it("applies size classes and forwards ref and className", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Combobox ref={ref} aria-label="Fruit" options={options} emptyLabel="No results" size="lg" className="custom" />);
    expect(ref.current).toBe(screen.getByRole("combobox"));
    expect(ref.current).toHaveClass("lg");
    expect(ref.current?.parentElement).toHaveClass("custom");
  });

  it("has no axe violations (closed, open, and empty)", async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole("combobox"));
    await screen.findByRole("listbox");
    expect(await axe(container)).toHaveNoViolations();
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(await axe(container)).toHaveNoViolations();
  });
});
