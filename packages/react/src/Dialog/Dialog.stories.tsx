import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../Button";
import { Input } from "../Input";
import { FormField } from "../FormField";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "./Dialog";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button tone="danger">Delete project</Button>
      </DialogTrigger>
      <DialogContent title="Delete project?" description="This permanently removes the project and its data." closeLabel="Close">
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button tone="danger">Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Open: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent title="Delete project?" description="This permanently removes the project and its data." closeLabel="Close">
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button tone="danger">Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite teammate</Button>
      </DialogTrigger>
      <DialogContent title="Invite teammate" description="They will get an email with a link to join." closeLabel="Close">
        <FormField label="Email" required>
          <Input type="email" placeholder="you@example.com" />
        </FormField>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Send invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open controlled dialog</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent title="Controlled" description={`The parent owns the open state (${open ? "open" : "closed"}).`} closeLabel="Close">
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  },
};

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Dialog>
        <DialogTrigger asChild>
          <Button>فتح</Button>
        </DialogTrigger>
        <DialogContent title="حذف المشروع؟" description="لا يمكن التراجع عن هذا الإجراء." closeLabel="إغلاق">
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  render: Confirm.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Delete project" });
    await userEvent.click(trigger);
    await expect(await body.findByRole("dialog", { name: "Delete project?" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};
