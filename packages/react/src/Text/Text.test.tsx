import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Text } from "./Text";

describe("Text", () => {
  it("renders a span with md regular default styling", () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText("Hello").tagName).toBe("SPAN");
    expect(screen.getByText("Hello")).toHaveClass("md", "regular", "toneDefault");
  });

  it("applies size, weight, tone and truncate", () => {
    render(<Text size="2xl" weight="semibold" tone="muted" truncate>Hi</Text>);
    expect(screen.getByText("Hi")).toHaveClass("xl2", "semibold", "toneMuted", "truncate");
  });

  it("separates meaning from looks: a heading element with a small size", () => {
    render(<Text as="h2" size="sm">Section</Text>);
    expect(screen.getByRole("heading", { level: 2, name: "Section" })).toHaveClass("sm");
  });

  it("passes the props of the chosen element", () => {
    render(<Text as="label" htmlFor="x">Name</Text>);
    expect(screen.getByText("Name")).toHaveAttribute("for", "x");
    // @ts-expect-error `htmlFor` does not exist on a span, so the default Text rejects it
    render(<Text htmlFor="y">nope</Text>);
  });

  it("asChild merges onto the child", () => {
    render(<Text asChild tone="danger"><strong>Careful</strong></Text>);
    expect(screen.getByText("Careful").tagName).toBe("STRONG");
    expect(screen.getByText("Careful")).toHaveClass("toneDanger");
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Text ref={ref} className="custom">x</Text>);
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Text as="h1" size="xl">Title</Text>
        <Text as="p" tone="muted">Body</Text>
        <Text as="p" tone="danger">Error</Text>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
