"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function MarketingOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  return <div data-marketing="true" className="contents">{children}</div>;
}
