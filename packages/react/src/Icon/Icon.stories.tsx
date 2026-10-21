import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../Text";
import { Icon } from "./Icon";

const star = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
  </svg>
);

const meta = {
  title: "Foundations/Icon",
  component: Icon,
  args: { children: star },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl", "inherit"] },
    children: { control: false },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-4)", alignItems: "center" }}>
      {(["sm", "md", "lg", "xl"] as const).map((size) => <Icon key={size} {...args} size={size} />)}
    </div>
  ),
};

export const FollowsTextColor: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-4)" }}>
      <span style={{ color: "var(--nl-color-text)" }}><Icon {...args} /></span>
      <span style={{ color: "var(--nl-color-danger)" }}><Icon {...args} /></span>
      <span style={{ color: "var(--nl-color-text-muted)" }}><Icon {...args} /></span>
    </div>
  ),
};

export const DecorativeBesideText: Story = {
  render: (args) => (
    <Text as="p" style={{ display: "inline-flex", alignItems: "center", gap: "var(--nl-space-2)" }}>
      <Icon {...args} size="inherit" /> Starred
    </Text>
  ),
};

export const MeaningfulWithLabel: Story = {
  args: { label: "Favorite" },
};

export const RightToLeft: Story = {
  render: (args) => <div dir="rtl"><Icon {...args} label="مفضل" /></div>,
};
