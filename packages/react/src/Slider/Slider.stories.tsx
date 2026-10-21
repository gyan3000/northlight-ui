import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Slider } from "./Slider";

const meta = {
  title: "Forms/Slider",
  component: Slider,
  args: { label: "Volume", defaultValue: [40] },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
  decorators: [(Story) => <div style={{ maxInlineSize: "24rem" }}><Story /></div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Range: Story = {
  args: { label: "Price", defaultValue: [20, 80], thumbLabels: ["Minimum price", "Maximum price"] },
};

export const Stepped: Story = { args: { step: 10, defaultValue: [50] } };

export const Disabled: Story = { args: { disabled: true } };

export const Vertical: Story = { args: { orientation: "vertical" } };

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState([30]);
    return (
      <div style={{ display: "grid", gap: "var(--nl-space-3)" }}>
        <Slider {...args} value={value} onValueChange={setValue} />
        <p style={{ margin: 0, fontSize: "var(--nl-font-size-sm)" }}>Value: {value[0]}</p>
      </div>
    );
  },
};

export const RightToLeft: Story = {
  args: { label: "مستوى الصوت", dir: "rtl" },
  decorators: [(Story) => <div dir="rtl"><Story /></div>],
};

export const KeyboardInteraction: Story = {
  args: { defaultValue: [50], step: 5 },
  play: async ({ canvasElement }) => {
    const thumb = within(canvasElement).getByRole("slider", { name: "Volume" });
    await userEvent.tab();
    await expect(thumb).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(thumb).toHaveAttribute("aria-valuenow", "55");
  },
};
