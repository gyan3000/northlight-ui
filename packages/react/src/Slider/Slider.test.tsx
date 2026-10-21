import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef, useState } from "react";
import { vi } from "vitest";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("is a named slider with its range and value", () => {
    render(<Slider label="Volume" defaultValue={[30]} />);
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb).toHaveAttribute("aria-valuenow", "30");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "100");
  });

  it("defaults to the minimum when no value is given", () => {
    render(<Slider label="Volume" min={10} max={50} />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "10");
  });

  it("moves by step with the arrow keys, and to the ends with Home and End", async () => {
    const user = userEvent.setup();
    render(<Slider label="Volume" defaultValue={[50]} step={5} />);
    await user.tab();
    expect(screen.getByRole("slider")).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "55");
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "45");
    await user.keyboard("{End}");
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "100");
    await user.keyboard("{Home}");
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "0");
  });

  it("reports changes and works controlled", async () => {
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState([20]);
      return <Slider label="Volume" value={value} onValueChange={(v) => { onValueChange(v); setValue(v); }} />;
    }
    const user = userEvent.setup();
    render(<Controlled />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith([21]);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "21");
  });

  it("makes a range from two values, with a name per thumb", () => {
    render(<Slider label="Price" defaultValue={[20, 80]} thumbLabels={["Minimum price", "Maximum price"]} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(screen.getByRole("slider", { name: "Minimum price" })).toHaveAttribute("aria-valuenow", "20");
    expect(screen.getByRole("slider", { name: "Maximum price" })).toHaveAttribute("aria-valuenow", "80");
  });

  it("falls back to the shared label for range thumbs without their own name", () => {
    render(<Slider label="Price" defaultValue={[20, 80]} />);
    expect(screen.getAllByRole("slider", { name: "Price" })).toHaveLength(2);
  });

  it("does not respond when disabled", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Slider label="Volume" defaultValue={[50]} disabled onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Slider ref={ref} label="Volume" className="custom" />);
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations (single and range)", async () => {
    const { container } = render(
      <>
        <Slider label="Volume" defaultValue={[40]} />
        <Slider label="Price" defaultValue={[10, 60]} thumbLabels={["Minimum", "Maximum"]} />
        <Slider label="Locked" defaultValue={[10]} disabled />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
