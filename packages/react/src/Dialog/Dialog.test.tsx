import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { useState } from "react";
import { vi } from "vitest";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "./Dialog";

function Example({ description = "This cannot be undone." }: { description?: string }) {
  return (
    <Dialog>
      <DialogTrigger>Delete project</DialogTrigger>
      <DialogContent title="Delete project?" description={description} closeLabel="Close">
        <p>All data will be removed.</p>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("is closed until the trigger is activated", () => {
    render(<Example />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens with a name and description, and moves focus inside", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Delete project" }));
    const dialog = await screen.findByRole("dialog", { name: "Delete project?" });
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Delete project" });
    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("closes from the corner close button, which has an accessible name", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Delete project" }));
    await user.click(await screen.findByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes from a DialogClose button", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Delete project" }));
    await user.click(await screen.findByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("keeps Tab focus inside the dialog", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Delete project" }));
    const dialog = await screen.findByRole("dialog");
    for (let i = 0; i < 4; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it("works controlled and reports changes", async () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); setOpen(next); }}>
          <DialogContent title="Hello" closeLabel="Close">Body</DialogContent>
        </Dialog>
      );
    }
    render(<Controlled />);
    await userEvent.setup().click(await screen.findByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("works without a description", async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent title="Plain" closeLabel="Close">Body</DialogContent>
      </Dialog>,
    );
    const dialog = await screen.findByRole("dialog", { name: "Plain" });
    expect(dialog).not.toHaveAttribute("aria-describedby");
  });

  it("forwards className to the content and footer", async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent title="T" closeLabel="Close" className="custom">
          <DialogFooter className="footer-custom" data-testid="f">x</DialogFooter>
        </DialogContent>
      </Dialog>,
    );
    expect(await screen.findByRole("dialog")).toHaveClass("custom");
    expect(screen.getByTestId("f")).toHaveClass("footer-custom");
  });

  it("has no axe violations when open", async () => {
    render(<Dialog defaultOpen><DialogContent title="Title" description="Details" closeLabel="Close">Body</DialogContent></Dialog>);
    await screen.findByRole("dialog");
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
