import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./Progress";

const meta = {
  title: "Feedback/Progress",
  component: Progress,
  args: { label: "Uploading report", value: 60 },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
  decorators: [(Story) => <div style={{ maxInlineSize: "24rem" }}><Story /></div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--nl-space-4)" }}>
      <Progress {...args} size="sm" label="Small" />
      <Progress {...args} size="md" label="Medium" />
      <Progress {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Empty: Story = { args: { value: 0 } };

export const Complete: Story = { args: { value: 100 } };

export const Indeterminate: Story = { args: { value: null, label: "Processing" } };

export const CustomMax: Story = { args: { value: 3, max: 5, label: "Step 3 of 5" } };

export const RightToLeft: Story = {
  render: (args) => <div dir="rtl"><Progress {...args} label="جارٍ الرفع" /></div>,
};
