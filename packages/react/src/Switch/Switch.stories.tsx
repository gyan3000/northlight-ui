import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Switch } from "./Switch";

const meta = {
  title: "Forms/Switch",
  component: Switch,
  args: { children: "Email notifications" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--nl-space-3)" }}>
      <Switch>Off</Switch>
      <Switch defaultChecked>On</Switch>
      <Switch disabled>Disabled off</Switch>
      <Switch disabled defaultChecked>Disabled on</Switch>
      <Switch invalid>Invalid</Switch>
    </div>
  ),
};

export const RightToLeft: Story = {
  render: () => <div dir="rtl"><Switch defaultChecked>الإشعارات</Switch></div>,
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole("switch");
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(toggle).toBeChecked();
  },
};
