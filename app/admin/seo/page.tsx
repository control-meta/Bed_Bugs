"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Check,
  ChevronRight,
  Database,
  ExternalLink,
  Eye,
  FileSearch,
  Globe,
  ImageIcon,
  Info,
  Layers,
  LayoutGrid,
  List,
  Loader2,
  RefreshCw,
  Save,
  Search,
  SearchCheck,
  Sparkles,
  X,
} from "lucide-react";
import type { PageSeoItem, ImageSeoItem } from "@/lib/seo-db";

export default function GlobalSeoAdminPage() {
  const [activeTab, setActiveTab] = useState<"pages" | "images">("pages");
  const [loading, setLoading] = useState(true);
  const [isSupabase, setIsSupabase] = useState<boolean | null>(null);

  // Pages SEO state
  const [pages, setPages] = useState<PageSeoItem[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("/");
  const [pageSearchQuery, setPageSearchQuery] = useState("");
  const [pageFilterType, setPageFilterType] = useState<"all" | "core" | "locations">("all");
  const [editingPage, setEditingPage] = useState<PageSeoItem | null>(null);
  const [keywordsInput, setKeywordsInput] = useState<string>("");
  const [savingPage, setSavingPage] = useState(false);
  const [serpDevice, setSerpDevice] = useState<"desktop" | "mobile">("desktop");

  // Images Alt text state
  const [images, setImages] = useState<ImageSeoItem[]>([]);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageCategoryFilter, setImageCategoryFilter] = useState<"all" | "cities" | "services" | "general">("all");
  const [imageAltDrafts, setImageAltDrafts] = useState<Record<string, string>>({});
  const [savingImageId, setSavingImageId] = useState<string | null>(null);
  const [savingAllImages, setSavingAllImages] = useState(false);
  const [scanningImages, setScanningImages] = useState(false);
  const [imageViewMode, setImageViewMode] = useState<"grid" | "list">("grid");

  // Notification banners
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/seo");
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load SEO data");
      }

      setPages(json.pages || []);
      setImages(json.images || []);
      if (typeof json.isSupabase === "boolean") {
        setIsSupabase(json.isSupabase);
      }

      // Initialize drafts for images
      const drafts: Record<string, string> = {};
      for (const img of json.images || []) {
        drafts[img.src] = img.altText || "";
      }
      setImageAltDrafts(drafts);

      // Select initial page
      if (json.pages && json.pages.length > 0) {
        const initial = json.pages.find((p: PageSeoItem) => p.path === "/") || json.pages[0];
        setSelectedPath(initial.path);
        setEditingPage(JSON.parse(JSON.stringify(initial)));
        setKeywordsInput((initial.keywords || []).join(", "));
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error loading SEO data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync editing page when selected path changes
  useEffect(() => {
    const found = pages.find((p) => p.path === selectedPath);
    if (found) {
      setEditingPage(JSON.parse(JSON.stringify(found)));
      setKeywordsInput((found.keywords || []).join(", "));
    }
  }, [selectedPath, pages]);

  // Handle typing keywords with natural commas
  const handleKeywordsChange = (val: string) => {
    setKeywordsInput(val);
    if (editingPage) {
      const parsed = val
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      setEditingPage({
        ...editingPage,
        keywords: parsed,
      });
    }
  };

  // Remove a single keyword tag
  const handleRemoveKeyword = (indexToRemove: number) => {
    if (!editingPage) return;
    const remaining = (editingPage.keywords || []).filter((_, i) => i !== indexToRemove);
    setEditingPage({
      ...editingPage,
      keywords: remaining,
    });
    setKeywordsInput(remaining.join(", "));
  };

  // Save specific page SEO metadata
  const handleSavePageSeo = async () => {
    if (!editingPage) return;
    setSavingPage(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const finalKeywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const payloadPage = {
      ...editingPage,
      keywords: finalKeywords,
    };

    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "page", page: payloadPage }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save page SEO");
      }

      // Update pages list
      setPages((prev) =>
        prev.map((p) => (p.path === payloadPage.path ? json.page : p))
      );
      setEditingPage(json.page);
      setKeywordsInput((json.page.keywords || []).join(", "));
      setSuccessMessage(`Saved SEO metadata for ${editingPage.pageName || editingPage.path}! It will now reflect in HTML source.`);

      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save page SEO");
    } finally {
      setSavingPage(false);
    }
  };

  // Save single image Alt text
  const handleSaveImageAlt = async (img: ImageSeoItem) => {
    const draftText = imageAltDrafts[img.src] ?? img.altText;
    setSavingImageId(img.src);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const payload: ImageSeoItem = {
        ...img,
        altText: draftText,
      };

      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "image", image: payload }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save image Alt text");
      }

      setImages((prev) =>
        prev.map((i) => (i.src === img.src ? json.image : i))
      );
      setSuccessMessage(`Updated Alt text for ${img.src}`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save Alt text");
    } finally {
      setSavingImageId(null);
    }
  };

  // Bulk save all changed images Alt text
  const handleBulkSaveImages = async () => {
    setSavingAllImages(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const itemsToSave: ImageSeoItem[] = images.map((img) => ({
        ...img,
        altText: imageAltDrafts[img.src] ?? img.altText,
      }));

      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bulk_images", images: itemsToSave }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to bulk save images");
      }

      setImages(itemsToSave);
      setSuccessMessage(`Successfully saved Alt text for all ${itemsToSave.length} images!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save all images");
    } finally {
      setSavingAllImages(false);
    }
  };

  // Scan website and public directory for newly added images
  const handleScanImages = async () => {
    setScanningImages(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/seo/scan", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to scan images");
      }

      if (json.images) {
        setImages(json.images);
        const drafts: Record<string, string> = {};
        for (const img of json.images) {
          drafts[img.src] = img.altText || "";
        }
        setImageAltDrafts(drafts);
      }

      setSuccessMessage(
        json.added > 0
          ? `Scan complete! Discovered and added ${json.added} new image(s) to registry.`
          : `Scan complete! All ${json.total} website images are up-to-date in registry.`
      );
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to scan images");
    } finally {
      setScanningImages(false);
    }
  };

  // Filter pages
  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.path.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
      page.pageName.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
      page.title.toLowerCase().includes(pageSearchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (pageFilterType === "core") {
      return ["/", "/about", "/services", "/contact", "/faq", "/blog"].includes(page.path);
    }
    if (pageFilterType === "locations") {
      return !["/", "/about", "/services", "/contact", "/faq", "/blog"].includes(page.path);
    }
    return true;
  });

  // Filter images
  const filteredImages = images.filter((img) => {
    const matchesSearch =
      img.src.toLowerCase().includes(imageSearchQuery.toLowerCase()) ||
      img.altText.toLowerCase().includes(imageSearchQuery.toLowerCase()) ||
      img.locationHint.toLowerCase().includes(imageSearchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (imageCategoryFilter === "cities") return img.src.includes("/cities/");
    if (imageCategoryFilter === "services") return img.src.includes("/services");
    if (imageCategoryFilter === "general") return !img.src.includes("/cities/") && !img.src.includes("/services");
    return true;
  });

  // Helper character length indicators
  const titleLen = editingPage?.title?.length || 0;
  const descLen = editingPage?.description?.length || 0;

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-neutral-100 font-sans text-neutral-900 min-h-0">
      {/* 1. Header Studio Bar */}
      <header className="z-30 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white px-5 py-3 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-700/20">
            <SearchCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-neutral-900">
                Global SEO &amp; Metadata
              </h1>
              {isSupabase !== null && (
                <span
                  className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                    isSupabase
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  <Database className="h-2.5 w-2.5" />
                  <span>{isSupabase ? "Supabase DB" : "Local Store"}</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-500">
              Live meta title &amp; description editor and site-wide image Alt text registry
            </p>
          </div>
        </div>

        {/* Tab Switcher & Global Actions */}
        <div className="flex items-center gap-2.5">
          <div className="flex rounded-xl bg-neutral-100 p-1 border border-neutral-200">
            <button
              onClick={() => setActiveTab("pages")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "pages"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Pages SEO ({pages.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeTab === "images"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Image Alt Texts ({images.length})</span>
            </button>
          </div>

          {activeTab === "images" && (
            <>
              <button
                onClick={handleScanImages}
                disabled={scanningImages}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 disabled:opacity-50 transition"
                title="Scan public directory for newly added images"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${scanningImages ? "animate-spin text-emerald-600" : ""}`} />
                <span className="hidden md:inline">Scan Images</span>
              </button>

              <button
                onClick={handleBulkSaveImages}
                disabled={savingAllImages}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {savingAllImages ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>Save All Alt Texts</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Notifications */}
      {successMessage && (
        <div className="z-30 flex items-center justify-between gap-2 bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-md">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)}>
            <X className="h-3.5 w-3.5 text-white/80 hover:text-white" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="z-30 flex items-center justify-between gap-2 bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-md">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)}>
            <X className="h-3.5 w-3.5 text-white/80 hover:text-white" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex h-96 w-full flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm font-semibold text-neutral-600">Loading Global SEO &amp; Alt Text Registry...</p>
          </div>
        ) : activeTab === "pages" ? (
          /* ==================================================================== */
          /* TAB 1: PAGES SEO & METADATA                                          */
          /* ==================================================================== */
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Left Sidebar: Pages Explorer List */}
            <aside className="w-80 sm:w-96 border-r border-neutral-200 bg-white flex flex-col shrink-0 min-h-0">
              {/* Search & Filter Bar */}
              <div className="p-3 border-b border-neutral-100 space-y-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search routes or pages..."
                    value={pageSearchQuery}
                    onChange={(e) => setPageSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-1.5 pl-8 pr-3 text-xs font-medium text-neutral-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 text-[11px] font-semibold">
                  <button
                    onClick={() => setPageFilterType("all")}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      pageFilterType === "all"
                        ? "bg-emerald-50 text-emerald-800 font-bold"
                        : "text-neutral-500 hover:bg-neutral-100"
                    }`}
                  >
                    All ({pages.length})
                  </button>
                  <button
                    onClick={() => setPageFilterType("core")}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      pageFilterType === "core"
                        ? "bg-emerald-50 text-emerald-800 font-bold"
                        : "text-neutral-500 hover:bg-neutral-100"
                    }`}
                  >
                    Core (6)
                  </button>
                  <button
                    onClick={() => setPageFilterType("locations")}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      pageFilterType === "locations"
                        ? "bg-emerald-50 text-emerald-800 font-bold"
                        : "text-neutral-500 hover:bg-neutral-100"
                    }`}
                  >
                    Cities ({pages.length - 6})
                  </button>
                </div>
              </div>

              {/* Pages Scrollable List */}
              <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
                {filteredPages.map((page) => {
                  const isSelected = page.path === selectedPath;
                  return (
                    <button
                      key={page.path}
                      onClick={() => setSelectedPath(page.path)}
                      className={`w-full text-left p-3 transition flex items-start justify-between gap-2 ${
                        isSelected
                          ? "bg-emerald-50/70 border-l-4 border-emerald-600"
                          : "hover:bg-neutral-50 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 truncate">
                            {page.pageName}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-700 block truncate">
                          {page.path}
                        </span>
                        <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                          {page.title}
                        </p>
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 mt-1 transition ${isSelected ? "text-emerald-600" : "text-neutral-300"}`} />
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right Editor: Meta Editor & Google SERP Simulator */}
            <section className="flex-1 overflow-y-auto bg-[#fafafa] p-4 md:p-6 min-h-0">
              {editingPage ? (
                <div className="max-w-4xl mx-auto space-y-5">
                  {/* Active Page Header Card */}
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-neutral-900">
                          {editingPage.pageName}
                        </h2>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-mono font-bold text-emerald-800 border border-emerald-200">
                          {editingPage.path}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Changes will immediately reflect in the HTML source code when crawled or inspected in browser.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={editingPage.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition"
                      >
                        <span>View Page</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <button
                        onClick={handleSavePageSeo}
                        disabled={savingPage}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition"
                      >
                        {savingPage ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="h-3.5 w-3.5" />
                        )}
                        <span>Save Page SEO</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Live Google SERP Simulator */}
                  <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 md:p-5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-600" />
                        <h3 className="text-xs font-bold text-neutral-800">
                          Google Search Result Live Preview (SERP Snippet)
                        </h3>
                      </div>

                    </div>

                    {/* Google Simulator Card */}
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 font-sans">
                      <div className="flex items-center gap-2 text-xs text-[#202124] mb-1">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white border border-neutral-200 text-emerald-600 font-bold text-[10px]">
                          BB
                        </div>
                        <div className="leading-tight">
                          <span className="font-medium text-[12px] text-neutral-800">BedBug Treatment</span>
                          <span className="text-[11px] text-[#4d5156] block">
                            https://bedbugstreatment.co.in{editingPage.path === "/" ? "" : editingPage.path}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-[17px] sm:text-[19px] font-normal text-[#1a0dab] hover:underline cursor-pointer leading-tight mb-1">
                        {editingPage.title || "Untitled Page"}
                      </h4>

                      <p className="text-[13px] text-[#4d5156] leading-relaxed max-w-2xl">
                        {editingPage.description || "No description provided yet."}
                      </p>
                    </div>
                  </div>

                  {/* 2. Meta Title Input */}
                  <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-neutral-800">
                          Meta Title Tag (<code className="text-emerald-700 font-mono">&lt;title&gt;</code>)
                        </label>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className={`font-mono font-bold ${titleLen >= 45 && titleLen <= 65 ? "text-emerald-600" : titleLen > 65 ? "text-amber-600" : "text-neutral-500"}`}>
                            {titleLen} / 60 characters
                          </span>
                          <span className="text-neutral-400">|</span>
                          <span className="text-neutral-500 text-[10px]">Recommended: 50-60 chars</span>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={editingPage.title}
                        onChange={(e) =>
                          setEditingPage({ ...editingPage, title: e.target.value })
                        }
                        placeholder="Enter compelling meta title with primary keyword..."
                        className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs font-semibold text-neutral-900 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      {/* Character length indicator bar */}
                      <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden mt-1.5">
                        <div
                          style={{ width: `${Math.min(100, (titleLen / 60) * 100)}%` }}
                          className={`h-full transition-all duration-300 ${
                            titleLen >= 45 && titleLen <= 65
                              ? "bg-emerald-500"
                              : titleLen > 65
                              ? "bg-amber-500"
                              : "bg-blue-400"
                          }`}
                        />
                      </div>
                    </div>

                    {/* 3. Meta Description Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-neutral-800">
                          Meta Description Tag (<code className="text-emerald-700 font-mono">&lt;meta name="description"&gt;</code>)
                        </label>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className={`font-mono font-bold ${descLen >= 120 && descLen <= 165 ? "text-emerald-600" : descLen > 165 ? "text-amber-600" : "text-neutral-500"}`}>
                            {descLen} / 160 characters
                          </span>
                          <span className="text-neutral-400">|</span>
                          <span className="text-neutral-500 text-[10px]">Recommended: 140-160 chars</span>
                        </div>
                      </div>
                      <textarea
                        rows={3}
                        value={editingPage.description}
                        onChange={(e) =>
                          setEditingPage({ ...editingPage, description: e.target.value })
                        }
                        placeholder="Enter concise, informative meta description with call to action..."
                        className="w-full rounded-xl border border-neutral-300 p-3 text-xs text-neutral-900 leading-relaxed shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      {/* Character length indicator bar */}
                      <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden mt-1.5">
                        <div
                          style={{ width: `${Math.min(100, (descLen / 160) * 100)}%` }}
                          className={`h-full transition-all duration-300 ${
                            descLen >= 120 && descLen <= 165
                              ? "bg-emerald-500"
                              : descLen > 165
                              ? "bg-amber-500"
                              : "bg-blue-400"
                          }`}
                        />
                      </div>
                    </div>

                    {/* 4. Target Keywords Tag Editor */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-neutral-800 block">
                          SEO Target Keywords (Comma Separated)
                        </label>
                        <span className="text-[10.5px] font-medium text-neutral-500">
                          {(editingPage.keywords || []).length} keyword{(editingPage.keywords || []).length === 1 ? "" : "s"}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={keywordsInput}
                        onChange={(e) => handleKeywordsChange(e.target.value)}
                        placeholder="bed bug treatment, bed bug control, odorless pest spray..."
                        className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs font-medium text-neutral-800 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Type keywords separated by commas (e.g. bed bug treatment, pest control pune).
                      </p>
                      {/* Keyword pills */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(editingPage.keywords || []).map((kw, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-md bg-neutral-100 border border-neutral-200 pl-2 pr-1 py-0.5 text-[10.5px] font-medium text-neutral-700"
                          >
                            <span>#{kw}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveKeyword(i)}
                              className="text-neutral-400 hover:text-rose-600 rounded p-0.5 hover:bg-neutral-200 transition"
                              title={`Remove #${kw}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSavePageSeo}
                        disabled={savingPage}
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition"
                      >
                        {savingPage ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Saving &amp; Updating Source...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-3.5 w-3.5" />
                            <span>Save Page SEO</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-96 flex-col items-center justify-center text-neutral-400">
                  <p>Select a page from the left to edit its SEO metadata.</p>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* ==================================================================== */
          /* TAB 2: IMAGE PREVIEWS & ALT TEXT MANAGER                             */
          /* ==================================================================== */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-neutral-50 p-4 md:p-6 space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs shrink-0">
              {/* Search and Filters */}
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by filename, location, or alt text..."
                    value={imageSearchQuery}
                    onChange={(e) => setImageSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-1.5 pl-8 pr-3 text-xs font-medium text-neutral-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold">
                  <button
                    onClick={() => setImageCategoryFilter("all")}
                    className={`rounded-lg px-2.5 py-1 transition ${imageCategoryFilter === "all" ? "bg-emerald-50 text-emerald-800 font-bold" : "text-neutral-500 hover:bg-neutral-100"}`}
                  >
                    All ({images.length})
                  </button>
                  <button
                    onClick={() => setImageCategoryFilter("cities")}
                    className={`rounded-lg px-2.5 py-1 transition ${imageCategoryFilter === "cities" ? "bg-emerald-50 text-emerald-800 font-bold" : "text-neutral-500 hover:bg-neutral-100"}`}
                  >
                    City Cards
                  </button>
                  <button
                    onClick={() => setImageCategoryFilter("services")}
                    className={`rounded-lg px-2.5 py-1 transition ${imageCategoryFilter === "services" ? "bg-emerald-50 text-emerald-800 font-bold" : "text-neutral-500 hover:bg-neutral-100"}`}
                  >
                    Services
                  </button>
                  <button
                    onClick={() => setImageCategoryFilter("general")}
                    className={`rounded-lg px-2.5 py-1 transition ${imageCategoryFilter === "general" ? "bg-emerald-50 text-emerald-800 font-bold" : "text-neutral-500 hover:bg-neutral-100"}`}
                  >
                    Site Banners
                  </button>
                </div>
              </div>

              {/* View Mode & Actions */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
                  <button
                    onClick={() => setImageViewMode("grid")}
                    className={`p-1 rounded ${imageViewMode === "grid" ? "bg-white text-emerald-700 shadow-xs" : "text-neutral-400"}`}
                    title="Grid view"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setImageViewMode("list")}
                    className={`p-1 rounded ${imageViewMode === "list" ? "bg-white text-emerald-700 shadow-xs" : "text-neutral-400"}`}
                    title="List view"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleBulkSaveImages}
                  disabled={savingAllImages}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  {savingAllImages ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>

            {/* Images List / Grid */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredImages.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-neutral-400">
                  <ImageIcon className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-xs">No images matched your filter criteria.</p>
                </div>
              ) : imageViewMode === "grid" ? (
                /* GRID VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                  {filteredImages.map((img) => {
                    const draftVal = imageAltDrafts[img.src] ?? img.altText;
                    const isSaving = savingImageId === img.src;
                    const hasChanged = draftVal !== img.altText;

                    return (
                      <div
                        key={img.src}
                        className={`rounded-2xl border bg-white p-4 shadow-xs transition flex flex-col justify-between space-y-3 ${
                          hasChanged ? "border-emerald-400 ring-1 ring-emerald-400/30" : "border-neutral-200"
                        }`}
                      >
                        {/* Image Preview Thumbnail Header */}
                        <div className="flex items-start gap-3">
                          <div className="relative h-20 w-24 rounded-xl border border-neutral-200 overflow-hidden bg-neutral-100 shrink-0">
                            <Image
                              src={img.src}
                              alt={draftVal || "Preview"}
                              fill
                              className="object-cover"
                              sizes="100px"
                              unoptimized={img.src.endsWith(".svg")}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 inline-block truncate max-w-full">
                              {img.locationHint}
                            </span>
                            <h4 className="text-xs font-mono font-bold text-neutral-900 truncate mt-1" title={img.src}>
                              {img.src}
                            </h4>
                            {img.pages && img.pages.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {img.pages.map((p, idx) => (
                                  <span key={idx} className="text-[9.5px] text-neutral-400 font-mono">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Alt Text Input Area */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-neutral-700">
                              Image Alt Text:
                            </label>
                            <span className={`text-[10px] font-mono ${draftVal.length > 10 ? "text-emerald-600 font-bold" : "text-neutral-400"}`}>
                              {draftVal.length} chars
                            </span>
                          </div>
                          <textarea
                            rows={2}
                            value={draftVal}
                            onChange={(e) =>
                              setImageAltDrafts({
                                ...imageAltDrafts,
                                [img.src]: e.target.value,
                              })
                            }
                            placeholder="Describe image clearly for SEO and accessibility..."
                            className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-900 leading-relaxed shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        {/* Card Action Footer */}
                        <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                          <span className="text-[10px] text-neutral-400">
                            {hasChanged ? (
                              <span className="text-amber-600 font-semibold">• Unsaved edit</span>
                            ) : (
                              <span className="text-emerald-600 font-semibold">✓ Active on site</span>
                            )}
                          </span>

                          <button
                            onClick={() => handleSaveImageAlt(img)}
                            disabled={isSaving || !hasChanged}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-40 transition"
                          >
                            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            <span>Save Alt</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* LIST VIEW */
                <div className="rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden divide-y divide-neutral-100">
                  {filteredImages.map((img) => {
                    const draftVal = imageAltDrafts[img.src] ?? img.altText;
                    const isSaving = savingImageId === img.src;
                    const hasChanged = draftVal !== img.altText;

                    return (
                      <div key={img.src} className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50/70 transition">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative h-14 w-16 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-100 shrink-0">
                            <Image
                              src={img.src}
                              alt={draftVal || "Preview"}
                              fill
                              className="object-cover"
                              sizes="64px"
                              unoptimized={img.src.endsWith(".svg")}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                {img.locationHint}
                              </span>
                              <span className="text-xs font-mono font-bold text-neutral-800 truncate" title={img.src}>
                                {img.src}
                              </span>
                            </div>

                            <input
                              type="text"
                              value={draftVal}
                              onChange={(e) =>
                                setImageAltDrafts({
                                  ...imageAltDrafts,
                                  [img.src]: e.target.value,
                                })
                              }
                              placeholder="Enter image alt text..."
                              className="mt-1.5 w-full rounded-lg border border-neutral-300 px-2.5 py-1 text-xs text-neutral-900 focus:border-emerald-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 max-sm:w-full max-sm:justify-end">
                          <button
                            onClick={() => handleSaveImageAlt(img)}
                            disabled={isSaving || !hasChanged}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-40 transition"
                          >
                            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            <span>Save</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
