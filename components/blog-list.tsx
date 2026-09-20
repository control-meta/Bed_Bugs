"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Image as ImageIcon } from "lucide-react";
import type { BlogItem } from "@/lib/blog-db";

const PAGE_SIZE = 6;

export function BlogList({ blogs }: { blogs: BlogItem[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (blogs.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8">
        <BookOpen className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-neutral-800">Articles Coming Soon</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
          We are actively publishing our latest pest management guides. Check back shortly or contact our support team.
        </p>
      </div>
    );
  }

  const visibleBlogs = blogs.slice(0, visibleCount);
  const hasMore = visibleCount < blogs.length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {visibleBlogs.map((blog) => (
          <article
            key={blog.id}
            className="group flex flex-col rounded-2xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-brand-200 transition-all duration-300"
          >
            {/* Thumbnail Image */}
            <Link href={`/${blog.slug}`} className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-100 block">
              {blog.imageUrl ? (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="h-full w-full object-cover object-top transition-opacity duration-300 group-hover:opacity-95"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-300">
                  <ImageIcon className="h-12 w-12" />
                </div>
              )}
            </Link>

            {/* Body Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                    {blog.primaryKeyword || "Pest Control"}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                  <Link href={`/${blog.slug}`}>{blog.title}</Link>
                </h2>

                {blog.excerpt && (
                  <p className="text-xs text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
                    {blog.excerpt
                      .replace(/&#8217;/g, "'")
                      .replace(/&#8211;/g, "–")
                      .replace(/&#8212;/g, "—")
                      .replace(/&#038;/g, "&")
                      .replace(/&amp;/g, "&")
                      .replace(/&quot;/g, '"')}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-start">
                <Link
                  href={`/${blog.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:translate-x-0.5 transition-transform"
                >
                  Read The Article <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-6 py-3 text-xs font-bold text-brand-600 shadow-xs hover:bg-brand-50 hover:border-brand-300 transition"
          >
            Load More
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
