import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FormField } from "../FormField";
import { Textarea } from "./Textarea";

const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  args: { "aria-label": "Bio", placeholder: "Tell us about yourself" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
  decorators: [(Story) => <div style={{ maxInlineSize: "24rem" }}><Story /></div>],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--nl-space-3)" }}>
      <Textarea {...args} size="sm" aria-label="Small" rows={2} />
      <Textarea {...args} size="md" aria-label="Medium" rows={2} />
      <Textarea {...args} size="lg" aria-label="Large" rows={2} />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true, defaultValue: "Can't edit this" } };

export const Invalid: Story = { args: { invalid: true, defaultValue: "Too short" } };

export const InFormField: Story = {
  render: () => (
    <FormField label="Bio" hint="Up to 200 characters." error="Please write at least 20 characters." required>
      <Textarea placeholder="Tell us about yourself" />
    </FormField>
  ),
};

export const RightToLeft: Story = {
  render: (args) => <div dir="rtl"><Textarea {...args} aria-label="نبذة" placeholder="أخبرنا عن نفسك" /></div>,
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole("textbox");
    await userEvent.tab();
    await expect(field).toHaveFocus();
    await userEvent.keyboard("line one{Enter}line two");
    await expect(field).toHaveValue("line one\nline two");
  },
};
