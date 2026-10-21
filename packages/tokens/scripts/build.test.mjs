import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { buildCss, flatten, resolveRef } from "./build.mjs";

const tokens = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../src/tokens.json"), "utf8"),
);
const names = (t) => flatten(t).map(([n]) => n).sort();
const styleNames = Object.keys(tokens.styles);

test("flatten joins nested keys with dashes", () => {
  assert.deepEqual(flatten({ a: { b: "1" }, c: "2" }), [["a-b", "1"], ["c", "2"]]);
});

test("resolveRef turns token references into var()", () => {
  assert.equal(resolveRef("{color.gray.900}"), "var(--nl-color-gray-900)");
  assert.equal(resolveRef("#fff"), "#fff");
});

test("the default style exists", () => {
  assert.ok(styleNames.includes(tokens.defaultStyle));
});

for (const name of styleNames) {
  const style = tokens.styles[name];

  test(`${name}: light and dark define the same tokens`, () => {
    assert.deepEqual(names(style.light), names(style.dark));
  });

  test(`${name}: every reference points at a defined token`, () => {
    const known = new Set(
      [tokens.primitive, style.base, style.light].flatMap((t) => flatten(t).map(([n]) => `--nl-${n}`)),
    );
    for (const scheme of ["base", "light", "dark"]) {
      for (const [token, value] of flatten(style[scheme])) {
        for (const match of resolveRef(String(value)).matchAll(/var\((--nl-[\w-]+)\)/g)) {
          assert.ok(known.has(match[1]), `${name}.${scheme} ${token} -> ${match[1]} is not defined`);
        }
      }
    }
  });
}

test("every style defines the same set of tokens, so components work in all of them", () => {
  const surface = (s) => names({ ...s.base, ...s.light });
  const [first, ...rest] = styleNames;
  for (const other of rest) {
    assert.deepEqual(surface(tokens.styles[other]), surface(tokens.styles[first]), `${other} differs from ${first}`);
  }
});

test("css scopes each style by attribute and supports system and explicit dark", () => {
  const css = buildCss(tokens);
  for (const name of styleNames) assert.match(css, new RegExp(`\\[data-style="${name}"\\]`));
  assert.match(css, /:root:not\(\[data-style\]\)/);
  assert.match(css, /prefers-color-scheme: dark/);
  assert.match(css, /\[data-theme="dark"\]/);
});

// ---- Contrast of text on filled controls -------------------------------------------
// Axe cannot sample a gradient, so it reports gradient-filled buttons, the active tab
// and the highlighted select option as "undecided". Check them here, at every stop.
const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Dot-joined paths, so "color.action-hover" stays distinct from "color.action.hover".
const flattenDot = (obj, path = []) =>
  Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" && v !== null ? flattenDot(v, [...path, k]) : [[[...path, k].join("."), v]],
  );

function resolveHex(ref, style, scheme) {
  const lookup = {
    ...Object.fromEntries(flattenDot(tokens.primitive)),
    ...Object.fromEntries(flattenDot(tokens.styles[style][scheme])),
  };
  let value = ref;
  for (let i = 0; i < 10 && !/^#[0-9a-f]{6}$/i.test(value); i++) {
    const m = value.match(/^\{([^}]+)\}$/);
    if (!m) return null;
    value = lookup[m[1]] ?? null;
    if (value === null) return null;
  }
  return value;
}

const stopsOf = (fill) => [...fill.matchAll(/\{[^}]+\}|#[0-9a-f]{6}/gi)].map((m) => m[0]);

for (const name of styleNames) {
  for (const scheme of ["light", "dark"]) {
    for (const fill of ["action", "action-hover", "danger", "danger-hover"]) {
      const text = fill.startsWith("danger") ? "danger-text" : "action-text";
      test(`${name}/${scheme}: ${text} is readable on every stop of fill-${fill}`, () => {
        const style = tokens.styles[name][scheme];
        const textHex = resolveHex(style.color[text], name, scheme);
        assert.ok(textHex, `${text} did not resolve to a hex color`);
        for (const stop of stopsOf(style.fill[fill])) {
          const stopHex = resolveHex(stop, name, scheme);
          assert.ok(stopHex, `${stop} did not resolve to a hex color`);
          const ratio = contrast(textHex, stopHex);
          assert.ok(ratio >= 4.5, `${text} ${textHex} on ${stop} ${stopHex} is ${ratio.toFixed(2)}:1, needs 4.5:1`);
        }
      });
    }
  }
}
