"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QrCode, Download, X } from "lucide-react";

export function QrPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-600"
      >
        <QrCode className="h-4 w-4" />
        Scan QR Code
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="QR Code"
        >
          <div
            className="relative w-full max-w-sm rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-neutral-700 transition hover:bg-black/20"
            >
              <X className="h-4 w-4" />
            </button>
            <Image
              src="/QR/qr-code.png"
              alt="Payment QR Code"
              width={600}
              height={600}
              unoptimized
              className="h-auto w-full rounded-xl bg-white"
            />
            <a
              href="/QR/qr-code.png"
              download="qr-code.png"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              <Download className="h-4 w-4" />
              Download QR Code
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
