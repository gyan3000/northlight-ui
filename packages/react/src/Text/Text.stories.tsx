import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../Stack";
import { Text } from "./Text";

const meta = {
  title: "Foundations/Text",
  component: Text,
  args: { children: "The quick brown fox jumps over the lazy dog." },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
    weight: { control: "inline-radio", options: ["regular", "medium", "semibold"] },
    tone: { control: "select", options: ["default", "muted", "danger", "success", "warning", "info"] },
    as: { control: false },
    asChild: { control: false },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TypeScale: Story = {
  render: (args) => (
    <Stack gap="2">
      {(["2xl", "xl", "lg", "md", "sm", "xs"] as const).map((size) => (
        <Text key={size} {...args} size={size} as="p">{size}: {args.children}</Text>
      ))}
    </Stack>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <Stack gap="2">
      {(["default", "muted", "danger", "success", "warning", "info"] as const).map((tone) => (
        <Text key={tone} {...args} tone={tone} as="p" weight="medium">{tone}</Text>
      ))}
    </Stack>
  ),
};

export const HeadingSemanticsVsLook: Story = {
  render: () => (
    <Stack gap="2">
      <Text as="h2" size="sm" weight="semibold">An h2 that looks small</Text>
      <Text as="p" size="2xl" weight="semibold">A paragraph that looks like a title</Text>
    </Stack>
  ),
};

export const Truncated: Story = {
  args: { truncate: true, children: "This line is far too long for its container and gets clipped with an ellipsis at the end." },
  decorators: [(Story) => <div style={{ maxInlineSize: "20rem" }}><Story /></div>],
};

export const RightToLeft: Story = {
  render: () => <div dir="rtl"><Text as="p">الثعلب البني السريع يقفز فوق الكلب الكسول.</Text></div>,
};
