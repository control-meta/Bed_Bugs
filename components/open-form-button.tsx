"use client";

import type { ReactNode } from "react";

export function OpenFormButton({
  children,
  className = "",
  ariaLabel,
  style,
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => window.dispatchEvent(new Event("open-floating-form"))}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
}
