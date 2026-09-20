"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Save,
  Sparkles,
  ExternalLink,
  Lock,
  Unlock,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  Image as ImageIcon,
  ImageOff,
  CheckCircle2,
  FileText,
  AlertCircle,
  Tag,
  Hash,
  Share2,
  PhoneCall,
  User,
} from "lucide-react";
import type { BlogItem } from "@/lib/blog-db";

export default function EditBlogStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(true);
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [keywordsStr, setKeywordsStr] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [markdown, setMarkdown] = useState("");

  // AI Regenerator State
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateTopic, setRegenerateTopic] = useState("");
  const [skipImages, setSkipImages] = useState(false);
  const [regenSuccess, setRegenSuccess] = useState(false);

  // Preview viewport: "desktop" | "tablet" | "mobile"
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Load blog
  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        const data = await res.json();
        if (data.blog) {
          const b: BlogItem = data.blog;
          setBlog(b);
          setTitle(b.title);
          setSlug(b.slug);
          setPrimaryKeyword(b.primaryKeyword || "");
          setKeywordsStr((b.keywords || []).join(", "));
          setImageUrl(b.imageUrl || "");

          setMarkdown(b.markdown || "");
          setRegenerateTopic(b.topic || b.title);
        } else {
          setError(data.error || "Blog not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  // Word count & read time calculation
  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    const keywords = keywordsStr
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          primaryKeyword,
          keywords,
          imageUrl,
          status: "published",
          markdown,
          readTime,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setSaveSuccess(true);
      if (data.blog) setBlog(data.blog);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  // AI Regenerate Handler (preserves identical URL/slug)
  const handleRegenerate = async () => {
    if (
      !confirm(
        `Regenerate this blog with AI using the exact same URL (/${slug})? Your existing content will be replaced by the fresh AI draft.`
      )
    ) {
      return;
    }

    setIsRegenerating(true);
    setRegenSuccess(false);
    setError(null);

    const keywords = keywordsStr
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/admin/blogs/${id}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          keywords,
          primaryKeyword,
          topic: regenerateTopic || title,
          skipImages,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to regenerate");

      if (data.blog) {
        setBlog(data.blog);
        setMarkdown(data.blog.markdown);
        setRegenSuccess(true);
        setTimeout(() => setRegenSuccess(false), 4000);
      }
    } catch (err: any) {
      setError(err.message || "Regeneration failed");
    } finally {
      setIsRegenerating(false);
    }
  };

  // Quick markdown formatting insertions
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end);
    const replacement = prefix + (selected || "text") + suffix;
    const next = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(next);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || "text").length);
    }, 50);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <RefreshCw className="h-6 w-6 animate-spin text-emerald-500" />
          <p className="text-xs">Loading blog editor...</p>
        </div>
      </div>
    );
  }

  if (error && !blog) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center max-w-md">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <h3 className="font-bold text-red-900 text-sm">Error Loading Blog</h3>
          <p className="text-xs text-red-700 mt-1">{error}</p>
          <Link
            href="/admin/edit-blogs"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col min-h-0 overflow-hidden bg-neutral-100">
      {/* TOP ACTION BAR */}
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5 shrink-0 z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/edit-blogs"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 transition"
            title="Back to all blogs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-900 truncate max-w-xs sm:max-w-md">
                {title || "Untitled Blog"}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                /{slug}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{readTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 cursor-default">
            Status: Published
          </div>

          {/* View Live on Website */}
          <Link
            href={`/${slug}`}
            target="_blank"
            className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View Live</span>
          </Link>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs disabled:opacity-50"
          >
            {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </header>

      {/* NOTIFICATIONS */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-xs text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">&times;</button>
        </div>
      )}
      {regenSuccess && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Article regenerated with AI using the exact same URL (/{slug})!</span>
        </div>
      )}

      {/* SPLIT SCREEN WORKSPACE */}
      <div className="flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row">
        {/* LEFT PANE: Editor & AI Controls */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-neutral-200 bg-white overflow-y-auto">
          {/* ARTICLE METADATA FORM */}
          <div className="p-4 border-b border-neutral-100 flex flex-col gap-3.5 bg-neutral-50/50">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                Article Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title..."
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Slug / URL with Lock Protection */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                  URL Slug (Preserved by default)
                </label>
                <button
                  type="button"
                  onClick={() => setSlugLocked(!slugLocked)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-neutral-800"
                >
                  {slugLocked ? <Lock className="h-3 w-3 text-amber-600" /> : <Unlock className="h-3 w-3 text-emerald-600" />}
                  {slugLocked ? "Locked (Keeps Same URL)" : "Unlocked (Editable)"}
                </button>
              </div>
              <div className="flex items-center rounded-xl border border-neutral-200 bg-white px-3 py-1.5 focus-within:border-emerald-500">
                <span className="text-xs text-neutral-400 select-none">/</span>
                <input
                  type="text"
                  value={slug}
                  disabled={slugLocked}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-xs text-neutral-900 outline-none disabled:text-neutral-500"
                />
              </div>
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1">
                  <Hash className="h-3 w-3 text-neutral-400" /> Primary Keyword
                </label>
                <input
                  type="text"
                  value={primaryKeyword}
                  onChange={(e) => setPrimaryKeyword(e.target.value)}
                  placeholder="Primary SEO keyword..."
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="h-3 w-3 text-neutral-400" /> Secondary Keywords
                </label>
                <input
                  type="text"
                  value={keywordsStr}
                  onChange={(e) => setKeywordsStr(e.target.value)}
                  placeholder="Comma-separated keywords..."
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Featured Image URL & Preview */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="h-3 w-3 text-neutral-400" /> Featured Image URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/blogs/... or remote image URL"
                  className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-emerald-500"
                />
                {imageUrl && (
                  <div className="h-8 w-12 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0">
                    <img src={imageUrl} alt="Thumb" className="h-full w-full object-cover object-top" />
                  </div>
                )}
              </div>
            </div>

            {/* AI REGENERATOR CARD */}
            <div className="mt-1 rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50/70 via-white to-purple-50/30 p-3.5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-600 text-white shadow-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-purple-950">AI Content Regenerator</h4>
                </div>
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  Preserves Same URL
                </span>
              </div>

              <p className="text-[11px] text-purple-800/80 mb-3 leading-relaxed">
                Regenerate the entire article body using updated title & keywords while maintaining the exact same URL (
                <strong className="text-purple-950">/{slug}</strong>).
              </p>

              {/* Skip Images Toggle */}
              <div className="flex items-center justify-between mb-3 rounded-xl border border-purple-100 bg-white/80 p-2.5">
                <div className="flex items-center gap-2">
                  {skipImages ? <ImageOff className="h-4 w-4 text-amber-600" /> : <ImageIcon className="h-4 w-4 text-purple-600" />}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-neutral-800">Skip Images in Regeneration</span>
                    <span className="text-[10px] text-neutral-500">Do not generate visual placeholders</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSkipImages(!skipImages)}
                  disabled={isRegenerating}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    skipImages ? "bg-amber-600" : "bg-neutral-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      skipImages ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Regenerate Button */}
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition disabled:opacity-50"
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Regenerating Article with AI (Preserving URL)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Regenerate Article Body</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* MARKDOWN EDITOR TOOLBAR */}
          <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-2 shrink-0 flex-wrap gap-1">
            <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Markdown Content</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertMarkdown("## ")}
                className="rounded px-2 py-0.5 text-xs font-bold text-neutral-600 hover:bg-neutral-200"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("### ")}
                className="rounded px-2 py-0.5 text-xs font-bold text-neutral-600 hover:bg-neutral-200"
                title="Heading 3"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("**", "**")}
                className="rounded px-2 py-0.5 text-xs font-bold text-neutral-600 hover:bg-neutral-200"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("*", "*")}
                className="rounded px-2 py-0.5 text-xs italic font-bold text-neutral-600 hover:bg-neutral-200"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("\n- ")}
                className="rounded px-2 py-0.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
                title="Bullet List"
              >
                List
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("\n> ")}
                className="rounded px-2 py-0.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
                title="Quote"
              >
                Quote
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("[Link Text](", ")")}
                className="rounded px-2 py-0.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
                title="Insert Link"
              >
                Link
              </button>
            </div>
          </div>

          {/* TEXTAREA EDITOR */}
          <div className="flex-1 p-4">
            <textarea
              id="markdown-editor"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Write your article markdown here..."
              className="w-full h-full min-h-[400px] resize-none font-mono text-xs text-neutral-900 leading-relaxed outline-none border-0 focus:ring-0"
            />
          </div>
        </div>

        {/* RIGHT PANE: Live Publication Preview */}
        <div className="w-full lg:w-1/2 flex flex-col bg-neutral-200/50 overflow-hidden">
          {/* PREVIEW TOOLBAR */}
          <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2 shrink-0">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-neutral-800">Live Website Preview</span>
            </div>

            {/* Viewport switchers */}
            <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded-md transition ${previewDevice === "desktop" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-400 hover:text-neutral-700"}`}
                title="Desktop View"
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice("tablet")}
                className={`p-1.5 rounded-md transition ${previewDevice === "tablet" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-400 hover:text-neutral-700"}`}
                title="Tablet View"
              >
                <Tablet className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded-md transition ${previewDevice === "mobile" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-400 hover:text-neutral-700"}`}
                title="Mobile View"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* PREVIEW CONTAINER */}
          <div className="flex-1 overflow-y-auto p-4 flex justify-center">
            <div
              className={`bg-white rounded-2xl shadow-md border border-neutral-200/80 overflow-hidden transition-all duration-300 flex flex-col ${
                previewDevice === "mobile"
                  ? "w-[375px]"
                  : previewDevice === "tablet"
                  ? "w-[768px]"
                  : "w-full max-w-3xl"
              }`}
            >
              {/* BROWSER CHROME MOCKUP */}
              <div className="bg-neutral-100 border-b border-neutral-200 px-4 py-2 flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 rounded-md bg-white border border-neutral-200/70 px-3 py-0.5 text-[10px] text-neutral-500 font-mono truncate text-center">
                  https://bedbugstreatment.co.in/{slug}
                </div>
              </div>

              {/* ARTICLE BODY */}
              <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
                {/* Category */}
                <div className="flex items-center gap-2 mb-3 text-xs text-neutral-500">
                  <span className="font-bold text-emerald-600 uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    Bed Bug Guide
                  </span>
                </div>

                {/* Main Heading - Rich Green Headline */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tracking-tight leading-tight mb-4">
                  {title}
                </h1>

                {/* Featured Image */}
                {imageUrl && (
                  <div className="mb-8 flex justify-center">
                    <div className="w-full max-w-xl aspect-[3/2] rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Markdown Rendered Content with Green Headings and Styled Tables */}
                <article className="prose prose-neutral max-w-none prose-headings:font-bold prose-headings:text-emerald-800 prose-h1:text-emerald-900 prose-h2:text-emerald-800 prose-h3:text-emerald-700 prose-h4:text-emerald-700 prose-headings:tracking-tight prose-p:text-neutral-700 prose-p:leading-relaxed prose-li:text-neutral-700 prose-a:text-emerald-600 prose-a:underline hover:prose-a:text-emerald-700 prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50/40 prose-blockquote:p-4 prose-blockquote:rounded-r-xl text-xs sm:text-sm prose-img:rounded-xl prose-img:border prose-img:border-neutral-200 prose-img:shadow-sm prose-img:max-w-xl prose-img:mx-auto prose-img:aspect-[3/2] prose-img:object-cover prose-img:object-top">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-900 mt-6 mb-3 tracking-tight" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-lg sm:text-xl font-bold text-emerald-800 mt-7 mb-3 tracking-tight border-b border-emerald-100 pb-2" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-base sm:text-lg font-bold text-emerald-700 mt-5 mb-2 tracking-tight" {...props} />
                      ),
                      h4: ({ node, ...props }) => (
                        <h4 className="text-sm font-bold text-emerald-700 mt-4 mb-2" {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <div className="not-prose my-6 overflow-hidden rounded-xl border border-emerald-200/90 bg-white shadow-xs">
                          <div className="overflow-x-auto">
                            <table className="!m-0 w-full min-w-full border-collapse divide-y divide-emerald-200 text-left text-xs" {...props} />
                          </div>
                        </div>
                      ),
                      thead: ({ node, ...props }) => (
                        <thead className="m-0 p-0 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 font-bold text-emerald-950 border-b border-emerald-200" {...props} />
                      ),
                      th: ({ node, ...props }) => (
                        <th className="px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-emerald-950 border-r last:border-r-0 border-emerald-200/60 bg-emerald-50/80" {...props} />
                      ),
                      tbody: ({ node, ...props }) => (
                        <tbody className="divide-y divide-neutral-100 bg-white" {...props} />
                      ),
                      tr: ({ node, ...props }) => (
                        <tr className="transition-colors hover:bg-emerald-50/40 even:bg-neutral-50/50" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="px-3.5 py-2.5 text-neutral-700 align-top leading-relaxed border-r last:border-r-0 border-neutral-100 text-xs" {...props} />
                      ),
                    }}
                  >
                    {markdown.replace(/^\s*#\s+[^\n]+(?:\r?\n)+/, "")}
                  </ReactMarkdown>
                </article>

                {/* BOTTOM CTA BANNER */}
                <div className="mt-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-lg">
                  <h3 className="text-lg font-bold mb-2">Need Professional Bed Bug Treatment?</h3>
                  <p className="text-xs text-emerald-100 mb-4 leading-relaxed">
                    BedBugsTreatment.co.in provides same-day inspections and 100% odorless, warranty-backed treatments across India.
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <a
                      href="tel:+919769321234"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-emerald-800 shadow-sm hover:bg-neutral-50 transition"
                    >
                      <PhoneCall className="h-3.5 w-3.5" /> Call +91 97693 21234
                    </a>
                    <span className="text-xs text-emerald-100 font-medium">Free On-site Inspection Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
