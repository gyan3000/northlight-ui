import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, vi } from "vitest";
import { getThemeInitScript, ThemeProvider, useTheme } from "./ThemeProvider";

function mockMatchMedia(dark: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: dark && query.includes("dark"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function Probe() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <>
      <p data-testid="state">{`${theme}/${resolvedTheme}`}</p>
      <button onClick={() => setTheme("dark")}>dark</button>
      <button onClick={() => setTheme("system")}>system</button>
    </>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    mockMatchMedia(false);
  });

  it("follows the system by default and leaves data-theme unset", () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByTestId("state")).toHaveTextContent("system/light");
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("resolves system to dark when the OS prefers dark", () => {
    mockMatchMedia(true);
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByTestId("state")).toHaveTextContent("system/dark");
  });

  it("sets data-theme and persists the choice", async () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    await userEvent.setup().click(screen.getByText("dark"));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("nl-theme")).toBe("dark");
    await userEvent.setup().click(screen.getByText("system"));
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("restores a stored theme on mount", () => {
    localStorage.setItem("nl-theme", "dark");
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByTestId("state")).toHaveTextContent("dark/dark");
  });

  it("does not persist when storageKey is null", async () => {
    render(<ThemeProvider storageKey={null}><Probe /></ThemeProvider>);
    await userEvent.setup().click(screen.getByText("dark"));
    expect(localStorage.length).toBe(0);
  });

  it("useTheme throws outside a provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useTheme())).toThrow(/ThemeProvider/);
    spy.mockRestore();
  });

  it("getThemeInitScript embeds the storage key", () => {
    expect(getThemeInitScript("my-key")).toContain('"my-key"');
    act(() => {});
  });
});
