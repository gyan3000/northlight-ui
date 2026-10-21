import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef, useState } from "react";
import { vi } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion";

function Sections() {
  return (
    <>
      <AccordionItem value="a">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Ships in 2 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>30 day returns.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c" disabled>
        <AccordionTrigger>Warranty</AccordionTrigger>
        <AccordionContent>Two years.</AccordionContent>
      </AccordionItem>
    </>
  );
}

describe("Accordion", () => {
  it("renders headers as buttons inside headings, all collapsed by default", () => {
    render(<Accordion type="single" collapsible><Sections /></Accordion>);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Shipping" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Ships in 2 days.")).not.toBeInTheDocument();
  });

  it("expands on click and shows the content", async () => {
    render(<Accordion type="single" collapsible><Sections /></Accordion>);
    await userEvent.setup().click(screen.getByRole("button", { name: "Shipping" }));
    expect(screen.getByRole("button", { name: "Shipping" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Ships in 2 days.")).toBeVisible();
  });

  it("single: opening one closes the other, and collapsible lets it close", async () => {
    const user = userEvent.setup();
    render(<Accordion type="single" collapsible><Sections /></Accordion>);
    await user.click(screen.getByRole("button", { name: "Shipping" }));
    await user.click(screen.getByRole("button", { name: "Returns" }));
    expect(screen.getByRole("button", { name: "Shipping" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Returns" })).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("button", { name: "Returns" }));
    expect(screen.getByRole("button", { name: "Returns" })).toHaveAttribute("aria-expanded", "false");
  });

  it("multiple: several can be open at once", async () => {
    const user = userEvent.setup();
    render(<Accordion type="multiple"><Sections /></Accordion>);
    await user.click(screen.getByRole("button", { name: "Shipping" }));
    await user.click(screen.getByRole("button", { name: "Returns" }));
    expect(screen.getByText("Ships in 2 days.")).toBeVisible();
    expect(screen.getByText("30 day returns.")).toBeVisible();
  });

  it("supports defaultValue", () => {
    render(<Accordion type="single" defaultValue="b"><Sections /></Accordion>);
    expect(screen.getByText("30 day returns.")).toBeVisible();
  });

  it("works controlled", async () => {
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState("a");
      return (
        <Accordion type="single" value={value} onValueChange={(v) => { onValueChange(v); setValue(v); }}>
          <Sections />
        </Accordion>
      );
    }
    render(<Controlled />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Returns" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.getByText("30 day returns.")).toBeVisible();
  });

  it("moves between headers with arrow keys, skipping disabled, and toggles with Enter and Space", async () => {
    const user = userEvent.setup();
    render(<Accordion type="single" collapsible><Sections /></Accordion>);
    await user.tab();
    expect(screen.getByRole("button", { name: "Shipping" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Returns" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Returns" })).toHaveAttribute("aria-expanded", "true");
    await user.keyboard(" ");
    expect(screen.getByRole("button", { name: "Returns" })).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Shipping" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Returns" })).toHaveFocus();
  });

  it("does not open a disabled item", async () => {
    render(<Accordion type="single" collapsible><Sections /></Accordion>);
    await userEvent.setup().click(screen.getByRole("button", { name: "Warranty" }));
    expect(screen.getByRole("button", { name: "Warranty" })).toHaveAttribute("aria-expanded", "false");
  });

  it("forwards refs and classNames", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Accordion ref={ref} type="single" className="root-x">
        <AccordionItem value="a" className="item-x">
          <AccordionTrigger className="trigger-x">T</AccordionTrigger>
          <AccordionContent className="content-x">C</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(ref.current).toHaveClass("root-x");
    expect(screen.getByRole("button")).toHaveClass("trigger-x");
    expect(screen.getByRole("button").closest(".item-x")).not.toBeNull();
  });

  it("has no axe violations (collapsed and expanded)", async () => {
    const { container } = render(<Accordion type="multiple" defaultValue={["a"]}><Sections /></Accordion>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
