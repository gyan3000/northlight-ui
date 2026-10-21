import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Label } from "../Label";
import { Input } from "./Input";

const meta = {
  title: "Forms/Input",
  component: Input,
  args: { placeholder: "you@example.com" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    type: { control: "select", options: ["text", "email", "password", "search", "tel", "url"] },
  },
  // Every story shows a label: an unlabelled input is an accessibility bug.
  decorators: [
    (Story) => (
      <div style={{ display: "grid", gap: "var(--nl-space-2)", maxInlineSize: "20rem" }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <>
      <Label htmlFor="field">Email</Label>
      <Input id="field" {...args} />
    </>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <>
      <Input {...args} size="sm" aria-label="Small" placeholder="Small" />
      <Input {...args} size="md" aria-label="Medium" placeholder="Medium" />
      <Input {...args} size="lg" aria-label="Large" placeholder="Large" />
    </>
  ),
};

export const Disabled: Story = { args: { disabled: true, defaultValue: "Can't edit this" } };

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "not-an-email", "aria-describedby": "field-error" },
  render: (args) => (
    <>
      <Label htmlFor="field">Email</Label>
      <Input id="field" {...args} />
      <p id="field-error" style={{ margin: 0, fontSize: "var(--nl-font-size-sm)", color: "var(--nl-color-danger)" }}>
        Enter a valid email address.
      </p>
    </>
  ),
};

export const WithRequiredLabel: Story = {
  render: (args) => (
    <>
      <Label htmlFor="field" required>Email</Label>
      <Input id="field" required {...args} />
    </>
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl" style={{ display: "grid", gap: "var(--nl-space-2)" }}>
      <Label htmlFor="field">البريد الإلكتروني</Label>
      <Input id="field" {...args} placeholder="you@example.com" />
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const input = canvas.getByLabelText("Email");
    await expect(input).toHaveFocus();
    await userEvent.keyboard("hello");
    await expect(input).toHaveValue("hello");
  },
};
