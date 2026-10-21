import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  args: { title: "Heads up", children: "You can change this setting at any time." },
  argTypes: { tone: { control: "inline-radio", options: ["info", "success", "warning", "danger"] } },
  decorators: [(Story) => <div style={{ maxInlineSize: "32rem" }}><Story /></div>],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--nl-space-3)" }}>
      <Alert tone="info" title="Info">Your trial ends in 3 days.</Alert>
      <Alert tone="success" title="Saved">Your changes were published.</Alert>
      <Alert tone="warning" title="Careful">This action affects all team members.</Alert>
      <Alert tone="danger" title="Payment failed">Check your card details and try again.</Alert>
    </div>
  ),
};

export const MessageOnly: Story = { args: { title: undefined, tone: "warning" } };

export const RightToLeft: Story = {
  args: { title: "تم الحفظ", children: "تم نشر تغييراتك.", tone: "success" },
  decorators: [(Story) => <div dir="rtl"><Story /></div>],
};
