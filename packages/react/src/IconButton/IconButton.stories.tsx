import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Tooltip } from "../Tooltip";
import { IconButton } from "./IconButton";

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const TrashIcon = () => (
  <svg {...svgProps}>
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </svg>
);
const PlusIcon = () => (
  <svg {...svgProps}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const meta = {
  title: "Actions/IconButton",
  component: IconButton,
  args: { label: "Add item", icon: <PlusIcon />, onClick: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "outline", "ghost"] },
    tone: { control: "inline-radio", options: ["accent", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    icon: { control: false },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-3)", alignItems: "center" }}>
      <IconButton {...args} variant="solid" label="Add (solid)" />
      <IconButton {...args} variant="outline" label="Add (outline)" />
      <IconButton {...args} variant="ghost" label="Add (ghost)" />
      <IconButton {...args} variant="outline" tone="danger" icon={<TrashIcon />} label="Delete" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-3)", alignItems: "center" }}>
      <IconButton {...args} size="sm" label="Small" />
      <IconButton {...args} size="md" label="Medium" />
      <IconButton {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Loading: Story = { args: { loading: true, label: "Saving" } };

export const Disabled: Story = { args: { disabled: true } };

export const WithTooltip: Story = {
  render: (args) => (
    <Tooltip content="Add a new item">
      <IconButton {...args} />
    </Tooltip>
  ),
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("button", { name: "Add item" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
