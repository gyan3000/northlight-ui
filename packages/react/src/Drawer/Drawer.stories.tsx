import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../Button";
import { FormField } from "../FormField";
import { Input } from "../Input";
import { Switch } from "../Switch";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTrigger } from "./Drawer";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const Filters = ({ side, defaultOpen = false, dir }: { side?: "start" | "end" | "top" | "bottom"; defaultOpen?: boolean; dir?: "rtl" }) => (
  <Drawer defaultOpen={defaultOpen}>
    <DrawerTrigger asChild>
      <Button variant="outline">Open filters</Button>
    </DrawerTrigger>
    <DrawerContent
      side={side}
      title="Filters"
      description="Narrow the results shown on the page."
      closeLabel="Close"
      dir={dir}
    >
      <div style={{ display: "grid", gap: "var(--nl-space-4)" }}>
        <FormField label="Name">
          <Input placeholder="Search by name" />
        </FormField>
        <Switch defaultChecked>Only show active</Switch>
      </div>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
        <DrawerClose asChild>
          <Button>Apply</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);

export const End: Story = { render: () => <Filters /> };

export const Start: Story = { render: () => <Filters side="start" /> };

export const Top: Story = { render: () => <Filters side="top" /> };

export const Bottom: Story = { render: () => <Filters side="bottom" /> };

export const Open: Story = { render: () => <Filters defaultOpen /> };

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Drawer defaultOpen>
        <DrawerContent title="عوامل التصفية" description="ضيّق النتائج المعروضة." closeLabel="إغلاق" dir="rtl">
          <p style={{ margin: 0 }}>يظهر من جهة النهاية، وهي اليسار هنا.</p>
        </DrawerContent>
      </Drawer>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => <Filters />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = within(canvasElement).getByRole("button", { name: "Open filters" });
    await userEvent.click(trigger);
    await body.findByRole("dialog", { name: "Filters" });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};
