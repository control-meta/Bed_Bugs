"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Plus,
  RefreshCw,
  Edit3,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { BlogItem } from "@/lib/blog-db";

export default function EditBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<BlogItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [regenerateTarget, setRegenerateTarget] = useState<BlogItem | null>(null);
  const [regenerateKeywords, setRegenerateKeywords] = useState("");

  useEffect(() => {
    if (regenerateTarget) {
      setRegenerateKeywords(regenerateTarget.keywords?.join(", ") || regenerateTarget.primaryKeyword || "");
    }
  }, [regenerateTarget]);

  // Load blogs from API
  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blogs?search=${encodeURIComponent(search)}&status=${statusFilter}`);
      const data = await res.json();
      if (data.blogs) {
        setBlogs(data.blogs);
      }
      if (data.stats) {
        setStats(data.stats);
      } else if (data.blogs) {
        setStats({
          total: data.blogs.length,
          published: data.blogs.filter((b: BlogItem) => b.status === "published").length,
          draft: data.blogs.filter((b: BlogItem) => b.status === "draft").length,
        });
      }
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBlogs();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/blogs/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget.id));
        setStats((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          published: deleteTarget.status === "published" ? Math.max(0, prev.published - 1) : prev.published,
          draft: deleteTarget.status === "draft" ? Math.max(0, prev.draft - 1) : prev.draft,
        }));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Failed to delete blog:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 min-h-full">
      {/* TOP HERO & METRICS BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            Blog Articles Manager
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Browse, edit, live-preview, and manage published articles & saved drafts with preserved URLs and local images.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/blog-generator"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New AI Blog
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total Articles</span>
            <FileText className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">{stats.total}</p>
          <span className="text-[10px] text-neutral-400">Available in database</span>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Published</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{stats.published}</p>
          <span className="text-[10px] text-emerald-500 font-medium">Live on public site</span>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Drafts</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{stats.draft}</p>
          <span className="text-[10px] text-amber-600 font-medium">Saved in DB (Unpublished)</span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, slug, or target keyword..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl shrink-0">
          {[
            { id: "all", label: "All", count: stats.total },
            { id: "published", label: "Published", count: stats.published },
            { id: "draft", label: "Drafts", count: stats.draft },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === pill.id
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <span>{pill.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                  statusFilter === pill.id
                    ? pill.id === "draft"
                      ? "bg-amber-100 text-amber-800"
                      : pill.id === "published"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-neutral-100 text-neutral-800"
                    : "bg-neutral-200/70 text-neutral-600"
                }`}
              >
                {pill.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* BLOGS LISTING TABLE / CARDS */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-neutral-400 gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-emerald-500" />
            <p className="text-xs font-medium">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <BookOpen className="h-10 w-10 text-neutral-300 mb-2" />
            <h3 className="text-sm font-bold text-neutral-800">No blogs found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm">
              {search ? "No blogs match your search query. Try clearing filters." : "No blogs available yet. Click 'New AI Blog' to generate one!"}
            </p>
            {!search && (
              <Link
                href="/admin/blog-generator"
                className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Generate New Blog
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {blogs.map((blog) => {
              const words = blog.markdown ? blog.markdown.split(/\s+/).filter(Boolean).length : 0;
              return (
                <div
                  key={blog.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 gap-4 hover:bg-neutral-50/70 transition"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Thumbnail */}
                    <div className="relative aspect-[3/2] w-28 shrink-0 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                      {blog.imageUrl ? (
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="h-full w-full object-cover object-top"
                          onError={(e) => {
                            // Fallback on broken image
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-neutral-300" />
                      )}
                      <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.5 text-[9px] font-medium text-white backdrop-blur-xs">
                        {blog.readTime || "5m"}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                            blog.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {blog.status === "draft" && <Clock className="h-3 w-3 text-amber-600" />}
                          {blog.status === "draft" ? "Draft" : "Published"}
                        </span>

                        {blog.primaryKeyword && (
                          <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 border border-neutral-200/60">
                            Key: {blog.primaryKeyword}
                          </span>
                        )}

                        <span className="text-[11px] text-neutral-400">
                          {words} words
                        </span>
                      </div>

                      <Link
                        href={`/admin/edit-blogs/${blog.id}`}
                        className="text-sm font-bold text-neutral-900 hover:text-emerald-600 transition truncate block"
                      >
                        {blog.title}
                      </Link>

                      <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500">
                        <span className="font-mono text-[11px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                          /{blog.slug}
                        </span>
                        <span className="text-[11px]">
                          {blog.status === "draft" ? "Draft saved: " : "Published: "}
                          {new Date(blog.createdAt).toLocaleString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {blog.status === "published" ? (
                      <Link
                        href={`/${blog.slug}`}
                        target="_blank"
                        title="View live on website"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span
                        title="Draft is unpublished and hidden from visitors"
                        className="flex h-8 items-center px-2.5 rounded-lg border border-amber-200 bg-amber-50/70 text-[10px] font-bold text-amber-700 select-none cursor-default"
                      >
                        Draft (Hidden)
                      </span>
                    )}

                    <Link
                      href={`/admin/edit-blogs/${blog.id}`}
                      className="flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit & Live Preview
                    </Link>

                    <button
                      onClick={() => setRegenerateTarget(blog)}
                      title="Regenerate blog"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(blog)}
                      title="Delete blog"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* REGENERATE MODAL */}
      {regenerateTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center gap-3 text-emerald-600 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <RefreshCw className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Regenerate Blog</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
              You are about to regenerate <strong className="text-neutral-900">"{regenerateTarget.title}"</strong>.
              The URL <span className="font-mono bg-neutral-100 px-1 rounded text-[10px]">/{regenerateTarget.slug}</span> will be preserved.
            </p>

            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-xs font-semibold text-neutral-800">Target Keywords for Generation</label>
              <input
                type="text"
                value={regenerateKeywords}
                onChange={(e) => setRegenerateKeywords(e.target.value)}
                placeholder="e.g. bed bugs, termite control"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setRegenerateTarget(null)}
                className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
              <Link
                href={`/admin/blog-generator?topic=${encodeURIComponent(regenerateTarget.topic || regenerateTarget.title)}&keywords=${encodeURIComponent(regenerateKeywords)}&slug=${encodeURIComponent(regenerateTarget.slug)}`}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Proceed to Generator
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Delete Blog Article?</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-neutral-900">"{deleteTarget.title}"</strong>?
              This will remove the article from your database and website. This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
              >
                {isDeleting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
