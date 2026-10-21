import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "../Box";
import { Stack } from "./Stack";

const items = ["One", "Two", "Three"].map((label) => (
  <Box key={label} padding="3" radius="md" surface="subtle" bordered>{label}</Box>
));

const meta = {
  title: "Foundations/Stack",
  component: Stack,
  args: { gap: "3", children: items },
  argTypes: {
    direction: { control: "inline-radio", options: ["column", "row"] },
    gap: { control: "select", options: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12"] },
    align: { control: "select", options: ["start", "center", "end", "stretch", "baseline"] },
    justify: { control: "select", options: ["start", "center", "end", "between"] },
    as: { control: false },
    asChild: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Row: Story = { args: { direction: "row" } };

export const SpaceBetween: Story = { args: { direction: "row", justify: "between", align: "center" } };

export const Wrapping: Story = {
  args: {
    direction: "row",
    wrap: true,
    children: Array.from({ length: 14 }, (_, i) => <Box key={i} padding="3" radius="md" surface="subtle" bordered>Item {i + 1}</Box>),
  },
  decorators: [(Story) => <div style={{ maxInlineSize: "24rem" }}><Story /></div>],
};

export const AsList: Story = {
  render: (args) => (
    <Stack {...args} as="ul" style={{ listStyle: "none", margin: 0, padding: 0 }}>
      <li>First</li>
      <li>Second</li>
      <li>Third</li>
    </Stack>
  ),
};

export const RightToLeft: Story = {
  args: { direction: "row" },
  decorators: [(Story) => <div dir="rtl"><Story /></div>],
};
