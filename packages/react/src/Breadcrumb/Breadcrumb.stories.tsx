import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "./Breadcrumb";

const meta = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  args: { label: "Breadcrumb" },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem><BreadcrumbLink href="#home">Home</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbItem><BreadcrumbLink href="#docs">Docs</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbItem><BreadcrumbLink href="#components">Components</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbItem><BreadcrumbPage>Button</BreadcrumbPage></BreadcrumbItem>
    </Breadcrumb>
  ),
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Wrapping: Story = {
  decorators: [(Story) => <div style={{ maxInlineSize: "14rem" }}><Story /></div>],
};

export const RightToLeft: Story = {
  args: { label: "مسار التنقل" },
  render: (args) => (
    <div dir="rtl">
      <Breadcrumb {...args}>
        <BreadcrumbItem><BreadcrumbLink href="#home">الرئيسية</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbItem><BreadcrumbLink href="#docs">التوثيق</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbItem><BreadcrumbPage>زر</BreadcrumbPage></BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Docs" })).toHaveFocus();
  },
};
