import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { FormField } from "../FormField";
import { Combobox, type ComboboxOption } from "./Combobox";

const countries: ComboboxOption[] = [
  { value: "au", label: "Australia" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "in", label: "India" },
  { value: "jp", label: "Japan" },
  { value: "no", label: "Norway" },
  { value: "za", label: "South Africa", disabled: true },
  { value: "uk", label: "United Kingdom" },
  { value: "us", label: "United States" },
];

const meta = {
  title: "Forms/Combobox",
  component: Combobox,
  args: { options: countries, emptyLabel: "No countries found", placeholder: "Search countries", "aria-label": "Country" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    options: { control: false },
  },
  decorators: [(Story) => <div style={{ maxInlineSize: "20rem", minBlockSize: "20rem" }}><Story /></div>],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithDefaultValue: Story = { args: { defaultValue: "ca" } };

export const Disabled: Story = { args: { disabled: true, defaultValue: "jp" } };

export const Invalid: Story = { args: { invalid: true } };

export const Open: Story = {
  render: (args) => <Combobox {...args} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox"));
  },
};

export const NoResults: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole("combobox"), "zzz");
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>("no");
    return (
      <div style={{ display: "grid", gap: "var(--nl-space-3)" }}>
        <Combobox {...args} value={value} onValueChange={setValue} />
        <p style={{ margin: 0, fontSize: "var(--nl-font-size-sm)" }}>Selected value: {value ?? "none"}</p>
      </div>
    );
  },
};

export const InFormField: Story = {
  render: (args) => (
    <FormField label="Country" hint="Where you are based." error="Please choose a country." required>
      <Combobox options={args.options} emptyLabel={args.emptyLabel} placeholder="Search countries" />
    </FormField>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Combobox
        aria-label="الدولة"
        placeholder="ابحث عن دولة"
        emptyLabel="لا توجد نتائج"
        options={[
          { value: "eg", label: "مصر" },
          { value: "sa", label: "السعودية" },
          { value: "ma", label: "المغرب" },
        ]}
      />
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox");
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard("jap");
    await userEvent.keyboard("{Enter}");
    await expect(input).toHaveValue("Japan");
  },
};
