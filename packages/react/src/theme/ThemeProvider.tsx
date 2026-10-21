import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  /** The user's choice, which may be `system`. */
  theme: Theme;
  /** What is actually showing right now. */
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DEFAULT_STORAGE_KEY = "nl-theme";

function readStored(key: string): Theme | null {
  try {
    const value = window.localStorage.getItem(key);
    return value === "light" || value === "dark" || value === "system" ? value : null;
  } catch {
    return null;
  }
}

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Returns an inline script that applies the saved theme before first paint.
 * Render it in `<head>` for SSR frameworks to avoid a flash of the wrong theme.
 */
export function getThemeInitScript(storageKey: string = DEFAULT_STORAGE_KEY): string {
  return `try{var t=localStorage.getItem(${JSON.stringify(storageKey)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Theme used when nothing is stored. Defaults to following the system. */
  defaultTheme?: Theme;
  /** localStorage key. Pass `null` to disable persistence. */
  storageKey?: string | null;
}

/**
 * Applies the `data-theme` attribute to `<html>` and exposes `useTheme`.
 * `system` removes the attribute so the CSS `prefers-color-scheme` rule applies.
 */
export function ThemeProvider({ children, defaultTheme = "system", storageKey = DEFAULT_STORAGE_KEY }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [systemDark, setSystemDark] = useState(false);

  // Read stored/system values after mount so server and client markup match.
  useEffect(() => {
    if (storageKey) {
      const stored = readStored(storageKey);
      if (stored) setThemeState(stored);
    }
    setSystemDark(systemPrefersDark());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [storageKey]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      if (!storageKey) return;
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Storage can be blocked (private mode); the theme still applies for this session.
      }
    },
    [storageKey],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme: theme === "system" ? (systemDark ? "dark" : "light") : theme, setTheme }),
    [theme, systemDark, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a <ThemeProvider>");
  return ctx;
}
