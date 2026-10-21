import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "../Input";
import { FormField } from "./FormField";

const meta = {
  title: "Forms/FormField",
  component: FormField,
  args: { label: "Email", hint: "We will never share it.", children: <Input type="email" placeholder="you@example.com" /> },
  decorators: [(Story) => <div style={{ maxInlineSize: "20rem" }}><Story /></div>],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Required: Story = { args: { required: true } };

export const WithError: Story = { args: { error: "Enter a valid email address.", hint: undefined } };

export const HintAndError: Story = { args: { error: "Enter a valid email address.", required: true } };

export const RightToLeft: Story = {
  args: { label: "البريد الإلكتروني", hint: "لن نشاركه أبداً." },
  decorators: [(Story) => <div dir="rtl"><Story /></div>],
};

export const LinkedToInput: Story = {
  args: { error: "Enter a valid email address." },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText("Email");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription(/never share.*valid email/);
    await userEvent.tab();
    await expect(input).toHaveFocus();
  },
};
