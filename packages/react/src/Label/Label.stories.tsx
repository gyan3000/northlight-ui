import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./Label";

const meta = {
  title: "Forms/Label",
  component: Label,
  args: { children: "Email address", htmlFor: "field" },
  // A label must point at a control, so every story renders one.
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--nl-space-2)", maxInlineSize: "20rem" }}>
      <Label {...args} />
      <input id="field" style={{ padding: "var(--nl-space-2)" }} />
    </div>
  ),
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Required: Story = { args: { required: true } };

export const RightToLeft: Story = {
  args: { children: "البريد الإلكتروني", required: true },
  decorators: [(Story) => <div dir="rtl"><Story /></div>],
};
