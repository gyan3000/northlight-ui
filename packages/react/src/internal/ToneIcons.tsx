import type { ReactNode } from "react";

export type Tone = "info" | "success" | "warning" | "danger";

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Decorative status icons shared by Alert and Toast. Always render inside `aria-hidden`. */
export const toneIcons: Record<Tone, ReactNode> = {
  info: (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  ),
  success: (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.7 2.7L16 9.5" />
    </svg>
  ),
  warning: (
    <svg {...svgProps}>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v4M12 17h.01" />
    </svg>
  ),
  danger: (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  ),
};

export const closeIcon = (
  <svg {...svgProps}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
