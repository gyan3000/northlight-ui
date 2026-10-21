import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

// A tiny inline image, so the story needs no network.
const photo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#67e8f9"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="26" r="11" fill="#14142b" opacity=".85"/><path d="M10 60c3-14 14-20 22-20s19 6 22 20z" fill="#14142b" opacity=".85"/></svg>',
  );

const meta = {
  title: "Data display/Avatar",
  component: Avatar,
  args: { alt: "Ada Lovelace", fallback: "AL" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithImage: Story = { args: { src: photo } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-4)", alignItems: "center" }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" src={photo} />
    </div>
  ),
};

export const BrokenImageFallsBack: Story = { args: { src: "https://invalid.example/missing.png" } };

export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--nl-space-2)" }}>
      <Avatar alt="Ada Lovelace" fallback="AL" />
      <Avatar alt="Grace Hopper" fallback="GH" src={photo} />
      <Avatar alt="Alan Turing" fallback="AT" />
    </div>
  ),
};

export const RightToLeft: Story = {
  render: () => <div dir="rtl"><Avatar alt="علي" fallback="ع" /></div>,
};
