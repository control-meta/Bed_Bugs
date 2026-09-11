"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({
  items,
  defaultOpen = 0,
  pageSize = 3,
}: {
  items: FaqItem[];
  defaultOpen?: number;
  pageSize?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpen >= 0 ? defaultOpen : null,
  );
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <div className="space-y-3">
      {visibleItems.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.question}
            className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
              open
                ? "border-brand-600/30 shadow-lg shadow-brand-600/5"
                : "border-ink/10 hover:border-brand-600/20"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-[15px] font-semibold text-ink"
            >
              <span>{item.question}</span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-brand-600 transition-transform duration-300 ${
                  open ? "rotate-45 bg-brand-600 text-white" : ""
                }`}
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                open
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="border-t border-ink/10 px-5 pb-4 pt-3 text-sm leading-relaxed text-ink/60">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      {items.length > pageSize && (
        <div className="pt-1 text-center">
          {hasMore ? (
            <button
              type="button"
              onClick={() =>
                setVisibleCount((c) => Math.min(c + pageSize, items.length))
              }
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-brand-600/25 bg-white px-5 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-600 hover:bg-brand-600 hover:text-white"
            >
              Load more
              <ChevronDown className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setVisibleCount(pageSize)}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink/60 transition hover:border-brand-600/40 hover:text-brand-600"
            >
              Show less
            </button>
          )}
        </div>
      )}
    </div>
  );
}
