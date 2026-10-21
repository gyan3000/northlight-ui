import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Box } from "./Box";

describe("Box", () => {
  it("renders a div by default with no padding or surface", () => {
    render(<Box data-testid="b">Content</Box>);
    expect(screen.getByTestId("b").tagName).toBe("DIV");
    expect(screen.getByTestId("b")).toHaveClass("box", "p0", "rNone");
  });

  it("applies padding, radius, surface and border variants", () => {
    render(<Box data-testid="b" padding="4" radius="lg" surface="raised" bordered>x</Box>);
    expect(screen.getByTestId("b")).toHaveClass("p4", "rLg", "sRaised", "bordered");
  });

  it("renders as another element with `as`", () => {
    render(<Box as="section" aria-label="Intro">x</Box>);
    expect(screen.getByRole("region", { name: "Intro" }).tagName).toBe("SECTION");
  });

  it("passes the props of the chosen element, and rejects ones it does not have", () => {
    render(<Box as="a" href="/docs">Docs</Box>);
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    // @ts-expect-error `href` does not exist on a div, so the default Box rejects it
    render(<Box href="/nope" data-testid="div">x</Box>);
  });

  it("asChild renders the child element with Box styling", () => {
    render(
      <Box asChild padding="2">
        <article aria-label="Post">Hello</article>
      </Box>,
    );
    expect(screen.getByRole("article", { name: "Post" })).toHaveClass("box", "p2");
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Box ref={ref} className="custom" data-testid="b">x</Box>);
    expect(ref.current).toBe(screen.getByTestId("b"));
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Box padding="4" surface="subtle" bordered>Hello</Box>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
