import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Stack } from "./Stack";

describe("Stack", () => {
  it("is a column with a token-based gap by default", () => {
    render(<Stack data-testid="s"><span>a</span><span>b</span></Stack>);
    const el = screen.getByTestId("s");
    expect(el).toHaveClass("stack", "column", "alignStretch", "justifyStart");
    expect(el.style.gap).toBe("var(--nl-space-3)");
  });

  it("takes direction, gap, align, justify and wrap", () => {
    render(<Stack data-testid="s" direction="row" gap="6" align="center" justify="between" wrap>x</Stack>);
    const el = screen.getByTestId("s");
    expect(el).toHaveClass("row", "alignCenter", "justifyBetween", "wrap");
    expect(el.style.gap).toBe("var(--nl-space-6)");
  });

  it("keeps a caller's own style next to the gap", () => {
    render(<Stack data-testid="s" style={{ minBlockSize: "10px" }}>x</Stack>);
    expect(screen.getByTestId("s").style.minBlockSize).toBe("10px");
    expect(screen.getByTestId("s").style.gap).toBe("var(--nl-space-3)");
  });

  it("renders as a list with `as`", () => {
    render(<Stack as="ul"><li>One</li><li>Two</li></Stack>);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("asChild merges onto the child", () => {
    render(<Stack asChild gap="2"><nav aria-label="Main">x</nav></Stack>);
    expect(screen.getByRole("navigation", { name: "Main" })).toHaveClass("stack");
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stack ref={ref} className="custom">x</Stack>);
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Stack as="ul" direction="row"><li>a</li><li>b</li></Stack>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
