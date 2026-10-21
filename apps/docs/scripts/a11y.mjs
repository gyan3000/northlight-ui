// Runs axe-core in a real browser against every story, in every style x theme.
// jsdom cannot evaluate color contrast or focus visibility, so this is the check
// that covers them. Build Storybook first: `pnpm --filter northlight-ui-docs build`.
//
// Usage: node scripts/a11y.mjs [--filter <story id substring>] [--verbose]
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "../storybook-static");
if (!existsSync(join(root, "index.json"))) {
  console.error("storybook-static/index.json not found. Run `pnpm --filter northlight-ui-docs build` first.");
  process.exit(2);
}

const args = process.argv.slice(2);
const filter = args.includes("--filter") ? args[args.indexOf("--filter") + 1] : "";
const verbose = args.includes("--verbose");

const STYLES = ["glass", "brutal"];
// Worst-case spot of the glass aurora background for each theme: the darkest blob
// center in light mode (dark text has the least contrast there) and the lightest
// in dark mode. Derived from the radial-gradient stops in tokens.json.
const WORST_CASE_BACKDROP = { light: "#cec3fd", dark: "#12475a" };
const THEMES = ["light", "dark"];
// Page-level rules that cannot apply to an isolated component preview.
const DISABLED_RULES = ["region", "landmark-one-main", "page-has-heading-one"];

// While a Radix modal (Select, Dialog) is open it marks everything outside it
// aria-hidden, which includes Storybook's own root. If that root holds the
// trigger, axe flags a focusable element inside aria-hidden. Focus is trapped
// in the modal at that point, so it is unreachable; ignore it only when the
// flagged element is Storybook's root, and report how many were ignored.
const isModalHarnessNoise = (v) =>
  v.id === "aria-hidden-focus" && v.nodes.every((n) => n.target.join(" ") === "#storybook-root");
let ignoredModalNoise = 0;

// WCAG 1.4.3 exempts inactive (disabled) components from the contrast minimum. Axe applies
// that exemption to native inputs, but not to a disabled Radix radio (a <button>), so it flags
// the label text. Skip contrast only for the text of our own disabled labels, and count it.
const isDisabledLabelText = (n) => /^label\[data-disabled="true"\] > span$/.test(n.target.join(" "));
let exemptDisabledText = 0;
const withoutExemptNodes = (v) =>
  v.id !== "color-contrast"
    ? v.nodes
    : v.nodes.filter((n) => {
        if (!isDisabledLabelText(n)) return true;
        exemptDisabledText++;
        return false;
      });
// color-contrast checks axe could not decide (for example over a gradient). These are NOT passes.
const undecidedContrast = [];

const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png" };

const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const index = await (await fetch(`${base}/index.json`)).json();
const stories = Object.values(index.entries).filter((e) => e.type === "story" && e.id.includes(filter));
console.log(`Auditing ${stories.length} stories x ${STYLES.length} styles x ${THEMES.length} themes in Chromium\n`);

const browser = await chromium.launch();
const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1000, height: 800 } });
const page = await context.newPage();

const failures = [];
let checks = 0;

for (const story of stories) {
  for (const style of STYLES) {
    for (const theme of THEMES) {
      const url = `${base}/iframe.html?id=${story.id}&viewMode=story&globals=style:${style};theme:${theme}`;
      // A story can occasionally be slow to render on a busy machine, so try twice before calling it broken.
      let rendered = false;
      for (let attempt = 0; attempt < 2 && !rendered; attempt++) {
        await page.goto(url, { waitUntil: "load" });
        try {
          await page.waitForSelector("body.sb-show-main", { timeout: 15000 });
          rendered = true;
        } catch {
          // fall through to the retry
        }
      }
      if (!rendered) {
        failures.push({ story: story.id, combo: `${style}/${theme}`, rule: "story-did-not-render", help: "Story never finished rendering", nodes: [] });
        continue;
      }
      // Let fonts load and play functions / open overlays settle.
      await page.evaluate(() => document.fonts?.ready);
      await page.waitForTimeout(250);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .disableRules(DISABLED_RULES)
        .analyze();
      checks++;
      const combo = `${style}/${theme}`;
      const nodesOf = (nodes) =>
        nodes.map((n) => ({ target: n.target.join(" "), summary: n.failureSummary?.split("\n").slice(1).join(" ").trim() }));

      if (style === "glass") {
        // The aurora gradient makes axe report contrast as "incomplete" (undecidable), which
        // would silently pass. Re-check contrast against a flat worst-case backdrop instead.
        await page.addStyleTag({ content: `html{background-image:none !important;background-color:${WORST_CASE_BACKDROP[theme]} !important}` });
        const worst = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
        for (const inc of worst.incomplete) undecidedContrast.push({ story: story.id, combo, nodes: inc.nodes.length });
        for (const v of worst.violations) {
          const nodes = withoutExemptNodes(v);
          if (!nodes.length) continue;
          failures.push({ story: story.id, combo, rule: `${v.id} (worst-case backdrop ${WORST_CASE_BACKDROP[theme]})`, help: v.help, nodes: nodesOf(nodes) });
        }
      } else {
        for (const inc of results.incomplete) {
          if (inc.id === "color-contrast") undecidedContrast.push({ story: story.id, combo, nodes: inc.nodes.length });
        }
      }
      for (const v of results.violations) {
        if (isModalHarnessNoise(v)) {
          ignoredModalNoise++;
          continue;
        }
        const nodes = withoutExemptNodes(v);
        if (!nodes.length) continue;
        failures.push({ story: story.id, combo: `${style}/${theme}`, rule: v.id, help: v.help, nodes: nodesOf(nodes) });
      }
      if (verbose) console.log(`${results.violations.length ? "FAIL" : "ok  "} ${story.id} ${style}/${theme}`);
    }
  }
}

await browser.close();
server.close();

const undecidedNodes = undecidedContrast.reduce((n, u) => n + u.nodes, 0);
if (undecidedContrast.length) {
  const byCombo = {};
  for (const u of undecidedContrast) byCombo[u.combo] = (byCombo[u.combo] ?? 0) + u.nodes;
  console.log(`\nNOTE: axe cannot sample gradients, so ${undecidedNodes} color-contrast results in ${undecidedContrast.length} checks are undecided.\nThese are the gradient-filled controls (primary button, active tab, highlighted option). Their text contrast is\nverified at every gradient stop by the token tests in packages/tokens (pnpm --filter northlight-ui-tokens test).`);
  for (const [combo, n] of Object.entries(byCombo)) console.log(`  ${combo}: ${n} elements`);
}

if (failures.length === 0) {
  console.log(`\nPASS: ${checks} checks, zero axe violations.`);
  if (exemptDisabledText) console.log(`(skipped contrast on ${exemptDisabledText} disabled-label text nodes, exempt under WCAG 1.4.3)`);
  if (ignoredModalNoise) console.log(`(ignored ${ignoredModalNoise} Radix modal aria-hidden-focus results on #storybook-root, see comment in a11y.mjs)`);
  process.exit(0);
}

// Group by rule + message so a systematic palette problem shows up once.
const grouped = new Map();
for (const f of failures) {
  const key = `${f.rule}: ${f.help}`;
  if (!grouped.has(key)) grouped.set(key, []);
  grouped.get(key).push(f);
}
console.log(`\nFAIL: ${failures.length} violations across ${checks} checks\n`);
for (const [key, list] of grouped) {
  console.log(`## ${key}  (${list.length})`);
  for (const f of list.slice(0, verbose ? list.length : 6)) {
    console.log(`  - ${f.story} [${f.combo}]`);
    for (const n of f.nodes.slice(0, 2)) console.log(`      ${n.target}\n        ${n.summary}`);
  }
  if (!verbose && list.length > 6) console.log(`  ... and ${list.length - 6} more (use --verbose)`);
  console.log();
}
process.exit(1);
