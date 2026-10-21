import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { FormField } from "../FormField";
import { Select, SelectItem } from "./Select";

const items = (
  <>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="cherry" disabled>Cherry (sold out)</SelectItem>
    <SelectItem value="grape">Grape</SelectItem>
  </>
);

const meta = {
  title: "Forms/Select",
  component: Select,
  args: { "aria-label": "Fruit", placeholder: "Pick a fruit", children: items },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    children: { control: false },
  },
  decorators: [(Story) => <div style={{ maxInlineSize: "18rem", minBlockSize: "18rem" }}><Story /></div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--nl-space-3)" }}>
      <Select {...args} size="sm" aria-label="Small" />
      <Select {...args} size="md" aria-label="Medium" />
      <Select {...args} size="lg" aria-label="Large" />
    </div>
  ),
};

export const Open: Story = { args: { defaultOpen: true, defaultValue: "apple" } };

export const WithDefaultValue: Story = { args: { defaultValue: "banana" } };

export const Disabled: Story = { args: { disabled: true, defaultValue: "apple" } };

export const Invalid: Story = { args: { invalid: true } };

export const InFormField: Story = {
  render: () => (
    <FormField label="Favorite fruit" hint="You can change this later." error="Please choose a fruit." required>
      <Select placeholder="Pick a fruit">{items}</Select>
    </FormField>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Select aria-label="فاكهة" placeholder="اختر فاكهة">
        <SelectItem value="apple">تفاح</SelectItem>
        <SelectItem value="banana">موز</SelectItem>
      </Select>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  args: { defaultValue: "apple" },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox");
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await body.findByRole("listbox");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(trigger).toHaveTextContent("Banana"));
  },
};
