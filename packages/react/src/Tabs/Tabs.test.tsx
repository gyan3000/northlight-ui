import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef, useState } from "react";
import { vi } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

function Example(props: { onValueChange?: (v: string) => void } = {}) {
  return (
    <Tabs defaultValue="account" {...props}>
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="team" disabled>Team</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings</TabsContent>
      <TabsContent value="billing">Billing settings</TabsContent>
      <TabsContent value="team">Team settings</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("exposes a named tablist, tabs and the active panel", () => {
    render(<Example />);
    expect(screen.getByRole("tablist", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account settings");
  });

  it("switches panels on click", async () => {
    render(<Example />);
    await userEvent.setup().click(screen.getByRole("tab", { name: "Billing" }));
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Billing settings");
  });

  it("moves with arrow keys, skipping disabled tabs, and wraps around", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(screen.getByRole("tab", { name: "Account" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Account" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Account" })).toHaveFocus();
  });

  it("puts the panel in the Tab order after the active tab", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole("tabpanel")).toHaveFocus();
  });

  it("does not select a disabled tab", async () => {
    render(<Example />);
    await userEvent.setup().click(screen.getByRole("tab", { name: "Team" }));
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true");
  });

  it("works controlled", async () => {
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState("account");
      return (
        <Tabs value={value} onValueChange={(v) => { onValueChange(v); setValue(v); }}>
          <TabsList aria-label="Settings">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="account">A</TabsContent>
          <TabsContent value="billing">B</TabsContent>
        </Tabs>
      );
    }
    render(<Controlled />);
    await userEvent.setup().click(screen.getByRole("tab", { name: "Billing" }));
    expect(onValueChange).toHaveBeenCalledWith("billing");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("B");
  });

  it("forwards refs and classNames", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs ref={ref} defaultValue="a" className="root-x">
        <TabsList className="list-x" aria-label="x">
          <TabsTrigger value="a" className="trigger-x">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a" className="content-x">Panel</TabsContent>
      </Tabs>,
    );
    expect(ref.current).toHaveClass("root-x");
    expect(screen.getByRole("tablist")).toHaveClass("list-x");
    expect(screen.getByRole("tab")).toHaveClass("trigger-x");
    expect(screen.getByRole("tabpanel")).toHaveClass("content-x");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
