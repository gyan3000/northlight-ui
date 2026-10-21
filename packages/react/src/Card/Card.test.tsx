import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children in a div by default", () => {
    render(<Card data-testid="c">Content</Card>);
    expect(screen.getByTestId("c").tagName).toBe("DIV");
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies variant and padding classes", () => {
    render(<Card data-testid="c" variant="elevated" padding="lg">x</Card>);
    expect(screen.getByTestId("c")).toHaveClass("elevated", "padLg");
  });

  it("uses outline and md padding by default", () => {
    render(<Card data-testid="c">x</Card>);
    expect(screen.getByTestId("c")).toHaveClass("outline", "padMd");
  });

  it("asChild renders the child element with card styling", () => {
    render(
      <Card asChild>
        <article aria-label="Post">Hello</article>
      </Card>,
    );
    const el = screen.getByRole("article", { name: "Post" });
    expect(el).toHaveClass("card");
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref} className="custom" data-testid="c">x</Card>);
    expect(ref.current).toBe(screen.getByTestId("c"));
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<><Card>One</Card><Card variant="elevated">Two</Card></>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
