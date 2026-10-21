import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";

const meta = {
  title: "Feedback/Spinner",
  component: Spinner,
  args: { label: "Loading" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--nl-space-4)", alignItems: "center" }}>
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </div>
  ),
};

export const InContext: Story = {
  render: (args) => (
    <p style={{ display: "inline-flex", gap: "var(--nl-space-2)", alignItems: "center", margin: 0 }}>
      <Spinner {...args} size="sm" label="Saving changes" /> Saving changes…
    </p>
  ),
};
