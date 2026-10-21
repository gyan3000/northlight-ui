import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef, useState } from "react";
import { vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders a labelled checkbox", () => {
    render(<Checkbox>Accept terms</Checkbox>);
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).not.toBeChecked();
  });

  it("toggles uncontrolled by click and by Space", async () => {
    const user = userEvent.setup();
    render(<Checkbox>Accept</Checkbox>);
    const box = screen.getByRole("checkbox");
    await user.click(box);
    expect(box).toBeChecked();
    await user.keyboard(" ");
    expect(box).not.toBeChecked();
  });

  it("supports defaultChecked", () => {
    render(<Checkbox defaultChecked>Accept</Checkbox>);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("works controlled", async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return <Checkbox checked={checked} onChange={(e) => { onChange(e.target.checked); setChecked(e.target.checked); }}>Accept</Checkbox>;
    }
    render(<Controlled />);
    await userEvent.setup().click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("clicking the label text toggles it", async () => {
    render(<Checkbox>Accept terms</Checkbox>);
    await userEvent.setup().click(screen.getByText("Accept terms"));
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("is not toggleable when disabled", async () => {
    render(<Checkbox disabled>Accept</Checkbox>);
    await userEvent.setup().click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("sets the indeterminate property", () => {
    const { rerender } = render(<Checkbox indeterminate readOnly checked={false}>Some</Checkbox>);
    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);
    rerender(<Checkbox checked={false} readOnly>Some</Checkbox>);
    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(false);
  });

  it("sets aria-invalid when invalid", () => {
    render(<Checkbox invalid>Accept</Checkbox>);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("forwards ref (object and callback) and className", () => {
    const objRef = createRef<HTMLInputElement>();
    const cbRef = vi.fn();
    render(<><Checkbox ref={objRef} className="custom">A</Checkbox><Checkbox ref={cbRef}>B</Checkbox></>);
    expect(objRef.current).toBe(screen.getAllByRole("checkbox")[0]);
    expect(cbRef).toHaveBeenCalledWith(screen.getAllByRole("checkbox")[1]);
    expect(objRef.current?.closest("label")).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Checkbox>Unchecked</Checkbox>
        <Checkbox defaultChecked>Checked</Checkbox>
        <Checkbox indeterminate readOnly checked={false}>Mixed</Checkbox>
        <Checkbox disabled>Disabled</Checkbox>
        <Checkbox invalid>Invalid</Checkbox>
        <Checkbox aria-label="No visible text" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
