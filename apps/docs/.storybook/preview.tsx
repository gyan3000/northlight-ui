import type { Decorator, Preview } from "@storybook/react-vite";
import "../../../packages/tokens/dist/tokens.css";
import { DocsPage } from "./DocsPage";

// Toolbar switches drive the same attributes consumers use:
// data-style picks the visual style, data-theme picks light or dark.
const withTheme: Decorator = (Story, context) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", context.globals.theme as string);
  root.setAttribute("data-style", context.globals.style as string);
  // Paint the page background on <html> like a real app would, so fixed and
  // portalled UI (toasts, dialogs) always sits over the themed background,
  // whatever layout the story uses.
  root.style.backgroundColor = "var(--nl-color-bg)";
  root.style.backgroundImage = "var(--nl-bg-image)";
  root.style.backgroundAttachment = "fixed";
  return (
    <div
      style={{
        color: "var(--nl-color-text)",
        fontFamily: "var(--nl-font-family-sans)",
        padding: "var(--nl-space-6)",
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    style: {
      description: "Visual style",
      toolbar: {
        title: "Style",
        icon: "paintbrush",
        items: [
          { value: "glass", title: "Glass and aurora" },
          { value: "brutal", title: "Soft neo-brutalist" },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light", style: "glass" },
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
    docs: { toc: true, page: DocsPage },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Design tokens",
          "Guides",
          "Recipes",
          "Foundations",
          "Actions",
          "Forms",
          "Feedback",
          "Overlays",
          "Navigation",
          "Data display",
          "Layout",
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
