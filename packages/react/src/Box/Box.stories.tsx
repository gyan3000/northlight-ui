import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "./Box";

const meta = {
  title: "Foundations/Box",
  component: Box,
  args: { padding: "4", radius: "md", surface: "subtle", bordered: true, children: "A box with padding, radius and a themed surface." },
  argTypes: {
    padding: { control: "select", options: ["0", "1", "2", "3", "4", "5", "6", "8"] },
    radius: { control: "inline-radio", options: ["none", "sm", "md", "lg", "full"] },
    surface: { control: "inline-radio", options: ["none", "base", "subtle", "raised"] },
    as: { control: false },
    asChild: { control: false },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Surfaces: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--nl-space-4)" }}>
      {(["base", "subtle", "raised"] as const).map((surface) => (
        <Box key={surface} {...args} surface={surface}>{surface}</Box>
      ))}
    </div>
  ),
};

export const AsAnotherElement: Story = {
  render: (args) => (
    <Box {...args} as="section" aria-label="Release notes">
      Rendered as a &lt;section&gt;, with its label announced as a region.
    </Box>
  ),
};

export const AsChild: Story = {
  render: (args) => (
    <Box {...args} asChild>
      <article aria-label="Post">Rendered as the child &lt;article&gt;.</article>
    </Box>
  ),
};

export const RightToLeft: Story = {
  render: (args) => <div dir="rtl"><Box {...args}>مربع بحشو ومساحة</Box></div>,
};
