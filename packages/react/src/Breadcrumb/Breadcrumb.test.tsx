import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { createRef } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "./Breadcrumb";

function Example() {
  return (
    <Breadcrumb label="Breadcrumb">
      <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbItem><BreadcrumbLink href="/docs">Docs</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbItem><BreadcrumbPage>Button</BreadcrumbPage></BreadcrumbItem>
    </Breadcrumb>
  );
}

describe("Breadcrumb", () => {
  it("is a named navigation landmark with a list of entries", () => {
    render(<Example />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("links to ancestors and marks the current page", () => {
    render(<Example />);
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(screen.getByText("Button")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Button" })).not.toBeInTheDocument();
  });

  it("hides the separators from assistive tech", () => {
    const { container } = render(<Example />);
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators).toHaveLength(3);
  });

  it("can be walked with the keyboard through its links", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Docs" })).toHaveFocus();
  });

  it("BreadcrumbLink asChild renders your router link", () => {
    render(
      <Breadcrumb label="Breadcrumb">
        <BreadcrumbItem>
          <BreadcrumbLink asChild><a href="/routed" data-router>Routed</a></BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(screen.getByRole("link", { name: "Routed" })).toHaveAttribute("data-router");
  });

  it("forwards refs and classNames", () => {
    const navRef = createRef<HTMLElement>();
    render(
      <Breadcrumb ref={navRef} label="x" className="nav-x">
        <BreadcrumbItem className="item-x"><BreadcrumbPage className="page-x">Here</BreadcrumbPage></BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(navRef.current).toHaveClass("nav-x");
    expect(screen.getByText("Here")).toHaveClass("page-x");
    expect(screen.getByRole("listitem")).toHaveClass("item-x");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
