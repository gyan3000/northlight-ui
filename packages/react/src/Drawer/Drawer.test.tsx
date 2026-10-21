import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { useState } from "react";
import { vi } from "vitest";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTrigger } from "./Drawer";

function Example({ side }: { side?: "start" | "end" | "top" | "bottom" }) {
  return (
    <Drawer>
      <DrawerTrigger>Open filters</DrawerTrigger>
      <DrawerContent title="Filters" description="Narrow the results." closeLabel="Close" side={side}>
        <label>Name <input /></label>
        <DrawerFooter>
          <DrawerClose>Apply</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

describe("Drawer", () => {
  it("is closed until the trigger is activated", () => {
    render(<Example />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens as a named dialog with a description, and moves focus inside", async () => {
    render(<Example />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Open filters" }));
    const drawer = await screen.findByRole("dialog", { name: "Filters" });
    expect(drawer).toHaveAccessibleDescription("Narrow the results.");
    expect(drawer.contains(document.activeElement)).toBe(true);
  });

  it("slides from the end by default and from the chosen side", async () => {
    const { unmount } = render(<Example />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Open filters" }));
    expect(await screen.findByRole("dialog")).toHaveClass("end");
    unmount();
    render(<Example side="bottom" />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Open filters" }));
    expect(await screen.findByRole("dialog")).toHaveClass("bottom");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Open filters" });
    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("closes from the corner button and from a DrawerClose", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Open filters" }));
    await user.click(await screen.findByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "Open filters" }));
    await user.click(await screen.findByRole("button", { name: "Apply" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("keeps Tab focus inside the drawer", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Open filters" }));
    const drawer = await screen.findByRole("dialog");
    for (let i = 0; i < 5; i++) {
      await user.tab();
      expect(drawer.contains(document.activeElement)).toBe(true);
    }
  });

  it("works controlled and reports changes", async () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <Drawer open={open} onOpenChange={(next) => { onOpenChange(next); setOpen(next); }}>
          <DrawerContent title="Hello" closeLabel="Close">Body</DrawerContent>
        </Drawer>
      );
    }
    render(<Controlled />);
    await userEvent.setup().click(await screen.findByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("works without a description", async () => {
    render(<Drawer defaultOpen><DrawerContent title="Plain" closeLabel="Close">Body</DrawerContent></Drawer>);
    expect(await screen.findByRole("dialog", { name: "Plain" })).not.toHaveAttribute("aria-describedby");
  });

  it("forwards className to the panel and footer", async () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent title="T" closeLabel="Close" className="custom">
          <DrawerFooter className="footer-x" data-testid="f">x</DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );
    expect(await screen.findByRole("dialog")).toHaveClass("custom");
    expect(screen.getByTestId("f")).toHaveClass("footer-x");
  });

  it("has no axe violations when open", async () => {
    render(<Drawer defaultOpen><DrawerContent title="Title" description="Details" closeLabel="Close">Body</DrawerContent></Drawer>);
    await screen.findByRole("dialog");
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
