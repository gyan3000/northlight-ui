import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";

const meta = {
  title: "Overlays/DropdownMenu",
  component: DropdownMenu,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ minBlockSize: "16rem", minInlineSize: "16rem" }}><Story /></div>],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const Actions = () => (
  <>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">Actions</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Project</DropdownMenuLabel>
      <DropdownMenuItem>Rename</DropdownMenuItem>
      <DropdownMenuItem>Duplicate</DropdownMenuItem>
      <DropdownMenuItem disabled>Archive</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem tone="danger">Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </>
);

export const Playground: Story = { render: () => <DropdownMenu><Actions /></DropdownMenu> };

export const Open: Story = { render: () => <DropdownMenu defaultOpen><Actions /></DropdownMenu> };

export const WithCheckboxItems: Story = {
  render: () => {
    const [grid, setGrid] = useState(true);
    const [rulers, setRulers] = useState(false);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">View</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>Show grid</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={rulers} onCheckedChange={setRulers}>Show rulers</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="outline">إجراءات</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>إعادة تسمية</DropdownMenuItem>
          <DropdownMenuItem tone="danger">حذف</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  render: Playground.render,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(await body.findByRole("menuitem", { name: "Rename" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).not.toBeInTheDocument());
    await expect(within(canvasElement).getByRole("button", { name: "Actions" })).toHaveFocus();
  },
};
