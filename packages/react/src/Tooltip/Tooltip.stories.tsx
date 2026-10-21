import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../Button";
import { Tooltip } from "./Tooltip";

const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  args: { content: "Save your changes", children: <Button>Save</Button> },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    // children is an element, not something the Controls panel can edit.
    children: { control: false },
    content: { control: "text" },
  },
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ padding: "var(--nl-space-12)" }}><Story /></div>],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sides: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-6)", padding: "var(--nl-space-8)" }}>
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} {...args} side={side} content={`Shown on the ${side}`} defaultOpen>
          <Button variant="outline">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Open: Story = { args: { defaultOpen: true } };

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <Tooltip {...args} content="احفظ التغييرات" defaultOpen>
        <Button>حفظ</Button>
      </Tooltip>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("button")).toHaveFocus();
    await expect(await body.findByRole("tooltip")).toHaveTextContent("Save your changes");
    await userEvent.keyboard("{Escape}");
  },
};
