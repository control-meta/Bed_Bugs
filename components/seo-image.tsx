"use client";

import React, { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

interface SeoImageProps extends Omit<ImageProps, "alt"> {
  alt?: string;
  fallbackAlt?: string;
  customAlt?: string;
}

/**
 * Universal SEO-Optimized Image Component
 * Automatically resolves and reflects dynamically edited Alt text from database/admin
 */
export function SeoImage({
  src,
  alt = "",
  fallbackAlt,
  customAlt,
  ...props
}: SeoImageProps) {
  const [resolvedAlt, setResolvedAlt] = useState<string>(
    customAlt || alt || fallbackAlt || "Bed bug treatment pest control service"
  );

  useEffect(() => {
    if (customAlt) {
      setResolvedAlt(customAlt);
      return;
    }

    // If running in browser and src is string path, check global registry or local cache
    if (typeof window !== "undefined" && typeof src === "string" && src.startsWith("/images/")) {
      const win = window as any;
      if (win.__SEO_ALT_MAP__ && win.__SEO_ALT_MAP__[src]) {
        setResolvedAlt(win.__SEO_ALT_MAP__[src]);
      }
    }
  }, [src, customAlt]);

  return <Image src={src} alt={resolvedAlt} {...props} />;
}
