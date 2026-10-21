import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  args: { children: "Accept the terms" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--nl-space-3)" }}>
      <Checkbox>Unchecked</Checkbox>
      <Checkbox defaultChecked>Checked</Checkbox>
      <Checkbox indeterminate checked={false} readOnly>Indeterminate</Checkbox>
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox disabled defaultChecked>Disabled checked</Checkbox>
      <Checkbox invalid>Invalid</Checkbox>
    </div>
  ),
};

export const SelectAll: Story = {
  render: () => {
    const [items, setItems] = useState([true, false, false]);
    const all = items.every(Boolean);
    const some = items.some(Boolean);
    return (
      <div style={{ display: "grid", gap: "var(--nl-space-3)" }}>
        <Checkbox checked={all} indeterminate={some && !all} onChange={(e) => setItems(items.map(() => e.target.checked))}>
          Select all
        </Checkbox>
        <div style={{ display: "grid", gap: "var(--nl-space-2)", paddingInlineStart: "var(--nl-space-6)" }}>
          {items.map((checked, i) => (
            <Checkbox key={i} checked={checked} onChange={(e) => setItems(items.map((v, j) => (j === i ? e.target.checked : v)))}>
              Item {i + 1}
            </Checkbox>
          ))}
        </div>
      </div>
    );
  },
};

export const RightToLeft: Story = {
  render: () => <div dir="rtl"><Checkbox defaultChecked>أوافق على الشروط</Checkbox></div>,
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("checkbox");
    await userEvent.tab();
    await expect(box).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(box).toBeChecked();
    await userEvent.keyboard(" ");
    await expect(box).not.toBeChecked();
  },
};
