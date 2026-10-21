import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Radio, RadioGroup } from "./Radio";

const meta = {
  title: "Forms/Radio",
  component: RadioGroup,
  args: { "aria-label": "Plan", defaultValue: "free" },
  argTypes: { orientation: { control: "inline-radio", options: ["vertical", "horizontal"] } },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="team" disabled>Team (coming soon)</Radio>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Horizontal: Story = { args: { orientation: "horizontal" } };

export const Invalid: Story = { args: { invalid: true, defaultValue: undefined } };

export const Disabled: Story = { args: { disabled: true } };

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <RadioGroup aria-label="الخطة" defaultValue="free" dir="rtl">
        <Radio value="free">مجاني</Radio>
        <Radio value="pro">احترافي</Radio>
      </RadioGroup>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: "Free" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("radio", { name: "Pro" })).toHaveFocus();
  },
};
