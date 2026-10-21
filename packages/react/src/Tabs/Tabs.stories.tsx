import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  args: { defaultValue: "account" },
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="legacy" disabled>Legacy</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Update your name, email and password.</TabsContent>
      <TabsContent value="billing">Manage your plan, invoices and payment method.</TabsContent>
      <TabsContent value="team">Invite teammates and set their roles.</TabsContent>
      <TabsContent value="legacy">Not available.</TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <Tabs {...args} style={{ display: "flex", gap: "var(--nl-space-6)" }}>
      <TabsList aria-label="Settings" style={{ flexDirection: "column", borderRadius: "var(--nl-radius-lg)", alignSelf: "flex-start" }}>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <div>
        <TabsContent value="account" style={{ marginBlockStart: 0 }}>Update your name, email and password.</TabsContent>
        <TabsContent value="billing" style={{ marginBlockStart: 0 }}>Manage your plan and invoices.</TabsContent>
      </div>
    </Tabs>
  ),
};

export const RightToLeft: Story = {
  args: { dir: "rtl" },
  decorators: [(Story) => <div dir="rtl"><Story /></div>],
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("tab", { name: "Account" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Billing" })).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("Manage your plan");
  },
};
