import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../Button";
import { FormField } from "../FormField";
import { Input } from "../Input";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./Popover";

const meta = {
  title: "Overlays/Popover",
  component: Popover,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ minBlockSize: "18rem", minInlineSize: "18rem" }}><Story /></div>],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

const Filters = ({ defaultOpen = false }: { defaultOpen?: boolean }) => (
  <Popover defaultOpen={defaultOpen}>
    <PopoverTrigger asChild>
      <Button variant="outline">Filters</Button>
    </PopoverTrigger>
    <PopoverContent aria-label="Filters">
      <div style={{ display: "grid", gap: "var(--nl-space-3)" }}>
        <FormField label="Name">
          <Input placeholder="Search by name" />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <PopoverClose asChild>
            <Button size="sm">Apply</Button>
          </PopoverClose>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

export const Playground: Story = { render: () => <Filters /> };

export const Open: Story = { render: () => <Filters defaultOpen /> };

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline">عوامل التصفية</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="عوامل التصفية" dir="rtl">
          <p style={{ margin: 0 }}>محتوى النافذة المنبثقة.</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => <Filters />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = within(canvasElement).getByRole("button", { name: "Filters" });
    await userEvent.click(trigger);
    await body.findByRole("dialog", { name: "Filters" });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};
