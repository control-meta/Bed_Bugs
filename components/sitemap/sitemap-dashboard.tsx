"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  MapPin,
  FileText,
  Compass,
  ArrowRight,
  Code2,
  Bot,
  Filter,
  Layers,
} from "lucide-react";

export type SitemapItem = {
  url: string;
  path: string;
  title: string;
  description: string;
  category: "core" | "location" | "blog";
  priority: string;
  changefreq: string;
  updatedAt?: string;
  readTime?: string;
};

interface SitemapDashboardProps {
  items: SitemapItem[];
}

export function SitemapDashboard({ items }: SitemapDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "core" | "location" | "blog">("all");

  const counts = useMemo(() => {
    const total = items.length;
    const core = items.filter((i) => i.category === "core").length;
    const location = items.filter((i) => i.category === "location").length;
    const blog = items.filter((i) => i.category === "blog").length;
    return { total, core, location, blog };
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const matchesTab = activeTab === "all" || item.category === activeTab;
      if (!matchesTab) return false;
      if (!query) return true;

      return (
        item.title.toLowerCase().includes(query) ||
        item.path.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    });
  }, [items, searchQuery, activeTab]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Quick Action & Stat Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition hover:border-brand-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{counts.total}</p>
              <p className="text-xs font-medium text-slate-500">Total Indexed Pages</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-brand-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{counts.core}</p>
              <p className="text-xs font-medium text-slate-500">Core Services</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-brand-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{counts.location}</p>
              <p className="text-xs font-medium text-slate-500">City Hubs</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-brand-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{counts.blog}</p>
              <p className="text-xs font-medium text-slate-500">Guides &amp; Articles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer & Bot Feeds Banner */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-200/60 bg-gradient-to-r from-brand-50/70 via-emerald-50/40 to-teal-50/60 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink">Machine &amp; Crawler Accessible Feeds</h2>
            <p className="text-xs text-slate-600">
              Direct XML and plain-text endpoints for Googlebot, Bingbot, LLM aggregators, and indexing tools.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-brand-700 shadow-sm border border-brand-200 hover:bg-brand-50 transition"
          >
            <Code2 className="h-3.5 w-3.5" />
            View sitemap.xml
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition"
          >
            <Bot className="h-3.5 w-3.5" />
            View llms.txt
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* Interactive Controls: Search & Tabs */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages, cities, keywords or topics..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-ink placeholder-slate-400 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === "all"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:text-ink"
            }`}
          >
            All ({counts.total})
          </button>
          <button
            onClick={() => setActiveTab("core")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === "core"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:text-ink"
            }`}
          >
            Core ({counts.core})
          </button>
          <button
            onClick={() => setActiveTab("location")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === "location"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:text-ink"
            }`}
          >
            Cities ({counts.location})
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === "blog"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:text-ink"
            }`}
          >
            Guides ({counts.blog})
          </button>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="mt-6">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <Filter className="mx-auto h-8 w-8 text-slate-300" />
            <h3 className="mt-3 text-base font-semibold text-ink">No matching pages found</h3>
            <p className="mt-1 text-xs text-slate-500">
              We couldn’t find any pages matching &quot;{searchQuery}&quot;. Try adjusting your search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const categoryBadge =
                item.category === "core" ? (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                    Core Page
                  </span>
                ) : item.category === "location" ? (
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    City Location
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    Pest Guide
                  </span>
                );

              return (
                <div
                  key={item.url}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      {categoryBadge}
                      <span className="text-[11px] font-medium text-slate-400">
                        Priority {item.priority}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-ink transition group-hover:text-brand-600">
                      <Link href={item.path} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {item.title}
                      </Link>
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                    <span className="font-mono text-slate-500 truncate max-w-[170px]">
                      {item.path}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-brand-600 transition group-hover:translate-x-0.5">
                      Visit <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom SEO Directory Links */}
      <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <h3 className="text-base font-bold text-ink">About this Sitemap Directory</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          This comprehensive visual directory maps all certified bed bug inspection hubs, residential and commercial treatment programs, government-approved chemical protocols, and pest identification manuals across India. For automated crawl feeds, utilize our{" "}
          <a href="/sitemap.xml" className="font-medium text-brand-600 hover:underline">
            XML Sitemap
          </a>{" "}
          or the{" "}
          <a href="/llms.txt" className="font-medium text-brand-600 hover:underline">
            LLMs Text Manifest
          </a>.
        </p>
      </div>
    </div>
  );
}
