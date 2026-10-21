import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./Button";

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const PlusIcon = () => (
  <svg {...svgProps}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg {...svgProps}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const TrashIcon = () => (
  <svg {...svgProps}>
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </svg>
);

// Icons selectable from the Controls panel.
// `mapping` turns the chosen name into a real React node, so no plain object reaches the Button.
const icons = {
  plus: <PlusIcon />,
  "arrow-right": <ArrowRightIcon />,
  trash: <TrashIcon />,
};
const iconMapping = { none: undefined, ...icons };
const iconOptions = Object.keys(iconMapping);

const meta = {
  title: "Actions/Button",
  component: Button,
  args: { children: "Button", onClick: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "outline", "ghost"] },
    tone: { control: "inline-radio", options: ["accent", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    // Icons are React nodes, so the Controls panel picks a name and `mapping` supplies the element.
    startIcon: { control: "select", options: iconOptions, mapping: iconMapping },
    endIcon: { control: "select", options: iconOptions, mapping: iconMapping },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-3)", flexWrap: "wrap" }}>
      <Button {...args} variant="solid">Solid</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
    </div>
  ),
};

export const Danger: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-3)", flexWrap: "wrap" }}>
      <Button {...args} tone="danger">Delete</Button>
      <Button {...args} tone="danger" variant="outline">Delete</Button>
      <Button {...args} tone="danger" variant="ghost">Delete</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-3)", alignItems: "center" }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-3)", flexWrap: "wrap", alignItems: "center" }}>
      <Button {...args} startIcon={<PlusIcon />}>New project</Button>
      <Button {...args} variant="outline" endIcon={<ArrowRightIcon />}>Continue</Button>
      <Button {...args} variant="ghost" tone="danger" startIcon={<TrashIcon />}>Delete</Button>
      <Button {...args} size="sm" startIcon={<PlusIcon />}>Small</Button>
      <Button {...args} size="lg" endIcon={<ArrowRightIcon />}>Large</Button>
    </div>
  ),
};

export const IconsRightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <Button {...args} startIcon={<PlusIcon />} endIcon={<ArrowRightIcon />}>جديد</Button>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

export const Loading: Story = { args: { loading: true, children: "Saving" } };

export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild>
      <a href="#docs">Read the docs</a>
    </Button>
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <Button {...args} loading>حفظ</Button>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("button")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
