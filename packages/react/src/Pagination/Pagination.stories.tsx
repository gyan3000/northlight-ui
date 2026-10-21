import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Pagination } from "./Pagination";

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  args: {
    pageCount: 20,
    defaultPage: 1,
    label: "Pagination",
    previousLabel: "Previous page",
    nextLabel: "Next page",
    pageLabel: (page: number) => `Page ${page}`,
  },
  argTypes: {
    pageLabel: { control: false },
    siblingCount: { control: { type: "range", min: 0, max: 3, step: 1 } },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const MiddlePage: Story = { args: { defaultPage: 10 } };

export const FewPages: Story = { args: { pageCount: 5 } };

export const Controlled: Story = {
  render: (args) => {
    const [page, setPage] = useState(3);
    return (
      <div style={{ display: "grid", gap: "var(--nl-space-3)" }}>
        <Pagination {...args} page={page} onPageChange={setPage} />
        <p style={{ margin: 0, fontSize: "var(--nl-font-size-sm)" }}>The parent holds page {page}.</p>
      </div>
    );
  },
};

export const RightToLeft: Story = {
  args: {
    defaultPage: 5,
    label: "ترقيم الصفحات",
    previousLabel: "الصفحة السابقة",
    nextLabel: "الصفحة التالية",
    pageLabel: (page: number) => `صفحة ${page}`,
  },
  decorators: [(Story) => <div dir="rtl"><Story /></div>],
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Page 1" })).toHaveFocus();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  },
};
