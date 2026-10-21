import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Feedback/Badge",
  component: Badge,
  args: { children: "Badge" },
  argTypes: {
    tone: { control: "inline-radio", options: ["neutral", "info", "success", "warning", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-2)", flexWrap: "wrap" }}>
      <Badge {...args} tone="neutral">Draft</Badge>
      <Badge {...args} tone="info">New</Badge>
      <Badge {...args} tone="success">Paid</Badge>
      <Badge {...args} tone="warning">Pending</Badge>
      <Badge {...args} tone="danger">Failed</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-2)", alignItems: "center" }}>
      <Badge {...args} size="sm">Small</Badge>
      <Badge {...args} size="md">Medium</Badge>
    </div>
  ),
};

export const RightToLeft: Story = {
  render: (args) => <div dir="rtl"><Badge {...args} tone="success">مدفوع</Badge></div>,
};
