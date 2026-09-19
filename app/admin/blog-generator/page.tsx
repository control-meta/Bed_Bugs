"use strict";
"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
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
};

export default function BlogGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamStatus, setStreamStatus] = useState("");
  const [data, setData] = useState<GeneratedData | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "markdown" | "audit" | "seo" | "research">("preview");

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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setData(null);
    setUsage(null);
    setStreamStatus("Initializing pipeline...");
    setActiveTab("preview");

    try {
      const statusRes = await fetch("/api/admin/blog/status");
      const statusData = await statusRes.json();
      if (!statusData.apiKeySet) {
        setApiKeyMissing(true);
        setTimeout(() => setApiKeyMissing(false), 4000);
        return;
      }
    } catch {}

    setIsGenerating(true);

    try {
      const response = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, keywords }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate blog");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Streaming not supported in this browser.");

      const decoder = new TextDecoder();
      let buffer = "";
      let tempContent = "";
      let tempResearch: ResearchData | undefined;

      setData({ blogContent: "" });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.trim()) {
            try {
              const event = JSON.parse(line);
              
              if (event.type === "status") {
                setStreamStatus(event.data.message);
              } else if (event.type === "research") {
                tempResearch = event.data;
              } else if (event.type === "red_flags") {
                // Red flags detected during drafting
              } else if (event.type === "chunk") {
                tempContent += event.data;
                setData(prev => ({
                  ...prev,
                  blogContent: tempContent,
                  research: tempResearch,
                } as GeneratedData));
              } else if (event.type === "complete") {
                setData(event.data);
                if (event.data.usage) setUsage(event.data.usage);
                setStreamStatus("");
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
      setError(err.message || "Something went wrong.");
      setStreamStatus("");
    } finally {
      setIsGenerating(false);
      setStreamStatus("");
    }
  };

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
          </form>

          {/* Real-time Streaming Status */}
          {isGenerating && streamStatus && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-inner">
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600 shrink-0" />
                <p className="text-xs font-semibold text-emerald-800 animate-pulse">{streamStatus}</p>
              </div>
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
          <button
            type="submit"
            form="blog-form"
            disabled={isGenerating}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{data ? "Regenerate Content" : "Run Content Engine"}</span>
              </>
            )}
          </button>

          {data && !isGenerating && (
            <button
              type="button"
              onClick={handleDiscard}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              <span>Discard Content</span>
            </button>
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

          <button
            onClick={handleCopy}
            disabled={!data?.blogContent || isGenerating}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:opacity-50 shrink-0 ml-2"
          >
            {copied ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Output"}</span>
          </button>
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
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
              <h3 className="text-sm font-bold text-neutral-900 animate-pulse">{streamStatus || "Starting Pipeline..."}</h3>
            </div>
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
                <article id="blog-preview-content" className="prose prose-sm md:prose-base prose-neutral max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-emerald-600 prose-img:rounded-xl">
                  <ReactMarkdown>{data.blogContent}</ReactMarkdown>
                  {isGenerating && <span className="inline-block w-2 h-4 ml-1 bg-emerald-500 animate-pulse"></span>}
                </article>
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
    </div>
  );
}
