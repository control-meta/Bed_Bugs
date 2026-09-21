"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { DEFAULT_BLOG_IMAGE_MODEL } from "@/lib/blog/image-model-config";

export type UsageStats = {
  totalTokens: number;
};

export type ResearchData = {
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

export type GeneratedData = {
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
  externalSourcesUsed?: Array<{ evidenceId: string; title: string; url: string }>;
  editorialChangeSummary?: string;
};

type BlogGeneratorContextType = {
  topic: string;
  setTopic: (topic: string) => void;
  keywords: string;
  setKeywords: (keywords: string) => void;
  skipImages: boolean;
  setSkipImages: (skip: boolean) => void;
  isGenerating: boolean;
  streamStatus: string;
  setStreamStatus: (status: string) => void;
  currentStage: number;
  data: GeneratedData | null;
  setData: (data: GeneratedData | null | ((prev: GeneratedData | null) => GeneratedData | null)) => void;
  error: string;
  setError: (error: string) => void;
  targetSlug: string;
  setTargetSlug: (slug: string) => void;
  usage: UsageStats | null;
  handleGenerate: (e?: React.FormEvent, overrideTopic?: string, overrideKeywords?: string) => Promise<void>;
  handleStop: () => void;
  apiKeyMissing: boolean;
  setApiKeyMissing: (missing: boolean) => void;
  hasAutoStartedRef: React.MutableRefObject<boolean>;
};

const BlogGeneratorContext = createContext<BlogGeneratorContextType | null>(null);

export function useBlogGenerator() {
  const context = useContext(BlogGeneratorContext);
  if (!context) {
    throw new Error("useBlogGenerator must be used within a BlogGeneratorProvider");
  }
  return context;
}

export function BlogGeneratorProvider({ children }: { children: React.ReactNode }) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const isStoppedRef = useRef(false);
  const generationIdRef = useRef(0);
  const hasAutoStartedRef = useRef(false);

  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [skipImages, setSkipImages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamStatus, setStreamStatus] = useState("");
  const [currentStage, setCurrentStage] = useState(0);
  const [data, setData] = useState<GeneratedData | null>(null);
  const [error, setError] = useState("");
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [targetSlug, setTargetSlug] = useState("");
  const [usage, setUsage] = useState<UsageStats | null>(null);

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

  const handleStop = () => {
    generationIdRef.current += 1;
    isStoppedRef.current = true;

    // Abort the network request first so the server receives the disconnect immediately.
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort("User cancelled generation");
      } catch {}
      abortControllerRef.current = null;
    }

    if (readerRef.current) {
      try {
        readerRef.current.cancel("User cancelled generation").catch(() => {});
      } catch {}
      readerRef.current = null;
    }
    setIsGenerating(false);
    setCurrentStage(0);
    setStreamStatus("Generation stopped by user.");
    setData((prev) => {
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
    const generationId = generationIdRef.current + 1;
    generationIdRef.current = generationId;

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
    const isCurrentGeneration = () => generationIdRef.current === generationId && !isStoppedRef.current;

    setError("");
    setData(null);
    setUsage(null);
    setCurrentStage(1);
    setStreamStatus("Initializing pipeline...");
    setIsGenerating(true);

    try {
      const statusRes = await fetch("/api/admin/blog/status", {
        signal: abortControllerRef.current.signal
      });
      const statusData = await statusRes.json();
      if (!statusData.apiKeySet) {
        setApiKeyMissing(true);
        setTimeout(() => setApiKeyMissing(false), 4000);
        setIsGenerating(false);
        return;
      }
    } catch (err: any) {
      if (err.name === "AbortError" || !isCurrentGeneration()) {
        return;
      }
    }

    if (!isCurrentGeneration()) return;

    try {
      const response = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: activeTopic, keywords: activeKeywords, skipImages, imageModel: DEFAULT_BLOG_IMAGE_MODEL }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate blog");
      }

      if (!isCurrentGeneration()) return;

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Streaming not supported in this browser.");
      readerRef.current = reader;

      const decoder = new TextDecoder();
      let buffer = "";
      let tempContent = "";
      let tempResearch: ResearchData | undefined;

       if (!isCurrentGeneration()) return;
       setData({ blogContent: "" });

      while (true) {
        if (!isCurrentGeneration()) break;

        let readResult;
        try {
          readResult = await reader.read();
        } catch (readErr: any) {
          if (
            !isCurrentGeneration() ||
            readErr?.name === "AbortError" ||
            readErr?.message?.includes("aborted") ||
            readErr?.message?.includes("BodyStreamBuffer")
          ) {
            break;
          }
          throw readErr;
        }

        const { done, value } = readResult;
        if (done || !isCurrentGeneration()) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            if (!isCurrentGeneration()) break;
          const line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.trim()) {
            let event: { type: string; data: any };
            try {
              event = JSON.parse(line);
            } catch (err) {
              console.error("Failed to parse stream line:", line, err);
              continue;
            }

            if (event.type === "status") {
              if (isCurrentGeneration()) {
                setStreamStatus(event.data.message);
                if (event.data.stage) setCurrentStage(event.data.stage);
              }
            } else if (event.type === "research") {
              tempResearch = event.data;
            } else if (event.type === "red_flags") {
              // Red flags detected during drafting
            } else if (event.type === "chunk") {
              if (isCurrentGeneration()) {
                tempContent += event.data;
                setData(prev => ({
                  ...prev,
                  blogContent: tempContent,
                  research: tempResearch,
                } as GeneratedData));
              }
            } else if (event.type === "complete") {
              if (isCurrentGeneration()) {
                setData(event.data);
                if (event.data.usage) setUsage(event.data.usage);
                setStreamStatus("");
                setCurrentStage(0);

                // Show native browser notification if available
                if ("Notification" in window && Notification.permission === "granted") {
                  new Notification("Blog Generation Complete!", {
                    body: "Your AI article is ready to be reviewed.",
                    icon: "/favicon.ico"
                  });
                }
              }
            } else if (event.type === "error") {
              throw new Error(String(event.data || "Blog generation failed."));
            }
          }
        }
      }
    } catch (err: any) {
      if (
        err?.name === 'AbortError' ||
        !isCurrentGeneration() ||
        err?.message?.includes("aborted") ||
        err?.message?.includes("BodyStreamBuffer")
      ) {
        if (generationIdRef.current === generationId) {
          setStreamStatus("Generation stopped by user.");
        }
      } else {
        setError(err?.message || "Something went wrong.");
        setStreamStatus("");
      }
    } finally {
      if (generationIdRef.current === generationId && readerRef.current) {
        try {
          readerRef.current.cancel().catch(() => {});
        } catch {}
        readerRef.current = null;
      }
      if (generationIdRef.current !== generationId) return;
      setIsGenerating(false);
      if (isCurrentGeneration()) {
        setStreamStatus("");
      } else if (generationIdRef.current === generationId) {
        setStreamStatus("Generation stopped by user.");
        setCurrentStage(0);
      }
    }
  };

  return (
    <BlogGeneratorContext.Provider value={{
      topic, setTopic,
      keywords, setKeywords,
      skipImages, setSkipImages,
      isGenerating,
      streamStatus, setStreamStatus,
      currentStage,
      data, setData,
      error, setError,
      targetSlug, setTargetSlug,
      usage,
      handleGenerate,
      handleStop,
      apiKeyMissing, setApiKeyMissing,
      hasAutoStartedRef
    }}>
      {children}
    </BlogGeneratorContext.Provider>
  );
}
