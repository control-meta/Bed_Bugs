"use client";

import type { ReactNode } from "react";

export function OpenFormButton({
  children,
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => window.dispatchEvent(new Event("open-floating-form"))}
      className={className}
    >
      {children}
    </button>
  );
}
