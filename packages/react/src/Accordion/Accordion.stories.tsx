import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, type AccordionProps } from "./Accordion";

const Sections = () => (
  <>
    <AccordionItem value="shipping">
      <AccordionTrigger>How long does shipping take?</AccordionTrigger>
      <AccordionContent>Orders ship within two business days and arrive in three to five.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="returns">
      <AccordionTrigger>What is the return policy?</AccordionTrigger>
      <AccordionContent>Return anything within 30 days for a full refund, no questions asked.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="warranty" disabled>
      <AccordionTrigger>Is there a warranty?</AccordionTrigger>
      <AccordionContent>Two years on every product.</AccordionContent>
    </AccordionItem>
  </>
);

// Accordion's props are a union (type="single" | "multiple"), which Storybook's
// args typing cannot express, so the args are typed loosely here.
const meta: Meta = {
  title: "Navigation/Accordion",
  component: Accordion,
  args: { type: "single", collapsible: true },
  decorators: [(Story) => <div style={{ maxInlineSize: "32rem" }}><Story /></div>],
  render: (args) => (
    <Accordion {...(args as AccordionProps)}>
      <Sections />
    </Accordion>
  ),
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {};

export const OpenByDefault: Story = { args: { defaultValue: "returns" } };

export const Multiple: Story = {
  args: { type: "multiple", defaultValue: ["shipping", "returns"] },
};

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Accordion type="single" collapsible defaultValue="a" dir="rtl">
        <AccordionItem value="a">
          <AccordionTrigger>كم يستغرق الشحن؟</AccordionTrigger>
          <AccordionContent>يتم شحن الطلبات خلال يومي عمل.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>ما هي سياسة الإرجاع؟</AccordionTrigger>
          <AccordionContent>يمكنك الإرجاع خلال 30 يوماً.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: /shipping take/ })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("button", { name: /shipping take/ })).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("button", { name: /return policy/ })).toHaveFocus();
  },
};
