import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../Button";
import { ToastProvider, useToast, type ToastOptions } from "./Toast";

function Demo({ options }: { options: ToastOptions[] }) {
  const { toast } = useToast();
  return (
    <div style={{ display: "flex", gap: "var(--nl-space-3)", flexWrap: "wrap" }}>
      {options.map((o) => (
        <Button key={String(o.title)} variant="outline" onClick={() => toast(o)}>
          {o.tone ?? "info"}
        </Button>
      ))}
    </div>
  );
}

const meta = {
  title: "Feedback/Toast",
  component: ToastProvider,
  args: { closeLabel: "Close", children: null },
  argTypes: { children: { control: false } },
  parameters: { layout: "centered" },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <Demo
        options={[
          { title: "Heads up", description: "Your trial ends in 3 days.", tone: "info" },
          { title: "Saved", description: "Your changes were published.", tone: "success" },
          { title: "Careful", description: "This affects every team member.", tone: "warning" },
          { title: "Payment failed", description: "Check your card and try again.", tone: "danger" },
        ]}
      />
    </ToastProvider>
  ),
};

/** Fires one toast per tone on mount so every tone is on screen at once. */
function ShowAll() {
  const { toast } = useToast();
  useEffect(() => {
    toast({ title: "Heads up", description: "Your trial ends in 3 days.", tone: "info" });
    toast({ title: "Saved", description: "Your changes were published.", tone: "success" });
    toast({ title: "Careful", description: "This affects every team member.", tone: "warning" });
    toast({ title: "Payment failed", description: "Check your card and try again.", tone: "danger" });
  }, [toast]);
  return null;
}

export const AllTonesVisible: Story = {
  render: (args) => (
    <ToastProvider {...args} duration={600000}>
      <ShowAll />
    </ToastProvider>
  ),
};

export const LongLived: Story = {
  render: (args) => (
    <ToastProvider {...args} duration={60000}>
      <Demo options={[{ title: "Stays for a minute", description: "Close it with the button or swipe it away.", tone: "info" }]} />
    </ToastProvider>
  ),
};

export const RightToLeft: Story = {
  args: { closeLabel: "إغلاق", toastLabel: "إشعار" },
  render: (args) => (
    <div dir="rtl">
      <ToastProvider {...args}>
        <Demo options={[{ title: "تم الحفظ", description: "تم نشر تغييراتك.", tone: "success" }]} />
      </ToastProvider>
    </div>
  ),
};

export const ShowAndClose: Story = {
  render: Tones.render,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(within(canvasElement).getByRole("button", { name: "success" }));
    const close = await body.findByRole("button", { name: "Close" });
    await userEvent.click(close);
    await waitFor(() => expect(body.queryByRole("button", { name: "Close" })).not.toBeInTheDocument());
  },
};
