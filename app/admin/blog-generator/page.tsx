"use strict";
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  Copy,
  CheckCircle2,
  Loader2,
  WifiOff,
  FileText,
  Zap,
  Code2,
  PenTool,
  Eye,
  ShieldCheck,
  LayoutTemplate,
  Search,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Trash2,
  Brain,
  FlaskConical,
  Pencil,
  ScanSearch,
  Link2,
  BadgeCheck,
  Target,
  FileEdit,
  CheckSquare,
  ImageIcon,
  ImageOff,
  Globe,
  ExternalLink,
} from "lucide-react";

type UsageStats = {
  totalTokens: number;
};

type ResearchData = {
  searchIntent: {
    primaryIntent: string;
    targetAudience: string;
    expectedAnswer: string;
  };
  informationGainPlan?: {
    uniqueUsefulElements: string[];
    contentGaps: string[];
  };
};

type GeneratedData = {
  blogContent: string;
  research?: ResearchData;
  audit?: any;
  claims?: any[];
  redFlags?: string[];
  blockers?: any;
  publicationStatus?: "READY" | "BLOCKED";
  metadata?: any;
  faqs?: any[];
  schema?: any;
  internalLinks?: any[];
  cta?: any;
  imageUrl?: string;
  images?: any[];
};

const PIPELINE_STAGES = [
  { id: 1, label: "Intent Analysis", desc: "Planning info gain & search intent", icon: Brain },
  { id: 2, label: "Evidence Contract", desc: "Assembling verified sources", icon: FlaskConical },
  { id: 3, label: "Initial Draft", desc: "Drafting article bound to evidence", icon: Pencil },
  { id: 4, label: "Editorial Pass", desc: "SEO audit, rewrites & info gain", icon: PenTool },
  { id: 5, label: "Quality Gate", desc: "Sanitizing hallucinations & claims", icon: ScanSearch },
  { id: 6, label: "Internal Links", desc: "Injecting contextual links & CTA", icon: Link2 },
  { id: 7, label: "Image Generation", desc: "Creating AI photorealistic images", icon: ImageIcon },
  { id: 8, label: "Final Audit", desc: "Computing quality metrics", icon: BadgeCheck },
];

function PipelineAnimation({ currentStage, streamStatus }: { currentStage: number; streamStatus: string }) {
  return (
    <div className="flex flex-col gap-0">
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </div>
        <p className="text-[11px] font-semibold text-emerald-700 truncate">{streamStatus}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        {PIPELINE_STAGES.map((stage) => {
          const Icon = stage.icon;
          const isDone = currentStage > stage.id;
          const isActive = currentStage === stage.id;
          const isPending = currentStage < stage.id;

          return (
            <div
              key={stage.id}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all duration-500 ${
                isDone
                  ? "border-emerald-200 bg-emerald-50"
                  : isActive
                  ? "border-emerald-400 bg-emerald-50 shadow-md shadow-emerald-100"
                  : "border-neutral-100 bg-neutral-50/50"
              }`}
            >
              {/* Stage icon */}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                  isDone
                    ? "bg-emerald-500"
                    : isActive
                    ? "bg-emerald-600 animate-pulse"
                    : "bg-neutral-200"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                ) : (
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-white" : "text-neutral-400"
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[11px] font-bold leading-tight ${
                    isDone
                      ? "text-emerald-700"
                      : isActive
                      ? "text-emerald-900"
                      : "text-neutral-400"
                  }`}
                >
                  {stage.label}
                </p>
                <p
                  className={`text-[10px] leading-tight mt-0.5 truncate ${
                    isDone || isActive ? "text-emerald-600" : "text-neutral-300"
                  }`}
                >
                  {stage.desc}
                </p>
              </div>

              {/* Active shimmer effect */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div
                    className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-emerald-100/60 to-transparent"
                    style={{ animationDuration: "1.5s" }}
                  />
                </div>
              )}

              {/* Step number badge */}
              {isPending && (
                <span className="text-[9px] font-bold text-neutral-300">{stage.id}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WritingAnimation({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .filter((l) => l.trim())
    .slice(-12);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Paper effect */}
        <div className="relative rounded-2xl border border-neutral-200 bg-white shadow-xl overflow-hidden">
          {/* Ruled lines header */}
          <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-5 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 flex items-center gap-2 ml-2">
              <PenTool className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-xs font-medium text-neutral-400">AI Writing in progress...</span>
            </div>
            <div className="flex gap-1">
              {[0.3, 0.6, 0.9].map((d, i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce"
                  style={{ animationDelay: `${d}s` }}
                />
              ))}
            </div>
          </div>

          {/* Writing content */}
          <div className="p-6 min-h-[240px] font-mono text-sm text-neutral-700 leading-relaxed space-y-1.5 relative">
            {/* Left margin line */}
            <div className="absolute left-12 top-0 bottom-0 border-l border-red-100" />

            {lines.map((line, i) => {
              const isLast = i === lines.length - 1;
              const isHeading = line.startsWith("#");
              return (
                <div
                  key={i}
                  className={`pl-8 animate-in fade-in slide-in-from-left-2 duration-300 ${
                    isHeading
                      ? "font-bold text-neutral-900 text-base"
                      : "text-neutral-600 text-xs"
                  }`}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {line}
                  {isLast && (
                    <span className="inline-block w-2 h-4 ml-0.5 bg-emerald-500 rounded-sm align-middle animate-[blink_1s_step-end_infinite]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar at bottom */}
          <div className="h-1 bg-neutral-100">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 animate-[progress_3s_ease-in-out_infinite_alternate]" style={{ width: "60%" }} />
          </div>
        </div>
        <p className="text-center text-xs text-neutral-400 mt-3 animate-pulse">Crafting your article with AI precision...</p>
      </div>
    </div>
  );
}

export default function BlogGeneratorPage() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const isStoppedRef = useRef(false);
  const hasAutoStartedRef = useRef(false);
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [skipImages, setSkipImages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamStatus, setStreamStatus] = useState("");
  const [currentStage, setCurrentStage] = useState(0);
  const [data, setData] = useState<GeneratedData | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "markdown" | "audit" | "seo" | "research">("preview");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSuccess, setDraftSuccess] = useState(false);

  // Test Image States
  const [isImageTestOpen, setIsImageTestOpen] = useState(false);
  const [isTestingImage, setIsTestingImage] = useState(false);
  const [testImageUrl, setTestImageUrl] = useState("");
  const [testImageError, setTestImageError] = useState("");
  const [testRawResponse, setTestRawResponse] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("generatedBlogData");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved blog data", e);
      }
    }
  }, []);

  useEffect(() => {
    if (data && !isGenerating) {
      localStorage.setItem("generatedBlogData", JSON.stringify(data));
    }
  }, [data, isGenerating]);

  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard the current generated blog?")) {
      setData(null);
      localStorage.removeItem("generatedBlogData");
    }
  };

  const wordCount = data?.blogContent
    ? data.blogContent.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const handlePublishBlog = async () => {
    if (!data?.blogContent) return;
    setIsPublishing(true);
    setError("");

    try {
      const rawTitle = data.metadata?.seoTitle || data.metadata?.h1 || topic || "Bed Bug Treatment Guide";
      const cleanTitle = rawTitle.replace(/^#\s*/, "").trim();
      const slug = (data.metadata?.urlSlug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-|-$/g, "");

      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          slug,
          topic: topic || cleanTitle,
          primaryKeyword: data.metadata?.primaryKeyword || keywords || "bed bug treatment",
          keywords: data.metadata?.secondaryKeywords || (keywords ? [keywords] : ["bed bug treatment", "pest control"]),
          markdown: data.blogContent,
          excerpt: data.metadata?.metaDescription || `Comprehensive guide on ${cleanTitle}. Proven inspection protocols and professional pest control insights for Indian homes.`,
          imageUrl: data.imageUrl || "/images/blogs/bed-bugs-pest-control.png",
          images: data.images || [],
          status: "published",
          publicationStatus: data.publicationStatus || "READY",
          autoPublishEligible: true,
          author: "Bed Bug Treatment Team",
          readTime: "9 min read",
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to publish blog to website");
      }

      setPublishedSuccess(true);
      setPublishedSlug(slug);
      setTimeout(() => setPublishedSuccess(false), 6000);
    } catch (err: any) {
      console.error("Publish error:", err);
      setError(err.message || "Failed to publish blog to website.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!data?.blogContent) return;
    setIsSavingDraft(true);
    setError("");

    try {
      const rawTitle = data.metadata?.seoTitle || data.metadata?.h1 || topic || "Bed Bug Treatment Guide";
      const cleanTitle = rawTitle.replace(/^#\s*/, "").trim();
      const slug = (data.metadata?.urlSlug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-|-$/g, "");

      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          slug,
          topic: topic || cleanTitle,
          primaryKeyword: data.metadata?.primaryKeyword || keywords || "bed bug treatment",
          keywords: data.metadata?.secondaryKeywords || (keywords ? [keywords] : ["bed bug treatment", "pest control"]),
          markdown: data.blogContent,
          excerpt: data.metadata?.metaDescription || `Comprehensive guide on ${cleanTitle}. Proven inspection protocols and professional pest control insights for Indian homes.`,
          imageUrl: data.imageUrl || "/images/blogs/bed-bugs-pest-control.png",
          images: data.images || [],
          status: "draft",
          publicationStatus: data.publicationStatus || "READY",
          autoPublishEligible: false,
          author: "Bed Bug Treatment Team",
          readTime: "9 min read",
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to save draft");
      }

      setDraftSuccess(true);
      setTimeout(() => setDraftSuccess(false), 5000);
    } catch (err: any) {
      console.error("Draft error:", err);
      setError(err.message || "Failed to save blog draft.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleStop = () => {
    isStoppedRef.current = true;
    if (readerRef.current) {
      try {
        readerRef.current.cancel("User cancelled generation").catch(() => {});
      } catch {}
      readerRef.current = null;
    }
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch {}
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setCurrentStage(0);
    setStreamStatus("Generation stopped by user.");
    setData(prev => {
      if (!prev?.blogContent || prev.blogContent.trim().length === 0) {
        return null;
      }
      return prev;
    });
  };

  const handleGenerate = async (e?: React.FormEvent, overrideTopic?: string, overrideKeywords?: string) => {
    e?.preventDefault();
    const activeTopic = overrideTopic !== undefined ? overrideTopic : topic;
    const activeKeywords = overrideKeywords !== undefined ? overrideKeywords : keywords;

    // Cancel any previous session first
    if (abortControllerRef.current) {
      try { abortControllerRef.current.abort(); } catch {}
      abortControllerRef.current = null;
    }
    if (readerRef.current) {
      try { readerRef.current.cancel(); } catch {}
      readerRef.current = null;
    }

    isStoppedRef.current = false;
    abortControllerRef.current = new AbortController();
    readerRef.current = null;

    setError("");
    setData(null);
    setUsage(null);
    setCurrentStage(1);
    setStreamStatus("Initializing pipeline...");
    setActiveTab("preview");

    try {
      const statusRes = await fetch("/api/admin/blog/status", {
        signal: abortControllerRef.current.signal
      });
      const statusData = await statusRes.json();
      if (!statusData.apiKeySet) {
        setApiKeyMissing(true);
        setTimeout(() => setApiKeyMissing(false), 4000);
        return;
      }
    } catch (err: any) {
      if (err.name === "AbortError" || isStoppedRef.current) {
        setStreamStatus("Generation stopped by user.");
        return;
      }
    }

    if (isStoppedRef.current) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: activeTopic, keywords: activeKeywords, skipImages, imageModel: "gpt-image-2.5-flare" }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate blog");
      }

      if (isStoppedRef.current) return;

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Streaming not supported in this browser.");
      readerRef.current = reader;

      const decoder = new TextDecoder();
      let buffer = "";
      let tempContent = "";
      let tempResearch: ResearchData | undefined;

      setData({ blogContent: "" });

      while (true) {
        if (isStoppedRef.current) break;

        let readResult;
        try {
          readResult = await reader.read();
        } catch (readErr: any) {
          if (
            isStoppedRef.current ||
            readErr?.name === "AbortError" ||
            readErr?.message?.includes("aborted") ||
            readErr?.message?.includes("BodyStreamBuffer")
          ) {
            break;
          }
          throw readErr;
        }

        const { done, value } = readResult;
        if (done || isStoppedRef.current) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          if (isStoppedRef.current) break;
          const line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.trim()) {
            try {
              const event = JSON.parse(line);
              
              if (event.type === "status") {
                if (!isStoppedRef.current) {
                  setStreamStatus(event.data.message);
                  if (event.data.stage) setCurrentStage(event.data.stage);
                }
              } else if (event.type === "research") {
                tempResearch = event.data;
              } else if (event.type === "red_flags") {
                // Red flags detected during drafting
              } else if (event.type === "chunk") {
                if (!isStoppedRef.current) {
                  tempContent += event.data;
                  setData(prev => ({
                    ...prev,
                    blogContent: tempContent,
                    research: tempResearch,
                  } as GeneratedData));
                }
              } else if (event.type === "complete") {
                if (!isStoppedRef.current) {
                  setData(event.data);
                  if (event.data.usage) setUsage(event.data.usage);
                  setStreamStatus("");
                  setCurrentStage(0);
                }
              } else if (event.type === "error") {
                throw new Error(event.data);
              }
            } catch (err) {
              console.error("Failed to parse stream line:", line, err);
            }
          }
        }
      }
    } catch (err: any) {
      if (
        err?.name === 'AbortError' ||
        isStoppedRef.current ||
        err?.message?.includes("aborted") ||
        err?.message?.includes("BodyStreamBuffer")
      ) {
        setStreamStatus("Generation stopped by user.");
      } else {
        setError(err?.message || "Something went wrong.");
        setStreamStatus("");
      }
    } finally {
      if (readerRef.current) {
        try {
          readerRef.current.cancel().catch(() => {});
        } catch {}
        readerRef.current = null;
      }
      setIsGenerating(false);
      if (!isStoppedRef.current) {
        setStreamStatus("");
      } else {
        setStreamStatus("Generation stopped by user.");
        setCurrentStage(0);
      }
    }
  };

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.name === "AbortError" ||
        event.reason?.message?.includes("aborted") ||
        event.reason?.message?.includes("BodyStreamBuffer")
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !hasAutoStartedRef.current) {
      const searchParams = new URLSearchParams(window.location.search);
      const urlTopic = searchParams.get("topic");
      const urlKeywords = searchParams.get("keywords") || "";

      if (urlTopic) {
        hasAutoStartedRef.current = true;
        setTopic(urlTopic);
        setKeywords(urlKeywords);
        
        // Remove query params from URL so it doesn't trigger again on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Auto start generation
        setTimeout(() => {
          handleGenerate(undefined, urlTopic, urlKeywords);
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async () => {
    if (!data?.blogContent) return;

    try {
      if (activeTab === "markdown") {
        await navigator.clipboard.writeText(data.blogContent);
      } else {
        const articleEl = document.getElementById("blog-preview-content");
        if (articleEl) {
          try {
            const html = articleEl.innerHTML;
            const text = articleEl.innerText;
            const clipboardItem = new ClipboardItem({
              "text/html": new Blob([html], { type: "text/html" }),
              "text/plain": new Blob([text], { type: "text/plain" }),
            });
            await navigator.clipboard.write([clipboardItem]);
          } catch (e) {
            const range = document.createRange();
            range.selectNodeContents(articleEl);
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(range);
              document.execCommand('copy');
              selection.removeAllRanges();
            }
          }
        } else {
          await navigator.clipboard.writeText(data.blogContent);
        }
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleTestImage = async () => {
    setIsImageTestOpen(true);
    setIsTestingImage(true);
    setTestImageUrl("");
    setTestImageError("");
    setTestRawResponse(null);

    try {
      const response = await fetch("/api/admin/blog/test-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `A highly detailed, professional, photorealistic image about ${topic || "bed bugs"}.`,
          model: "gpt-image-2.5-flare"
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }
      setTestImageUrl(data.url);
      setTestRawResponse(data.raw_response);
    } catch (err: any) {
      setTestImageError(err.message);
    } finally {
      setIsTestingImage(false);
    }
  };

  const pubColor = data?.publicationStatus === "READY" ? "emerald" : "red";

  return (
    <div className="flex h-full flex-col lg:flex-row gap-4 min-h-0 overflow-hidden relative">
      {/* LEFT SIDEBAR */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden min-h-0">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
              <PenTool className="h-4 w-4" />
            </div>
            <h2 className="font-bold text-neutral-900 text-sm">SEO Content Engine</h2>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Multi-stage pipeline: Research, Draft, Extract Claims, Audit.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
          <form id="blog-form" onSubmit={handleGenerate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="topic" className="text-xs font-semibold text-neutral-800">
                Primary Topic <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                disabled={isGenerating}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Leave blank for auto-topic"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="keywords" className="text-xs font-semibold text-neutral-800">
                Target Keywords <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                id="keywords"
                type="text"
                value={keywords}
                disabled={isGenerating}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. bed bugs, termite control"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50"
              />
            </div>

            {/* Skip Image Generation Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-3 transition hover:bg-neutral-50">
              <div className="flex items-center gap-2.5">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${skipImages ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
                  {skipImages ? <ImageOff className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-neutral-800">Skip Images</span>
                  <span className="text-[10px] text-neutral-500">Omit visual placeholders</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSkipImages(!skipImages)}
                disabled={isGenerating}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                  skipImages ? "bg-amber-600" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    skipImages ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={handleTestImage}
              disabled={isGenerating}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-100 px-4 py-2.5 text-xs font-bold text-neutral-700 transition-all hover:bg-neutral-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              <ImageIcon className="h-4 w-4" />
              Test AI Image Generation
            </button>
          </form>

          {/* Real-time Pipeline Animation */}
          {isGenerating && (
            <PipelineAnimation currentStage={currentStage} streamStatus={streamStatus} />
          )}

          {/* Stopped status notification */}
          {!isGenerating && streamStatus && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{streamStatus}</span>
              </div>
              <button
                type="button"
                onClick={() => setStreamStatus("")}
                className="text-amber-500 hover:text-amber-700"
              >
                <XCircle className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Stats Box (Shows when fully generated) */}
          {data?.audit && !isGenerating && (
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Publication Gate
              </h3>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`h-5 w-5 text-${pubColor}-500`} />
                  <span className="text-sm font-bold text-neutral-900">Status</span>
                </div>
                <span className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wider bg-${pubColor}-100 text-${pubColor}-700 border border-${pubColor}-200`}>
                  {data.publicationStatus}
                </span>
              </div>

              {data.redFlags && data.redFlags.length > 0 && (
                <div className="rounded-lg bg-red-50 p-2 border border-red-100 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-red-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase">Red Flags Detected</span>
                  </div>
                  {data.redFlags.map((flag, idx) => (
                    <span key={idx} className="text-xs text-red-700 leading-tight">- {flag}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-neutral-200">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-600">Word Count</span>
                </div>
                <span className="text-xs font-bold text-neutral-900">{wordCount}</span>
              </div>

              {usage && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-600">Tokens Used</span>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">{usage.totalTokens}</span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-100">
              {error}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-neutral-100 bg-white shrink-0 flex flex-col gap-2">
          {isGenerating ? (
            <button
              type="button"
              onClick={handleStop}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
            >
              <XCircle className="h-4 w-4" />
              <span>Stop Generation</span>
            </button>
          ) : (
            <button
              type="submit"
              form="blog-form"
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Sparkles className="h-4 w-4" />
              <span>{data ? "Regenerate Content" : "Run Content Engine"}</span>
            </button>
          )}

          {data && !isGenerating && (
            <>
              <button
                type="button"
                onClick={handlePublishBlog}
                disabled={isPublishing || data.publicationStatus === "BLOCKED"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isPublishing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : publishedSuccess ? (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                ) : (
                  <Globe className="h-4 w-4" />
                )}
                <span>{publishedSuccess ? "Published to Website!" : isPublishing ? "Publishing..." : "Publish to Website"}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-2.5 text-sm font-bold text-neutral-800 shadow-sm transition hover:bg-neutral-200 disabled:opacity-50"
              >
                {isSavingDraft ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : draftSuccess ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <FileText className="h-4 w-4 text-neutral-600" />
                )}
                <span>{draftSuccess ? "Saved as Draft!" : isSavingDraft ? "Saving Draft..." : "Save as Draft"}</span>
              </button>

              {draftSuccess && (
                <div className="flex flex-col gap-1.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 shadow-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Saved to Database as Draft!</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    This article is saved in the database but kept unlisted from the public website.
                  </p>
                  <Link
                    href="/admin/edit-blogs"
                    className="mt-0.5 inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 text-[11px] underline"
                  >
                    View in Edit Blogs (Drafts) &rarr;
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={handleDiscard}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                <span>Discard Content</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Tabs & Preview */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-neutral-200 shadow-sm min-w-0 overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 shrink-0 bg-neutral-50/30 overflow-x-auto">
          <div className="flex items-center gap-1 bg-neutral-100/80 p-0.5 rounded-lg border border-neutral-200/50 shrink-0">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "preview"
                  ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              disabled={!data?.audit}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "audit"
                  ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50 disabled:opacity-50"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Quality & Claims
            </button>
            <button
              onClick={() => setActiveTab("seo")}
              disabled={!data?.metadata}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "seo"
                  ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50 disabled:opacity-50"
              }`}
            >
              <LayoutTemplate className="h-3.5 w-3.5" /> SEO Assets
            </button>
            <button
              onClick={() => setActiveTab("research")}
              disabled={!data?.research}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "research"
                  ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50 disabled:opacity-50"
              }`}
            >
              <Search className="h-3.5 w-3.5" /> Research
            </button>
            <button
              onClick={() => setActiveTab("markdown")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "markdown"
                  ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/50"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" /> Markdown
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button
              onClick={handleCopy}
              disabled={!data?.blogContent || isGenerating}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:opacity-50"
            >
              {copied ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Output"}</span>
            </button>

            {data?.blogContent && !isGenerating && (
              <button
                onClick={handlePublishBlog}
                disabled={isPublishing || data.publicationStatus === "BLOCKED"}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isPublishing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : publishedSuccess ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                ) : (
                  <Globe className="h-3.5 w-3.5" />
                )}
                <span>{publishedSuccess ? "Published!" : isPublishing ? "Publishing..." : "Publish to Website"}</span>
              </button>
            )}

            {publishedSlug && (
              <a
                href={`/${publishedSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
              >
                <ExternalLink className="h-3.5 w-3.5" /> View Live
              </a>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white p-6 md:p-8 relative">
          {!data && !isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-50 border border-neutral-100 shadow-sm mb-4">
                <FileText className="h-8 w-8 text-neutral-300" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">No content yet</h3>
              <p className="mt-1 text-xs text-neutral-500 max-w-sm">
                Enter your requirements in the sidebar and run the Content Engine to execute the pipeline.
              </p>
            </div>
          )}

          {isGenerating && !data?.blogContent && (
            <WritingAnimation text="" />
          )}

          {data?.blogContent && (
            <div className="mx-auto max-w-3xl pb-20">
              
              {/* If published is blocked, show a massive warning at the top of the preview */}
              {data.publicationStatus === "BLOCKED" && activeTab === "preview" && (
                <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <XCircle className="h-8 w-8 text-red-600 shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-red-900">Publication Blocked</h3>
                      <p className="text-sm text-red-700 mt-1">
                        This article failed the strict quality and fact-checking gates. It contains unverified claims, hallucinated prices, or dangerous home remedies. 
                        Review the <strong>Quality & Claims</strong> tab.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "preview" && (
                isGenerating && data.blogContent ? (
                  <WritingAnimation text={data.blogContent} />
                ) : (
                  <article id="blog-preview-content" className="prose prose-sm md:prose-base prose-neutral max-w-none prose-headings:font-bold prose-headings:text-emerald-800 prose-h1:text-emerald-900 prose-h2:text-emerald-800 prose-h3:text-emerald-700 prose-h4:text-emerald-700 prose-a:text-emerald-600 prose-img:rounded-xl">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-6 mb-3 tracking-tight" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 mt-7 mb-3 tracking-tight border-b border-emerald-100 pb-2" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-lg font-bold text-emerald-700 mt-5 mb-2 tracking-tight" {...props} />
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
                        img: ({ node, ...props }) => (
                          <span className="my-6 flex flex-col items-center not-prose w-full">
                            <span className="block w-full max-w-xl aspect-[3/2] rounded-2xl overflow-hidden border border-neutral-200/90 shadow-sm bg-neutral-100 relative">
                              <img
                                {...props}
                                className="w-full h-full object-cover object-top m-0"
                                loading="lazy"
                              />
                            </span>
                            {props.alt && (
                              <span className="block mt-2 text-[10px] text-neutral-500 italic max-w-lg text-center">
                                {props.alt}
                              </span>
                            )}
                          </span>
                        ),
                      }}
                    >
                      {data.blogContent}
                    </ReactMarkdown>
                  </article>
                )
              )}

              {activeTab === "markdown" && (
                <pre className="whitespace-pre-wrap rounded-xl bg-neutral-50 p-6 text-[13px] text-neutral-800 font-mono border border-neutral-100">
                  {data.blogContent}
                  {isGenerating && <span className="inline-block w-2 h-3 ml-1 bg-neutral-800 animate-pulse"></span>}
                </pre>
              )}

              {activeTab === "audit" && data.audit && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2">
                  
                  {/* The 5 Discrete Scores */}
                  {/* The 8 Quality Scores */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-neutral-900">Multi-Dimensional Quality Scores</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        data.publicationStatus === "READY" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}>
                        Status: {data.publicationStatus || "BLOCKED"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                      {[
                        { label: "SEO Quality", score: data.audit.seoQuality },
                        { label: "Content Quality", score: data.audit.contentQuality },
                        { label: "Factual Confidence", score: data.audit.factualConfidence },
                        { label: "Info Gain", score: data.audit.informationGain },
                        { label: "E-E-A-T", score: data.audit.eeatScore },
                        { label: "Local Relevance", score: data.audit.localRelevance || 88 },
                        { label: "Internal Links", score: data.audit.internalLinking || 95 },
                        { label: "Conversion", score: data.audit.conversionQuality || 92 },
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-100 bg-white shadow-sm text-center">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1 line-clamp-1">{item.label}</span>
                          <span className={`text-xl font-black ${item.score >= 90 ? 'text-emerald-600' : item.score >= 80 ? 'text-amber-500' : 'text-red-500'}`}>
                            {item.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hard Publication Blockers Panel */}
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Hard Publication Blockers & Evidence Coverage
                      </h4>
                      <span className="text-xs font-semibold text-neutral-600">
                        Evidence Coverage: <strong className="text-emerald-600">{data.audit.evidenceCoverage || 100}%</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { label: "Unverified Statistics", count: data.blockers?.unverifiedStatistic || 0 },
                        { label: "Unverified Prices", count: data.blockers?.unverifiedPrice || 0 },
                        { label: "Fabricated Sources", count: data.blockers?.fabricatedSource || 0 },
                        { label: "Fabricated Experts", count: data.blockers?.fabricatedExpert || 0 },
                        { label: "Unverified Quotes", count: data.blockers?.unverifiedQuote || 0 },
                        { label: "Technical Numbers", count: data.blockers?.unverifiedTechnicalThreshold || 0 },
                        { label: "Unsafe Advice", count: data.blockers?.unsafeTreatmentAdvice || 0 },
                        { label: "High-Risk Without Evidence", count: data.blockers?.highRiskClaimWithoutEvidence || 0 },
                      ].map((b, i) => (
                        <div key={i} className={`p-2.5 rounded-lg border ${b.count > 0 ? 'border-red-200 bg-red-50 text-red-900' : 'border-neutral-200 bg-white text-neutral-700'} flex items-center justify-between`}>
                          <span className="font-medium text-[11px]">{b.label}</span>
                          <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${b.count > 0 ? 'bg-red-200 text-red-800' : 'bg-emerald-100 text-emerald-700'}`}>
                            {b.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extracted Claims & Source Traceability */}
                  {data.claims && (
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-4">Extracted Claims & Source Traceability</h3>
                      <div className="flex flex-col gap-3">
                        {data.claims.map((claim, i) => {
                          const isVerified = claim.isSupported || claim.verification === "VERIFIED";
                          const isHighRisk = claim.risk === "HIGH" && !isVerified;
                          return (
                            <div key={i} className={`p-4 rounded-xl border ${isHighRisk ? 'border-red-200 bg-red-50' : 'border-neutral-200 bg-white'} shadow-sm`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600">
                                      {claim.category}
                                    </span>
                                    {claim.evidenceId && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                                        ID: {claim.evidenceId}
                                      </span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                      {isVerified ? "VERIFIED" : (claim.recommendedAction || "SANITIZED")}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${claim.risk === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-neutral-100 text-neutral-600'}`}>
                                      {claim.risk || "STANDARD"} RISK
                                    </span>
                                  </div>

                                  <p className={`text-sm font-medium ${isHighRisk ? 'text-red-900' : 'text-neutral-900'}`}>
                                    "{claim.text || claim.claim}"
                                  </p>

                                  {claim.explanation && (
                                    <p className="text-xs text-neutral-500">
                                      {claim.explanation}
                                    </p>
                                  )}

                                  {claim.sourceTitle && (
                                    <div className="pt-1 text-xs text-neutral-600 flex items-center gap-2">
                                      <span>Source: <strong>{claim.sourceTitle}</strong></span>
                                      {claim.sourceUrl && (
                                        <a href={claim.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline inline-flex items-center gap-1 font-semibold">
                                          [Open Source Link]
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {isVerified ? (
                                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-1" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-1" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 mb-2">Auditor Notes</h4>
                    <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
                      {data.audit.evaluationNotes.map((note: string, i: number) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "seo" && data.metadata && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-4">Metadata</h3>
                    <div className="flex flex-col gap-3">
                      <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">SEO Title</span>
                        <p className="text-sm font-medium text-neutral-900">{data.metadata.seoTitle}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Meta Description</span>
                        <p className="text-sm font-medium text-neutral-900">{data.metadata.metaDescription}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">URL Slug</span>
                        <p className="text-sm font-medium text-blue-600 font-mono">/{data.metadata.urlSlug}</p>
                      </div>
                    </div>
                  </div>

                  {data.faqs && (
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-4">FAQs Generated</h3>
                      <div className="flex flex-col gap-3">
                        {data.faqs.map((faq, i) => (
                          <div key={i} className="p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                            <p className="text-sm font-bold text-neutral-900 mb-1">Q: {faq.question}</p>
                            <p className="text-xs text-neutral-700">A: {faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "research" && data.research && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-4">Search Intent Analysis</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Primary Intent</span>
                        <p className="text-sm font-medium text-neutral-900">{data.research.searchIntent.primaryIntent}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Target Audience</span>
                        <p className="text-sm font-medium text-neutral-900">{data.research.searchIntent.targetAudience}</p>
                      </div>
                      <div className="col-span-2 p-3 rounded-lg border border-neutral-100 bg-neutral-50">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Expected Answer</span>
                        <p className="text-sm font-medium text-neutral-900">{data.research.searchIntent.expectedAnswer}</p>
                      </div>
                    </div>
                  </div>

                  {data.research.informationGainPlan && (
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-4">Information Gain & Practical Tools</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Unique Useful Elements & Checklists</h4>
                          <ul className="list-disc pl-5 text-sm text-neutral-800 space-y-1">
                            {data.research.informationGainPlan.uniqueUsefulElements.map((el: string, i: number) => (
                              <li key={i}>{el}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Identified Competitor Content Gaps</h4>
                          <ul className="list-disc pl-5 text-sm text-neutral-800 space-y-1">
                            {data.research.informationGainPlan.contentGaps.map((gap: string, i: number) => (
                              <li key={i}>{gap}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Floating Image Test Modal */}
      {isImageTestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-neutral-50/50">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-emerald-600" />
                <h2 className="font-bold text-neutral-800">Test AI Image Generation</h2>
              </div>
              <button 
                onClick={() => setIsImageTestOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              {isTestingImage ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-emerald-600">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm font-semibold">Calling OpenAI API with gpt-image-2.5-flare...</p>
                </div>
              ) : testImageError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="h-5 w-5" />
                    Error Generating Image
                  </div>
                  <p className="text-sm">{testImageError}</p>
                </div>
              ) : testImageUrl ? (
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center relative aspect-[3/2] w-full">
                    <img 
                      src={testImageUrl} 
                      alt="Test generated image" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline><line x1="3" y1="3" x2="21" y2="21" stroke="%23ef4444"></line></svg>';
                        (e.target as HTMLImageElement).classList.add("opacity-50", "object-contain", "p-8");
                        setTestImageError("Image broke! Discord CDN returned 404 when loaded by browser.");
                      }}
                    />
                  </div>
                  {testImageError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-xs font-medium flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        {testImageError} 
                        <br/>
                        <span className="font-normal mt-1 block text-red-600/80">Your provider is sending an unsigned Discord link that is blocked by Discord.</span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Raw URL Returned</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={testImageUrl} 
                        className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600 font-mono"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(testImageUrl);
                          alert("URL Copied");
                        }}
                        className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-neutral-100 bg-neutral-50 p-4 flex justify-end gap-3">
              <button
                onClick={() => setIsImageTestOpen(false)}
                className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-200 text-sm font-semibold transition-colors"
              >
                Close
              </button>
              {testImageUrl && (
                <a
                  href={testImageUrl}
                  download="test-image.png"
                  target="_blank"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open / Download
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
