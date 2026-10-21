import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { vi } from "vitest";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("is hidden until the trigger is focused", async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Save changes"><button>Save</button></Tooltip>);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await user.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Save changes");
  });

  it("describes the trigger for assistive technology", async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Save changes"><button>Save</button></Tooltip>);
    await user.tab();
    await screen.findByRole("tooltip");
    expect(screen.getByRole("button", { name: "Save" })).toHaveAccessibleDescription("Save changes");
  });

  it("opens on hover after the delay", async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Save changes" delayDuration={0}><button>Save</button></Tooltip>);
    await user.hover(screen.getByRole("button"));
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Save changes"><button>Save</button></Tooltip>);
    await user.tab();
    await screen.findByRole("tooltip");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  it("reports open changes and supports defaultOpen", async () => {
    const onOpenChange = vi.fn();
    render(<Tooltip content="Hi" defaultOpen onOpenChange={onOpenChange}><button>Go</button></Tooltip>);
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
    await userEvent.setup().keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("has no axe violations when open", async () => {
    render(<Tooltip content="Save changes" defaultOpen><button>Save</button></Tooltip>);
    await screen.findByRole("tooltip");
    // The page-level "content must be inside a landmark" rule does not apply to an isolated component.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
