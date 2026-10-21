import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Card } from "./Card";

const meta = {
  title: "Layout/Card",
  component: Card,
  argTypes: {
    variant: { control: "inline-radio", options: ["outline", "elevated"] },
    padding: { control: "inline-radio", options: ["none", "sm", "md", "lg"] },
  },
  decorators: [(Story) => <div style={{ maxInlineSize: "24rem" }}><Story /></div>],
  render: (args) => (
    <Card {...args}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: "var(--nl-font-size-lg)" }}>Team plan</h3>
        <Badge tone="success">Active</Badge>
      </div>
      <p style={{ color: "var(--nl-color-text-muted)", fontSize: "var(--nl-font-size-sm)" }}>
        Up to 10 members, unlimited projects and priority support.
      </p>
      <Button size="sm">Manage plan</Button>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Elevated: Story = { args: { variant: "elevated" } };

export const AsArticle: Story = {
  render: () => (
    <Card asChild variant="elevated">
      <article aria-label="Release notes">
        <h3 style={{ margin: 0 }}>Release notes</h3>
        <p>Rendered as an &lt;article&gt; element.</p>
      </article>
    </Card>
  ),
};

export const RightToLeft: Story = {
  decorators: [(Story) => <div dir="rtl"><Story /></div>],
};
