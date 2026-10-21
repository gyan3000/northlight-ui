import { Unstyled } from "@storybook/addon-docs/blocks";
import { useState, type CSSProperties, type ReactNode } from "react";
import tokens from "../../../../packages/tokens/src/tokens.json";
import { Alert, Badge, Button, Input, Label, Stack, Switch, Text } from "../../../../packages/react/src";

type StyleName = "glass" | "brutal";
type Scheme = "light" | "dark";

const STYLE_LABEL: Record<StyleName, string> = { glass: "Glass and aurora", brutal: "Soft neo-brutalist" };
const COMBOS: Array<{ style: StyleName; scheme: Scheme }> = [
  { style: "glass", scheme: "light" },
  { style: "glass", scheme: "dark" },
  { style: "brutal", scheme: "light" },
  { style: "brutal", scheme: "dark" },
];

// ---------------------------------------------------------------------------
// Reading the real tokens, so the docs can never drift from the code.
// ---------------------------------------------------------------------------

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, path: string[] = []): Array<[string, string]> {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string" ? [[[...path, key].join("."), value] as [string, string]] : flatten(value, [...path, key]),
  );
}

function tableFor(style: StyleName, scheme: Scheme): Record<string, string> {
  const s = tokens.styles[style];
  return Object.fromEntries([
    ...flatten(tokens.primitive as Tree),
    ...flatten(s.base as Tree),
    ...flatten(s[scheme] as Tree),
  ]);
}

/** Follows `{color.gray.900}` style references until a concrete value. */
function resolve(value: string, table: Record<string, string>): string {
  let current = value;
  for (let i = 0; i < 10; i++) {
    const match = current.match(/^\{([^}]+)\}$/);
    if (!match) return current;
    current = table[match[1]!] ?? current;
  }
  return current;
}

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parseColor(value: string): Rgba | null {
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1]!, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const rgb = value.match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*([\d.]+))?\s*\)$/);
  if (rgb) return { r: +rgb[1]!, g: +rgb[2]!, b: +rgb[3]!, a: rgb[4] === undefined ? 1 : +rgb[4] };
  return null;
}

/** Lays a translucent color over an opaque one, like the browser does. */
function over(top: Rgba, bottom: Rgba): Rgba {
  const a = top.a + bottom.a * (1 - top.a);
  const mix = (t: number, b: number) => (t * top.a + b * bottom.a * (1 - top.a)) / a;
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a };
}

function luminance({ r, g, b }: Rgba): number {
  const [lr, lg, lb] = [r, g, b].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrast(a: Rgba, b: Rgba): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

// ---------------------------------------------------------------------------
// Shared layout
// ---------------------------------------------------------------------------

const heading: CSSProperties = { margin: "0 0 12px", fontSize: 14, fontWeight: 700, opacity: 0.9 };

/**
 * Renders its children once per style and color scheme, each inside an element
 * carrying `data-style` and `data-theme`, so the real tokens apply to it. This is
 * also how you can theme just one part of a page.
 */
export function StylePanels({
  schemes = ["light", "dark"],
  children,
}: {
  schemes?: Scheme[];
  children: (combo: { style: StyleName; scheme: Scheme }) => ReactNode;
}) {
  return (
    <Unstyled>
    <div style={{ display: "grid", gap: 24, margin: "24px 0" }}>
      {COMBOS.filter((c) => schemes.includes(c.scheme)).map((combo) => (
        <section
          key={`${combo.style}-${combo.scheme}`}
          data-style={combo.style}
          data-theme={combo.scheme}
          style={{
            padding: 20,
            borderRadius: 16,
            backgroundColor: "var(--nl-color-bg)",
            backgroundImage: "var(--nl-bg-image)",
            color: "var(--nl-color-text)",
            fontFamily: "var(--nl-font-family-sans)",
            border: "1px solid rgba(128,128,128,0.35)",
            colorScheme: combo.scheme,
          }}
        >
          <h3 style={{ ...heading, fontSize: 16, marginBottom: 16 }}>
            {STYLE_LABEL[combo.style]} · {combo.scheme === "light" ? "Light" : "Dark"}
          </h3>
          {children(combo)}
        </section>
      ))}
    </div>
    </Unstyled>
  );
}

const checker =
  "conic-gradient(rgba(128,128,128,.35) 25%, transparent 0 50%, rgba(128,128,128,.35) 0 75%, transparent 0) 0 0 / 10px 10px";

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

const COLOR_GROUPS: Array<{ title: string; names: string[] }> = [
  { title: "Surfaces", names: ["bg", "surface", "surface-raised", "subtle"] },
  { title: "Text", names: ["text", "text-muted", "ink"] },
  { title: "Borders", names: ["border", "border-strong", "outline", "edge"] },
  { title: "Actions", names: ["action", "action-hover", "action-text", "danger", "danger-hover", "danger-text", "focus-ring"] },
  { title: "Status", names: ["info", "info-bg", "info-fg", "success", "success-bg", "success-fg", "warning", "warning-bg", "warning-fg", "danger-bg", "danger-fg"] },
];

/** [foreground token, background token, what it is] */
const CONTRAST_PAIRS: Array<[string, string, string]> = [
  ["text", "bg", "Body text on the page"],
  ["text-muted", "bg", "Secondary text on the page"],
  ["text", "surface", "Text on a card or input"],
  ["text-muted", "surface", "Secondary text on a card"],
  ["action-text", "action", "Label on a primary button (solid color)"],
  ["danger-text", "danger", "Label on a danger button"],
  ["danger", "bg", "Error text on the page"],
  ["info-fg", "info-bg", "Info alert and badge text"],
  ["success-fg", "success-bg", "Success alert and badge text"],
  ["warning-fg", "warning-bg", "Warning alert and badge text"],
  ["danger-fg", "danger-bg", "Danger alert and badge text"],
  ["border-strong", "bg", "Form control border (needs 3:1)"],
];

function ColorPanel({ style, scheme }: { style: StyleName; scheme: Scheme }) {
  const table = tableFor(style, scheme);
  const value = (name: string) => resolve(table[`color.${name}`] ?? "", table);
  // Translucent colors are judged as they appear: laid over the page's base color.
  const base = parseColor(value("bg"));
  const solid = (name: string): Rgba | null => {
    const c = parseColor(value(name));
    return c && base ? over(c, base) : c;
  };

  return (
    <>
      {COLOR_GROUPS.map((group) => (
        <div key={group.title} style={{ marginBottom: 20 }}>
          <h4 style={heading}>{group.title}</h4>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
            {group.names.map((name) => (
              <div key={name} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12 }}>
                <span style={{ flexShrink: 0, inlineSize: 44, blockSize: 28, borderRadius: 6, background: checker, overflow: "hidden", border: "1px solid rgba(128,128,128,0.5)" }}>
                  <span style={{ display: "block", inlineSize: "100%", blockSize: "100%", background: `var(--nl-color-${name})` }} />
                </span>
                <span style={{ display: "grid", minInlineSize: 0 }}>
                  <code style={{ fontWeight: 700 }}>--nl-color-{name}</code>
                  <span style={{ opacity: 0.75, overflowWrap: "anywhere" }}>{value(name)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <h4 style={heading}>Contrast (WCAG 2.2 AA: 4.5:1 for text, 3:1 for control borders)</h4>
      <table style={{ borderCollapse: "collapse", inlineSize: "100%", fontSize: 12 }}>
        <thead>
          <tr>
            {["Pair", "Where it is used", "Ratio", "AA"].map((h) => (
              <th key={h} style={{ textAlign: "start", padding: "6px 8px", borderBottom: "1px solid rgba(128,128,128,0.5)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CONTRAST_PAIRS.map(([fg, bg, use]) => {
            const f = solid(fg);
            const b = solid(bg);
            const ratio = f && b ? contrast(f, b) : null;
            const needed = fg === "border-strong" ? 3 : 4.5;
            return (
              <tr key={`${fg}-${bg}`}>
                <td style={{ padding: "6px 8px", borderBottom: "1px solid rgba(128,128,128,0.25)" }}><code>{fg}</code> on <code>{bg}</code></td>
                <td style={{ padding: "6px 8px", borderBottom: "1px solid rgba(128,128,128,0.25)" }}>{use}</td>
                <td style={{ padding: "6px 8px", borderBottom: "1px solid rgba(128,128,128,0.25)", whiteSpace: "nowrap" }}>{ratio ? `${ratio.toFixed(2)}:1` : "n/a"}</td>
                <td style={{ padding: "6px 8px", borderBottom: "1px solid rgba(128,128,128,0.25)", fontWeight: 700 }}>{ratio === null ? "–" : ratio >= needed ? "✓ pass" : "✗ fail"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

/** Every semantic color with its value and contrast ratios, in each style and scheme. */
export function ColorTokens() {
  return <StylePanels>{({ style, scheme }) => <ColorPanel style={style} scheme={scheme} />}</StylePanels>;
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export function TypeScale() {
  const sizes = flatten(tokens.primitive.font.size as Tree);
  const weights = [
    ["regular", "font.weight.regular"],
    ["medium", "font.weight.medium"],
    ["semibold", "font.weight.semibold"],
  ] as const;
  return (
    <StylePanels schemes={["light"]}>
      {({ style, scheme }) => {
        const table = tableFor(style, scheme);
        return (
          <>
            <h4 style={heading}>Typeface</h4>
            <p style={{ margin: "0 0 4px", fontSize: 28 }}>Aa Bb Cc 0123456789</p>
            <p style={{ margin: "0 0 20px", fontSize: 12, opacity: 0.75 }}>
              <code>--nl-font-family-sans</code>: {table["font.family.sans"]}
            </p>

            <h4 style={heading}>Size scale</h4>
            <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
              {sizes.map(([name, value]) => (
                <div key={name} style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <code style={{ inlineSize: 150, flexShrink: 0, fontSize: 12 }}>--nl-font-size-{name.split(".").pop()}</code>
                  <span style={{ inlineSize: 60, flexShrink: 0, fontSize: 12, opacity: 0.7 }}>{value}</span>
                  <span style={{ fontSize: `var(--nl-font-size-${name.split(".").pop()})` }}>The quick brown fox jumps over the lazy dog</span>
                </div>
              ))}
            </div>

            <h4 style={heading}>Weights</h4>
            <div style={{ display: "grid", gap: 6 }}>
              {weights.map(([name, key]) => (
                <div key={name} style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <code style={{ inlineSize: 150, flexShrink: 0, fontSize: 12 }}>--nl-font-weight-{name}</code>
                  <span style={{ inlineSize: 60, flexShrink: 0, fontSize: 12, opacity: 0.7 }}>{table[key]}</span>
                  <span style={{ fontWeight: `var(--nl-font-weight-${name})` as unknown as number, fontSize: 18 }}>The quick brown fox</span>
                </div>
              ))}
            </div>
          </>
        );
      }}
    </StylePanels>
  );
}

// ---------------------------------------------------------------------------
// Spacing, radius, elevation
// ---------------------------------------------------------------------------

/** The spacing scale. Identical in every style. */
export function SpacingScale() {
  const spaces = flatten(tokens.primitive.space as Tree);
  return (
    <Unstyled>
    <div style={{ display: "grid", gap: 8, margin: "24px 0" }}>
      {spaces.map(([name, value]) => (
        <div key={name} style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <code style={{ inlineSize: 140, flexShrink: 0, fontSize: 12 }}>--nl-space-{name}</code>
          <span style={{ inlineSize: 64, flexShrink: 0, fontSize: 12, opacity: 0.7 }}>{value}</span>
          <span style={{ display: "block", blockSize: 16, inlineSize: `var(--nl-space-${name})`, minInlineSize: 1, background: "#7c6cf0", borderRadius: 3 }} />
        </div>
      ))}
    </div>
    </Unstyled>
  );
}

const sample: CSSProperties = {
  inlineSize: 88,
  blockSize: 64,
  display: "grid",
  placeItems: "center",
  fontSize: 12,
  background: "var(--nl-color-surface-raised)",
  border: "var(--nl-border-width-container) solid var(--nl-color-outline)",
};

/** Corner radii, border widths and shadows: the part of a style that is shape rather than color. */
export function ShapeTokens() {
  const radii = ["sm", "md", "lg", "xl", "full"];
  const shadows = ["sm", "md", "lg"];
  return (
    <StylePanels>
      {({ style, scheme }) => {
        const table = tableFor(style, scheme);
        return (
          <>
            <h4 style={heading}>Radius</h4>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
              {radii.map((r) => (
                <div key={r} style={{ display: "grid", gap: 6, justifyItems: "center", fontSize: 12 }}>
                  <div style={{ ...sample, borderRadius: `var(--nl-radius-${r})` }}>{table[`radius.${r}`]}</div>
                  <code>radius-{r}</code>
                </div>
              ))}
            </div>
            <h4 style={heading}>Elevation (shadows)</h4>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
              {shadows.map((s) => (
                <div key={s} style={{ display: "grid", gap: 6, justifyItems: "center", fontSize: 12 }}>
                  <div style={{ ...sample, borderRadius: "var(--nl-radius-md)", boxShadow: `var(--nl-shadow-${s})` }} />
                  <code>shadow-{s}</code>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>
              Border width: control <code>{table["border-width.control"]}</code>, container <code>{table["border-width.container"]}</code>. Edge blur:{" "}
              <code>{table["blur.surface"]}</code>.
            </p>
          </>
        );
      }}
    </StylePanels>
  );
}

// ---------------------------------------------------------------------------
// Live theme playground
// ---------------------------------------------------------------------------

const select: CSSProperties = { padding: "6px 10px", borderRadius: 6, font: "inherit", fontFamily: "system-ui, sans-serif" };

/** Pick a style and a scheme and watch real components change. Only the preview box is themed. */
export function ThemePlayground() {
  const [style, setStyle] = useState<StyleName>("glass");
  const [scheme, setScheme] = useState<Scheme>("light");
  const [accent, setAccent] = useState("");

  return (
    <Unstyled>
    <div style={{ margin: "24px 0" }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12, fontSize: 14, fontFamily: "system-ui, sans-serif" }}>
        <label style={{ display: "grid", gap: 4 }}>
          Style
          <select style={select} value={style} onChange={(e) => setStyle(e.target.value as StyleName)}>
            <option value="glass">Glass and aurora</option>
            <option value="brutal">Soft neo-brutalist</option>
          </select>
        </label>
        <label style={{ display: "grid", gap: 4 }}>
          Color scheme
          <select style={select} value={scheme} onChange={(e) => setScheme(e.target.value as Scheme)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label style={{ display: "grid", gap: 4 }}>
          Override <code>--nl-color-action</code>
          <span style={{ display: "flex", gap: 8 }}>
            <input type="color" aria-label="Accent color" value={accent || "#8b5cf6"} onChange={(e) => setAccent(e.target.value)} />
            <button type="button" style={select} onClick={() => setAccent("")}>
              Reset
            </button>
          </span>
        </label>
      </div>

      <div
        data-style={style}
        data-theme={scheme}
        style={{
          padding: 24,
          borderRadius: 16,
          backgroundColor: "var(--nl-color-bg)",
          backgroundImage: "var(--nl-bg-image)",
          color: "var(--nl-color-text)",
          fontFamily: "var(--nl-font-family-sans)",
          border: "1px solid rgba(128,128,128,0.35)",
          colorScheme: scheme,
          // A plain CSS override on the element, exactly how an app would re-theme.
          ...(accent ? ({ "--nl-color-action": accent, "--nl-fill-action": accent, "--nl-fill-action-hover": accent } as CSSProperties) : {}),
        }}
      >
        <Stack gap="4">
          <Stack direction="row" gap="2" wrap align="center">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button tone="danger">Delete</Button>
            <Badge tone="success">Paid</Badge>
            <Badge tone="warning">Pending</Badge>
          </Stack>
          <div>
            <Label htmlFor="playground-name">Name</Label>
            <Input id="playground-name" placeholder="Ada Lovelace" />
          </div>
          <Switch defaultChecked>Email notifications</Switch>
          <Alert tone="info" title="Heads up">
            Everything here reads from CSS variables, so a single override re-themes it.
          </Alert>
          <Text tone="muted" size="sm">
            Muted text, set in the style's typeface.
          </Text>
        </Stack>
      </div>
    </div>
    </Unstyled>
  );
}
