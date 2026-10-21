import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../Stack";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  argTypes: { variant: { control: "inline-radio", options: ["text", "rect", "circle"] } },
  decorators: [(Story) => <div style={{ maxInlineSize: "24rem" }}><Story /></div>],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <Stack gap="3">
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="rect" width="100%" height="6rem" />
      <Skeleton variant="circle" width="3rem" />
    </Stack>
  ),
};

export const CardLoading: Story = {
  render: () => (
    <div aria-busy="true" style={{ display: "grid", gap: "var(--nl-space-4)", gridTemplateColumns: "3rem 1fr", alignItems: "center" }}>
      <Skeleton variant="circle" width="3rem" />
      <Stack gap="2">
        <Skeleton width="50%" />
        <Skeleton width="80%" />
      </Stack>
    </div>
  ),
};

export const RightToLeft: Story = {
  render: () => <div dir="rtl"><Skeleton width="60%" /></div>,
};
