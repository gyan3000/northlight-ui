/// <reference types="vitest/config" />
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["src"], exclude: ["src/**/*.test.tsx", "src/**/*.stories.tsx"] }),
    {
      // Ship the compiled design tokens next to the component CSS.
      name: "copy-tokens",
      closeBundle() {
        mkdirSync(resolve(import.meta.dirname, "dist"), { recursive: true });
        copyFileSync(
          resolve(import.meta.dirname, "../tokens/dist/tokens.css"),
          resolve(import.meta.dirname, "dist/tokens.css"),
        );
      },
    },
  ],
  css: { modules: { localsConvention: "camelCaseOnly" } },
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        button: resolve(import.meta.dirname, "src/Button/index.ts"),
        input: resolve(import.meta.dirname, "src/Input/index.ts"),
        label: resolve(import.meta.dirname, "src/Label/index.ts"),
        checkbox: resolve(import.meta.dirname, "src/Checkbox/index.ts"),
        switch: resolve(import.meta.dirname, "src/Switch/index.ts"),
        formfield: resolve(import.meta.dirname, "src/FormField/index.ts"),
        spinner: resolve(import.meta.dirname, "src/Spinner/index.ts"),
        badge: resolve(import.meta.dirname, "src/Badge/index.ts"),
        alert: resolve(import.meta.dirname, "src/Alert/index.ts"),
        card: resolve(import.meta.dirname, "src/Card/index.ts"),
        dialog: resolve(import.meta.dirname, "src/Dialog/index.ts"),
        tooltip: resolve(import.meta.dirname, "src/Tooltip/index.ts"),
        tabs: resolve(import.meta.dirname, "src/Tabs/index.ts"),
        select: resolve(import.meta.dirname, "src/Select/index.ts"),
        toast: resolve(import.meta.dirname, "src/Toast/index.ts"),
        textarea: resolve(import.meta.dirname, "src/Textarea/index.ts"),
        radio: resolve(import.meta.dirname, "src/Radio/index.ts"),
        iconbutton: resolve(import.meta.dirname, "src/IconButton/index.ts"),
        dropdownmenu: resolve(import.meta.dirname, "src/DropdownMenu/index.ts"),
        popover: resolve(import.meta.dirname, "src/Popover/index.ts"),
        progress: resolve(import.meta.dirname, "src/Progress/index.ts"),
        avatar: resolve(import.meta.dirname, "src/Avatar/index.ts"),
        accordion: resolve(import.meta.dirname, "src/Accordion/index.ts"),
        box: resolve(import.meta.dirname, "src/Box/index.ts"),
        stack: resolve(import.meta.dirname, "src/Stack/index.ts"),
        text: resolve(import.meta.dirname, "src/Text/index.ts"),
        icon: resolve(import.meta.dirname, "src/Icon/index.ts"),
        skeleton: resolve(import.meta.dirname, "src/Skeleton/index.ts"),
        breadcrumb: resolve(import.meta.dirname, "src/Breadcrumb/index.ts"),
        pagination: resolve(import.meta.dirname, "src/Pagination/index.ts"),
        slider: resolve(import.meta.dirname, "src/Slider/index.ts"),
        table: resolve(import.meta.dirname, "src/Table/index.ts"),
        drawer: resolve(import.meta.dirname, "src/Drawer/index.ts"),
        combobox: resolve(import.meta.dirname, "src/Combobox/index.ts"),
        theme: resolve(import.meta.dirname, "src/theme/index.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", /^@radix-ui\//],
      output: {
        // Every entry is safe to render from a React Server Components tree
        // boundary: mark them as client modules so Next.js App Router works.
        banner: '"use client";',
        assetFileNames: (asset) => (asset.names?.[0]?.endsWith(".css") ? "styles.css" : "[name][extname]"),
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: { modules: { classNameStrategy: "non-scoped" } },
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx", "src/**/index.ts"],
      thresholds: { statements: 85 },
    },
  },
});
