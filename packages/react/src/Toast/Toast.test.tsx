import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { vi } from "vitest";
import { ToastProvider, useToast, type ToastOptions } from "./Toast";

function Trigger({ options }: { options: ToastOptions }) {
  const { toast } = useToast();
  return <button onClick={() => toast(options)}>Show</button>;
}

const openToasts = () => document.querySelectorAll('li[data-state="open"]');

function setup(options: ToastOptions, provider: { duration?: number } = {}) {
  return render(
    <ToastProvider closeLabel="Close" {...provider}>
      <Trigger options={options} />
    </ToastProvider>,
  );
}

describe("Toast", () => {
  it("shows nothing until toast() is called", () => {
    setup({ title: "Saved" });
    expect(openToasts()).toHaveLength(0);
  });

  it("shows the title and description", async () => {
    setup({ title: "Saved", description: "Your changes are live." });
    await userEvent.setup().click(screen.getByRole("button", { name: "Show" }));
    await waitFor(() => expect(openToasts()).toHaveLength(1));
    expect(openToasts()[0]).toHaveTextContent("Saved");
    expect(openToasts()[0]).toHaveTextContent("Your changes are live.");
  });

  it("stacks several toasts", async () => {
    const user = userEvent.setup();
    setup({ title: "Saved" });
    await user.click(screen.getByRole("button", { name: "Show" }));
    await user.click(screen.getByRole("button", { name: "Show" }));
    await waitFor(() => expect(openToasts()).toHaveLength(2));
  });

  it("closes from its close button, which has an accessible name", async () => {
    const user = userEvent.setup();
    setup({ title: "Saved" });
    await user.click(screen.getByRole("button", { name: "Show" }));
    await waitFor(() => expect(openToasts()).toHaveLength(1));
    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(openToasts()).toHaveLength(0));
  });

  it("closes itself after its duration", async () => {
    setup({ title: "Saved", duration: 400 });
    await userEvent.setup().click(screen.getByRole("button", { name: "Show" }));
    await waitFor(() => expect(openToasts()).toHaveLength(1));
    await waitFor(() => expect(openToasts()).toHaveLength(0), { timeout: 3000 });
  });

  it("dismiss() closes a toast by id", async () => {
    function Both() {
      const { toast, dismiss } = useToast();
      return (
        <>
          <button onClick={() => dismiss(toast({ title: "Gone soon" }))}>Show and dismiss</button>
        </>
      );
    }
    render(<ToastProvider closeLabel="Close"><Both /></ToastProvider>);
    await userEvent.setup().click(screen.getByRole("button", { name: "Show and dismiss" }));
    await waitFor(() => expect(openToasts()).toHaveLength(0));
  });

  it("uses a named notifications region", async () => {
    render(
      <ToastProvider closeLabel="Close" viewportLabel="Alerts">
        <Trigger options={{ title: "Hi" }} />
      </ToastProvider>,
    );
    expect(screen.getByRole("region", { name: "Alerts" })).toBeInTheDocument();
  });

  it("renders every tone", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider closeLabel="Close">
        {(["info", "success", "warning", "danger"] as const).map((tone) => (
          <Trigger key={tone} options={{ title: tone, tone }} />
        ))}
      </ToastProvider>,
    );
    for (const button of screen.getAllByRole("button", { name: "Show" })) await user.click(button);
    await waitFor(() => expect(openToasts()).toHaveLength(4));
  });

  it("useToast throws outside a provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useToast())).toThrow(/ToastProvider/);
    spy.mockRestore();
  });

  it("has no axe violations with a toast showing", async () => {
    setup({ title: "Saved", description: "Done" });
    await userEvent.setup().click(screen.getByRole("button", { name: "Show" }));
    await waitFor(() => expect(openToasts()).toHaveLength(1));
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
