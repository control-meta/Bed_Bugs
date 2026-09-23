"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  CalendarDays,
  Tag,
  WifiOff,
  X,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  Pause,
  Settings,
  Zap,
  Radio,
  ExternalLink,
  RefreshCw,
  Timer,
  Check,
  Square,
  Calendar,
  History,
  Terminal,
  Sliders,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { useCalendarContext, BlogPlan } from "../CalendarContext";
import type { AutoPublishConfig, AutoPublishLog } from "@/lib/auto-publish-service";

const TYPE_COLORS: Record<string, string> = {
  "how-to": "bg-blue-100 text-blue-700 border-blue-200",
  guide: "bg-purple-100 text-purple-700 border-purple-200",
  list: "bg-amber-100 text-amber-700 border-amber-200",
  comparison: "bg-pink-100 text-pink-700 border-pink-200",
  local: "bg-emerald-100 text-emerald-700 border-emerald-200",
  educational: "bg-neutral-100 text-neutral-700 border-neutral-200",
};

const STORAGE_KEY = "bedbug_content_calendar";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [plan, setPlan] = useState<BlogPlan[]>([]);
  const [selectedDay, setSelectedDay] = useState<BlogPlan | null>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [isSupabase, setIsSupabase] = useState<boolean | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isEditingKeywords, setIsEditingKeywords] = useState(false);
  const [editingKeywordsValue, setEditingKeywordsValue] = useState("");
  const [isSavingKeywords, setIsSavingKeywords] = useState(false);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editingTopicValue, setEditingTopicValue] = useState("");
  const [isSavingTopic, setIsSavingTopic] = useState(false);

  // Auto-Publish feature state
  const [isAutoPublishModalOpen, setIsAutoPublishModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"test" | "schedule" | "logs" | "terminal">("test");
  const [terminalLogs, setTerminalLogs] = useState<string>("");
  const terminalRef = useRef<HTMLPreElement>(null);
  const [modalFeedback, setModalFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [autoPublishConfig, setAutoPublishConfig] = useState<AutoPublishConfig | null>(null);
  const [nextPlannedPost, setNextPlannedPost] = useState<BlogPlan | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);
  const [isUpdatingConfig, setIsUpdatingConfig] = useState(false);
  const [isTriggeringNow, setIsTriggeringNow] = useState(false);
  const [autoPublishToast, setAutoPublishToast] = useState<{ title: string; slug: string } | null>(null);
  const [selectedProductionFreq, setSelectedProductionFreq] = useState<"6h" | "12h" | "24h" | "daily">("6h");
  const [dailyTimeInput, setDailyTimeInput] = useState("09:00");
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const isTriggeringRef = useRef(false);

  const isTestTimerRunning = Boolean(autoPublishConfig?.enabled && autoPublishConfig?.frequency === "1min");
  const isProductionScheduleRunning = Boolean(autoPublishConfig?.enabled && autoPublishConfig?.frequency !== "1min");

  const formatCountdown = (sec: number): string => {
    if (sec <= 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const remM = m % 60;
      return `${h}h ${remM}m`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Fetch auto-publish state
  const fetchAutoPublishState = async () => {
    try {
      const res = await fetch("/api/admin/calendar/auto-publish");
      if (!res.ok) return;
      const data = await res.json();
      if (data.config) {
        setAutoPublishConfig(data.config);
        if (data.config.frequency && data.config.frequency !== "1min") {
          setSelectedProductionFreq(data.config.frequency);
        }
        setDailyTimeInput(data.config.dailyTime || "09:00");
      }
      if (data.nextPlannedPost) setNextPlannedPost(data.nextPlannedPost);
      if (typeof data.timeRemainingSeconds === "number" && data.config?.enabled) {
        setCountdownSeconds(data.timeRemainingSeconds);
      } else {
        setCountdownSeconds(0);
      }
    } catch (err) {
      console.warn("Error fetching auto-publish status:", err);
    }
  };

  const fetchTerminalLogs = async () => {
    try {
      const res = await fetch("/api/admin/system-logs");
      if (!res.ok) return;
      const text = await res.text();
      setTerminalLogs(text);
      if (terminalRef.current) {
        // scroll to bottom smoothly or instantly
        setTimeout(() => {
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
        }, 50);
      }
    } catch (err) {
      console.warn("Error fetching terminal logs:", err);
    }
  };

  useEffect(() => {
    fetchAutoPublishState();
  }, []);

  // Countdown timer ticker (runs every second ONLY when enabled)
  useEffect(() => {
    if (!autoPublishConfig?.enabled) {
      return;
    }

    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          if (!isTriggeringRef.current) {
            handleTriggerAutoPublish();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoPublishConfig?.enabled]);

  // Start 1-Minute Test Timer explicitly
  const handleStartTestTimer = async () => {
    setIsUpdatingConfig(true);
    setModalFeedback(null);
    try {
      const res = await fetch("/api/admin/calendar/auto-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: true,
          frequency: "1min",
        }),
      });

      if (!res.ok) throw new Error("Failed to start test timer");
      const data = await res.json();
      if (data.config) setAutoPublishConfig(data.config);
      setCountdownSeconds(60);
      setModalFeedback({
        type: "success",
        message: "1-Minute test countdown started! Auto-publishing will trigger in 60 seconds.",
      });
    } catch (err: any) {
      setModalFeedback({
        type: "error",
        message: err.message || "Failed to start test timer",
      });
    } finally {
      setIsUpdatingConfig(false);
    }
  };

  // Stop / Cancel Test Timer immediately
  const handleCancelTestTimer = async () => {
    setIsUpdatingConfig(true);
    setModalFeedback(null);
    try {
      const res = await fetch("/api/admin/calendar/auto-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: false,
        }),
      });

      if (!res.ok) throw new Error("Failed to cancel test timer");
      const data = await res.json();
      if (data.config) setAutoPublishConfig(data.config);
      setCountdownSeconds(0);
      setModalFeedback({
        type: "info",
        message: "Test timer stopped. Auto-publishing is paused.",
      });
    } catch (err: any) {
      setModalFeedback({
        type: "error",
        message: err.message || "Failed to cancel test timer",
      });
    } finally {
      setIsUpdatingConfig(false);
    }
  };

  // Save / Toggle Production Schedule
  const handleSaveProductionSchedule = async (enable: boolean) => {
    setIsUpdatingConfig(true);
    setModalFeedback(null);
    try {
      const res = await fetch("/api/admin/calendar/auto-publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: enable,
          frequency: selectedProductionFreq,
          dailyTime: dailyTimeInput,
        }),
      });

      if (!res.ok) throw new Error("Failed to update production schedule");
      const data = await res.json();
      if (data.config) setAutoPublishConfig(data.config);
      if (typeof data.timeRemainingSeconds === "number" && enable) {
        setCountdownSeconds(data.timeRemainingSeconds);
      } else {
        setCountdownSeconds(0);
      }
      setModalFeedback({
        type: "success",
        message: enable
          ? `Production schedule active! Frequency: ${
              selectedProductionFreq === "daily"
                ? `Daily at ${dailyTimeInput}`
                : `Every ${selectedProductionFreq}`
            }.`
          : "Production schedule paused.",
      });
    } catch (err: any) {
      setModalFeedback({
        type: "error",
        message: err.message || "Failed to update schedule",
      });
    } finally {
      setIsUpdatingConfig(false);
    }
  };

  // Handle test email trigger
  const handleTestEmail = async () => {
    setIsSendingTestEmail(true);
    setModalFeedback(null);
    try {
      const res = await fetch("/api/admin/email-test", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send test email");
      setModalFeedback({ type: "success", message: "Test email sent successfully! Check your inbox." });
    } catch (err: any) {
      setModalFeedback({ type: "error", message: err.message || "Failed to send test email" });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Handle immediate trigger (Instant Test / Run Next Now)
  const handleTriggerAutoPublish = async () => {
    if (isTriggeringRef.current) return;
    isTriggeringRef.current = true;
    setIsTriggeringNow(true);

    try {
      const res = await fetch("/api/admin/calendar/auto-publish/trigger", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.blog) {
        setAutoPublishToast({
          title: data.blog.title,
          slug: data.blog.slug,
        });
        setTimeout(() => setAutoPublishToast(null), 9000);

        // Refresh calendar plans to update generated status in UI
        if (data.planItem) {
          setPlan((prev) =>
            prev.map((p) => (p.date === data.planItem.date ? { ...p, status: "generated" } : p))
          );
        }
      }
      if (data.config) setAutoPublishConfig(data.config);
      if (data.nextPlannedPost) setNextPlannedPost(data.nextPlannedPost);
      if (data.config?.nextRunAt && data.config?.enabled) {
        const rem = Math.max(0, Math.floor((new Date(data.config.nextRunAt).getTime() - Date.now()) / 1000));
        setCountdownSeconds(rem);
      } else {
        setCountdownSeconds(0);
      }
    } catch (err) {
      console.error("Auto-publish trigger error:", err);
    } finally {
      isTriggeringRef.current = false;
      setIsTriggeringNow(false);
    }
  };

  const { isGenerating, error, generatePlan, setError } = useCalendarContext();

  const storageKey = `${STORAGE_KEY}_${currentYear}_${currentMonth}`;

  // Date comparison helpers
  const isPastMonth =
    currentYear < today.getFullYear() ||
    (currentYear === today.getFullYear() && currentMonth < today.getMonth() + 1);
  const isCurrentMonth =
    currentYear === today.getFullYear() && currentMonth === today.getMonth() + 1;

  const isDayInPast = (day: number) => {
    if (isPastMonth) return true;
    if (isCurrentMonth && day < today.getDate()) return true;
    return false;
  };

  // Fetch from DB on month change with instant local cache fallback
  useEffect(() => {
    let isMounted = true;

    // 1. Instant local cache restore
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setPlan(JSON.parse(saved));
      else setPlan([]);
    } catch {
      setPlan([]);
    }

    // 2. Fetch latest data from database
    const fetchFromDatabase = async () => {
      setIsLoadingDb(true);
      try {
        const res = await fetch(`/api/admin/calendar?month=${currentMonth}&year=${currentYear}`);
        if (!res.ok) throw new Error("Failed to load calendar from database");
        const data = await res.json();
        if (isMounted && Array.isArray(data.plan)) {
          setPlan(data.plan);
          setIsSupabase(data.isSupabase ?? false);
          // Sync local storage cache
          localStorage.setItem(storageKey, JSON.stringify(data.plan));
        }
      } catch (err) {
        console.warn("Could not fetch calendar from server API:", err);
      } finally {
        if (isMounted) setIsLoadingDb(false);
      }
    };

    fetchFromDatabase();

    return () => {
      isMounted = false;
    };
  }, [currentMonth, currentYear, storageKey]);

  // Listen for background generation completion
  useEffect(() => {
    const handlePlanGenerated = (e: any) => {
      if (e.detail.month === currentMonth && e.detail.year === currentYear) {
        setPlan(e.detail.plan);
        if (typeof e.detail.isSupabase === "boolean") {
          setIsSupabase(e.detail.isSupabase);
        }
      }
    };
    window.addEventListener("calendar-plan-generated", handlePlanGenerated);
    return () => window.removeEventListener("calendar-plan-generated", handlePlanGenerated);
  }, [currentMonth, currentYear]);

  const handleGenerateClick = () => {
    if (isPastMonth) {
      setError("Cannot generate plans for past months. Please switch to the current or an upcoming month.");
      return;
    }
    generatePlan(currentMonth, currentYear);
  };

  const handleToggleStatus = async () => {
    if (!selectedDay) return;
    setIsUpdatingStatus(true);
    const newStatus = selectedDay.status === "generated" ? "planned" : "generated";
    const updated = { ...selectedDay, status: newStatus as "planned" | "generated" };

    setSelectedDay(updated);
    setPlan((prev) => prev.map((p) => (p.date === selectedDay.date ? updated : p)));

    // Update local cache
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const list: BlogPlan[] = JSON.parse(saved);
        const idx = list.findIndex((p) => p.date === selectedDay.date);
        if (idx >= 0) {
          list[idx].status = newStatus;
          localStorage.setItem(storageKey, JSON.stringify(list));
        }
      }
    } catch {}

    // Persist to DB API
    try {
      await fetch("/api/admin/calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDay.date, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status on server:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveKeywords = async () => {
    if (!selectedDay) return;
    setIsSavingKeywords(true);
    const newKeywords = editingKeywordsValue.split(",").map(k => k.trim()).filter(k => k);
    const updated = { ...selectedDay, keywords: newKeywords };

    setSelectedDay(updated);
    setPlan((prev) => prev.map((p) => (p.date === selectedDay.date ? updated : p)));
    setIsEditingKeywords(false);

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const list: BlogPlan[] = JSON.parse(saved);
        const idx = list.findIndex((p) => p.date === selectedDay.date);
        if (idx >= 0) {
          list[idx].keywords = newKeywords;
          localStorage.setItem(storageKey, JSON.stringify(list));
        }
      }
    } catch {}

    try {
      await fetch("/api/admin/calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDay.date, keywords: newKeywords }),
      });
    } catch (err) {
      console.error("Failed to update keywords on server:", err);
    } finally {
      setIsSavingKeywords(false);
    }
  };

  const handleSaveTopic = async () => {
    if (!selectedDay) return;
    setIsSavingTopic(true);
    const newTopic = editingTopicValue.trim();
    if (!newTopic) {
      setIsSavingTopic(false);
      return;
    }
    const updated = { ...selectedDay, topic: newTopic };

    setSelectedDay(updated);
    setPlan((prev) => prev.map((p) => (p.date === selectedDay.date ? updated : p)));
    setIsEditingTopic(false);

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const list: BlogPlan[] = JSON.parse(saved);
        const idx = list.findIndex((p) => p.date === selectedDay.date);
        if (idx >= 0) {
          list[idx].topic = newTopic;
          localStorage.setItem(storageKey, JSON.stringify(list));
        }
      }
    } catch {}

    try {
      await fetch("/api/admin/calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDay.date, topic: newTopic }),
      });
    } catch (err) {
      console.error("Failed to update topic on server:", err);
    } finally {
      setIsSavingTopic(false);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth() + 1);
    setCurrentYear(today.getFullYear());
  };

  const monthName = new Date(currentYear, currentMonth - 1, 1).toLocaleString("en-US", {
    month: "long",
  });
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Build calendar grid cells (leading empty + days)
  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete final week
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const planByDate = plan.reduce<Record<number, BlogPlan>>((acc, p) => {
    const parts = p.date.split("-");
    const day = parseInt(parts[2], 10);
    if (!isNaN(day)) {
      acc[day] = p;
    }
    return acc;
  }, {});

  const todayDay =
    today.getMonth() + 1 === currentMonth && today.getFullYear() === currentYear
      ? today.getDate()
      : null;

  const weeks = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    weeks.push(calendarCells.slice(i, i + 7));
  }

  return (
    <div className="flex flex-1 flex-col gap-3 min-h-0 overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 rounded-xl bg-white p-3 shadow-sm border border-neutral-200/80">
        <div className="flex items-center gap-3">
          {/* Month Nav */}
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-100 transition"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4 text-neutral-600" />
            </button>
            <h2 className="min-w-[150px] text-center text-sm font-bold text-neutral-900">
              {monthName} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-100 transition"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4 text-neutral-600" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="h-8 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition"
          >
            Today
          </button>

          {isLoadingDb && (
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Syncing...</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {plan.length > 0 && (
            <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {plan.length} posts planned
            </span>
          )}

          {/* Auto-Publish Status & Control Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsAutoPublishModalOpen(true);
                fetchAutoPublishState();
              }}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs border ${
                isTestTimerRunning
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-800 hover:bg-amber-500/20"
                  : isProductionScheduleRunning
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 hover:bg-emerald-500/20"
                  : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
              }`}
              title="Configure Automatic Blog Publishing"
            >
              {isTestTimerRunning ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <Timer className="h-3.5 w-3.5 text-amber-600" />
                  <span className="font-extrabold text-amber-800">1-Min Test:</span>
                  <span className="rounded-md bg-amber-600 px-1.5 py-0.5 text-[10px] text-white font-mono font-bold">
                    {formatCountdown(countdownSeconds)}
                  </span>
                </>
              ) : isProductionScheduleRunning ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Zap className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="hidden md:inline">Auto-Publish:</span>
                  <span className="text-emerald-700 font-extrabold">Active</span>
                  <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] text-white font-mono font-normal">
                    {formatCountdown(countdownSeconds)}
                  </span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Auto-Publish</span>
                  <span className="rounded-md bg-neutral-200 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600">
                    Off
                  </span>
                </>
              )}
            </button>

            {/* Quick Cancel Button on Top Bar when Test Timer is actively running */}
            {isTestTimerRunning && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelTestTimer();
                }}
                disabled={isUpdatingConfig}
                className="flex items-center gap-1 rounded-xl bg-rose-50 border border-rose-200 px-2.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
                title="Stop Test Timer Immediately"
              >
                <Square className="h-3 w-3 fill-current" />
                <span>Stop</span>
              </button>
            )}
          </div>

          {isPastMonth ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-500 cursor-not-allowed">
              <Clock className="h-3.5 w-3.5 text-neutral-400" />
              <span>Past Month (Generation Disabled)</span>
            </div>
          ) : (
            <button
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60 transition"
              title={
                isCurrentMonth
                  ? "Generates topics for today and remaining days this month"
                  : "Generates daily topics for this month"
              }
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  {plan.length > 0
                    ? isCurrentMonth
                      ? "Regenerate Upcoming Days"
                      : "Regenerate Plan"
                    : isCurrentMonth
                    ? "Generate Plan (Today & Upcoming)"
                    : "Generate AI Plan"}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-neutral-200 shrink-0 bg-neutral-50/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-neutral-500"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="flex-1 overflow-y-auto min-h-0 relative">
          {/* Empty state notice */}
          {plan.length === 0 && !isGenerating && !isLoadingDb && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 bg-white/60 backdrop-blur-[2px]">
              <CalendarDays className="h-12 w-12 text-neutral-400 mb-3" />
              <p className="text-base font-bold text-neutral-700">No plan yet for this month</p>
              <p className="text-sm font-medium text-neutral-500 mt-1">
                {isPastMonth
                  ? "This month is in the past."
                  : 'Click "Generate AI Plan" to generate topics for current and upcoming days.'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-7 h-full">
            {weeks.map((week, wi) =>
              week.map((day, di) => {
                const blog = day ? planByDate[day] : undefined;
                const isToday = day === todayDay;
                const isPast = day ? isDayInPast(day) : false;

                return (
                  <div
                    key={`${wi}-${di}`}
                    className={`min-h-[110px] border-b border-r border-neutral-100 p-2 flex flex-col gap-1.5 transition-colors ${
                      day
                        ? isPast
                          ? "bg-neutral-50/50 hover:bg-neutral-100/50 cursor-pointer"
                          : "hover:bg-neutral-50/70 cursor-pointer bg-white"
                        : "bg-neutral-50/20"
                    } ${di === 6 ? "border-r-0" : ""}`}
                    onClick={() => {
                      if (blog) {
                        setSelectedDay(blog);
                        setIsEditingKeywords(false);
                        setIsEditingTopic(false);
                        setEditingKeywordsValue(blog.keywords?.join(", ") || "");
                        setEditingTopicValue(blog.topic || "");
                      }
                    }}
                  >
                    {day && (
                      <>
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold leading-none ${
                              isToday
                                ? "bg-emerald-600 text-white font-bold ring-2 ring-emerald-300"
                                : isPast
                                ? "text-neutral-400 font-medium"
                                : "text-neutral-700 font-semibold"
                            }`}
                          >
                            {day}
                          </span>

                          {isToday && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.2">
                              Today
                            </span>
                          )}
                        </div>

                        {blog ? (
                          <div className="flex flex-col gap-1 flex-1">
                            <p
                              className={`text-[11px] font-semibold leading-snug line-clamp-2 ${
                                isPast ? "text-neutral-600" : "text-neutral-900"
                              }`}
                            >
                              {blog.topic}
                            </p>
                            <div className="flex items-center gap-1 flex-wrap mt-auto">
                              {blog.searchVolume && (
                                <span className="flex items-center gap-0.5 text-[10px] text-neutral-500">
                                  <TrendingUp className="h-2.5 w-2.5" />
                                  {blog.searchVolume}
                                </span>
                              )}
                            </div>
                            <span
                              className={`self-start rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide border ${
                                blog.status === "generated"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : "bg-neutral-100 text-neutral-600 border-neutral-200"
                              }`}
                            >
                              {blog.status === "generated" ? "Generated" : "Planned"}
                            </span>
                          </div>
                        ) : (
                          isGenerating &&
                          !isPast && (
                            <div className="flex-1 animate-pulse rounded-lg bg-emerald-50/60 border border-emerald-100 h-10" />
                          )
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Blog Detail Side Panel */}
      {selectedDay && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="w-full max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${
                    TYPE_COLORS[selectedDay.type] || "bg-neutral-100 text-neutral-600 border-neutral-200"
                  }`}
                >
                  {selectedDay.type}
                </span>
                <p className="mt-2 text-xs font-medium text-neutral-500">
                  {new Date(selectedDay.date + "T12:00:00").toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!isEditingTopic ? (
              <div className="flex items-start justify-between gap-2 group">
                <h3 className="text-base font-bold text-neutral-900 leading-snug">
                  {selectedDay.topic}
                </h3>
                <button
                  onClick={() => {
                    setIsEditingTopic(true);
                    setEditingTopicValue(selectedDay.topic);
                  }}
                  className="shrink-0 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 transition underline"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <textarea
                  value={editingTopicValue}
                  onChange={(e) => setEditingTopicValue(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 p-2 text-sm font-bold text-neutral-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[60px] outline-none"
                  placeholder="Blog Title"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingTopic(false)}
                    className="rounded-md px-2 py-1 text-[10px] font-medium text-neutral-500 hover:bg-neutral-100 transition"
                    disabled={isSavingTopic}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTopic}
                    className="flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1 text-[10px] font-medium text-white hover:bg-emerald-700 transition w-12"
                    disabled={isSavingTopic}
                  >
                    {isSavingTopic ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                  </button>
                </div>
              </div>
            )}

            {selectedDay.searchVolume && (
              <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 p-3">
                <TrendingUp className="h-4 w-4 text-blue-500 shrink-0" />
                <div>
                  <p className="text-[11px] font-medium text-blue-700 uppercase tracking-wide">
                    Est. Search Volume
                  </p>
                  <p className="text-sm font-bold text-blue-900">{selectedDay.searchVolume}</p>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> Target Keywords
                </p>
                {!isEditingKeywords && (
                  <button
                    onClick={() => {
                      setIsEditingKeywords(true);
                      setEditingKeywordsValue(selectedDay.keywords?.join(", ") || "");
                    }}
                    className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 transition underline"
                  >
                    Edit
                  </button>
                )}
              </div>
              {!isEditingKeywords ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedDay.keywords?.length > 0 ? (
                    selectedDay.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-400 italic">No keywords set</span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editingKeywordsValue}
                    onChange={(e) => setEditingKeywordsValue(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 p-2 text-xs text-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[60px] outline-none"
                    placeholder="Comma-separated keywords"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingKeywords(false)}
                      className="rounded-md px-2 py-1 text-[10px] font-medium text-neutral-500 hover:bg-neutral-100 transition"
                      disabled={isSavingKeywords}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveKeywords}
                      className="flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1 text-[10px] font-medium text-white hover:bg-emerald-700 transition w-12"
                      disabled={isSavingKeywords}
                    >
                      {isSavingKeywords ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Status section & toggle */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-medium uppercase text-neutral-400">Status</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      selectedDay.status === "generated"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {selectedDay.status === "generated" && <CheckCircle2 className="h-3 w-3" />}
                    {selectedDay.status === "generated" ? "Generated" : "Planned"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleToggleStatus}
                disabled={isUpdatingStatus}
                className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition"
              >
                {isUpdatingStatus ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : selectedDay.status === "generated" ? (
                  "Mark as Planned"
                ) : (
                  "Mark as Generated"
                )}
              </button>
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <button
                onClick={() => {
                  window.location.href = `/admin/blog-generator?topic=${encodeURIComponent(
                    selectedDay.topic
                  )}&keywords=${encodeURIComponent(selectedDay.keywords?.join(", ") || "")}`;
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20"
              >
                <Sparkles className="h-4 w-4" />
                Generate This Blog Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Publish Settings & Management Modal */}
      {isAutoPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/70 backdrop-blur-md transition-all duration-300">
          <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/80 px-6 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900">Auto-Publish Settings</h3>
                    {isTestTimerRunning ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                        1-Min Test Active
                      </span>
                    ) : isProductionScheduleRunning ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Schedule Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-neutral-200 text-neutral-700 px-2.5 py-0.5 text-[10px] font-bold">
                        Idle / Standby
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Autonomous calendar-driven AI writing, evidence tables &amp; live publishing.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAutoPublishModalOpen(false)}
                className="rounded-2xl p-2 text-neutral-400 hover:bg-neutral-200/60 hover:text-neutral-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-neutral-100 bg-neutral-50/50 px-6 pt-2 shrink-0">
              <button
                onClick={() => {
                  setModalTab("test");
                  setModalFeedback(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                  modalTab === "test"
                    ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                1-Minute Test Mode
                {isTestTimerRunning && (
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </button>
              <button
                onClick={() => {
                  setModalTab("schedule");
                  setModalFeedback(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                  modalTab === "schedule"
                    ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                Production Schedule
                {isProductionScheduleRunning && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </button>
              <button
                onClick={() => {
                  setModalTab("logs");
                  setModalFeedback(null);
                  fetchAutoPublishState();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                  modalTab === "logs"
                    ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <History className="h-3.5 w-3.5" />
                Activity Logs
                {autoPublishConfig?.logs && autoPublishConfig.logs.length > 0 && (
                  <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] text-neutral-700 font-mono font-bold">
                    {autoPublishConfig.logs.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setModalTab("terminal");
                  setModalFeedback(null);
                  fetchTerminalLogs();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                  modalTab === "terminal"
                    ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                Terminal Logs
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status/Feedback banner */}
              {modalFeedback && (
                <div
                  className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-medium border animate-in fade-in duration-150 ${
                    modalFeedback.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : modalFeedback.type === "error"
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : "bg-blue-50 border-blue-200 text-blue-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {modalFeedback.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : modalFeedback.type === "error" ? (
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                    )}
                    <span>{modalFeedback.message}</span>
                  </div>
                  <button
                    onClick={() => setModalFeedback(null)}
                    className="text-neutral-400 hover:text-neutral-700 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* TAB 1: 1-MINUTE LIVE TEST */}
              {modalTab === "test" && (
                <div className="space-y-5">
                  {/* HERO TEST TIMER DISPLAY CARD */}
                  <div
                    className={`rounded-3xl border p-6 transition-all text-center relative overflow-hidden ${
                      isTestTimerRunning
                        ? "border-amber-300 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 shadow-lg shadow-amber-500/10"
                        : "border-neutral-200 bg-gradient-to-b from-neutral-50/80 via-white to-neutral-50/40 shadow-xs"
                    }`}
                  >
                    {/* Status Pill */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-2">
                      {isTestTimerRunning ? (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                          Testing Timer Active • Auto-Generates at 00:00
                        </span>
                      ) : (
                        <span className="bg-neutral-100 text-neutral-600 border border-neutral-200 px-3 py-1 rounded-full">
                          Test Mode • Standby (Ready)
                        </span>
                      )}
                    </div>

                    {/* Big Countdown Digits */}
                    <div
                      className={`text-5xl sm:text-6xl font-black font-mono tracking-tight my-2 ${
                        isTestTimerRunning ? "text-amber-950" : "text-neutral-300"
                      }`}
                    >
                      {isTestTimerRunning ? formatCountdown(countdownSeconds) : "01:00"}
                    </div>

                    {/* Progress Bar */}
                    <div className="max-w-md mx-auto h-2 rounded-full bg-neutral-100 overflow-hidden my-3 border border-neutral-200/60">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          isTestTimerRunning
                            ? "bg-gradient-to-r from-amber-500 to-emerald-500"
                            : "bg-neutral-200 w-0"
                        }`}
                        style={{
                          width: isTestTimerRunning
                            ? `${Math.min(100, Math.max(0, ((60 - countdownSeconds) / 60) * 100))}%`
                            : "0%",
                        }}
                      />
                    </div>

                    <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                      {isTestTimerRunning
                        ? `Auto-publish countdown is running. In ${countdownSeconds} seconds, the next planned topic will be written with Gemini and published live.`
                        : "Test the automated publishing pipeline with a real 60-second countdown. The timer only starts when you click the button below, and you can stop or cancel anytime."}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-5 flex items-center justify-center flex-wrap gap-3">
                      {isTestTimerRunning ? (
                        <>
                          {/* STOP / CANCEL BUTTON */}
                          <button
                            onClick={handleCancelTestTimer}
                            disabled={isUpdatingConfig}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-extrabold text-white hover:bg-rose-700 transition shadow-lg shadow-rose-600/25 active:scale-[0.98] cursor-pointer"
                          >
                            <Square className="h-4 w-4 fill-current" />
                            Stop / Cancel Test Timer
                          </button>

                          {/* SKIP WAIT & PUBLISH NOW */}
                          <button
                            onClick={handleTriggerAutoPublish}
                            disabled={isTriggeringNow}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20 active:scale-[0.98] cursor-pointer"
                          >
                            {isTriggeringNow ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Publishing...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4" />
                                Skip Wait &amp; Publish Now
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <>
                          {/* START 1-MIN TEST TIMER BUTTON */}
                          <button
                            onClick={handleStartTestTimer}
                            disabled={isUpdatingConfig}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3.5 text-sm font-extrabold text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/25 active:scale-[0.98] cursor-pointer"
                          >
                            {isUpdatingConfig ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Starting...
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 fill-current" />
                                Start 1-Min Test Timer
                              </>
                            )}
                          </button>

                          {/* INSTANT PUBLISH BYPASS */}
                          <button
                            onClick={handleTriggerAutoPublish}
                            disabled={isTriggeringNow}
                            className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 px-5 py-3.5 text-sm font-bold text-neutral-800 transition active:scale-[0.98] shadow-xs cursor-pointer"
                          >
                            {isTriggeringNow ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating with AI...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4 text-emerald-600" />
                                Run Now (Instant Test)
                              </>
                            )}
                          </button>

                          {/* TEST EMAIL BUTTON */}
                          <button
                            onClick={handleTestEmail}
                            disabled={isSendingTestEmail}
                            className="flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 hover:bg-blue-100 px-5 py-3.5 text-sm font-bold text-blue-800 transition active:scale-[0.98] shadow-xs cursor-pointer"
                          >
                            {isSendingTestEmail ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Mail className="h-4 w-4 text-blue-600" />
                                Send Test Email
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* NEXT IN QUEUE PREVIEW */}
                  <div className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                        Next Topic in Calendar Queue
                      </span>
                      {nextPlannedPost && (
                        <span className="text-[11px] font-mono font-medium text-neutral-600 bg-white px-2.5 py-0.5 rounded-full border border-neutral-200">
                          Date: {nextPlannedPost.date}
                        </span>
                      )}
                    </div>

                    {nextPlannedPost ? (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                          {nextPlannedPost.topic}
                        </h4>
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                            {nextPlannedPost.type}
                          </span>
                          {nextPlannedPost.keywords?.map((kw, i) => (
                            <span
                              key={i}
                              className="text-[11px] text-neutral-600 bg-white px-2.5 py-0.5 rounded-md border border-neutral-200/80"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-200/70">
                          ✨ Will be created with 3 evidence-backed comparison tables, green headings, authoritative calibrated tone, and synchronized directly to Supabase.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-xs text-neutral-500">
                        <p>No ungenerated calendar items found in upcoming months.</p>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          Use the &quot;Generate AI Plan&quot; button in the calendar to add new topics.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTION SCHEDULE */}
              {modalTab === "schedule" && (
                <div className="space-y-5">
                  {/* Status Banner */}
                  <div
                    className={`rounded-2xl border p-4 flex items-center justify-between gap-4 ${
                      isProductionScheduleRunning
                        ? "border-emerald-300 bg-emerald-50/50"
                        : "border-neutral-200 bg-neutral-50/60"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">
                        {isProductionScheduleRunning
                          ? "Production Schedule is Active"
                          : "Production Schedule is Paused"}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {isProductionScheduleRunning
                          ? `Publishing automatically every ${
                              selectedProductionFreq === "daily"
                                ? `day at ${dailyTimeInput}`
                                : selectedProductionFreq
                            }. Next run in: ${formatCountdown(countdownSeconds)}.`
                          : "Choose your desired cadence below and activate."}
                      </p>
                    </div>

                    {isProductionScheduleRunning ? (
                      <button
                        onClick={() => handleSaveProductionSchedule(false)}
                        disabled={isUpdatingConfig}
                        className="rounded-xl border border-rose-300 bg-white px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 transition shrink-0 cursor-pointer"
                      >
                        Pause Schedule
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveProductionSchedule(true)}
                        disabled={isUpdatingConfig}
                        className="rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shrink-0 shadow-xs cursor-pointer"
                      >
                        Activate Schedule
                      </button>
                    )}
                  </div>

                  {/* Frequency Cards */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-3">
                      Select Publishing Cadence
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Every 6 Hours */}
                      <div
                        onClick={() => setSelectedProductionFreq("6h")}
                        className={`cursor-pointer rounded-2xl border p-4 transition flex flex-col justify-between ${
                          selectedProductionFreq === "6h"
                            ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                            : "border-neutral-200 hover:border-neutral-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900">Every 6 Hours</span>
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              selectedProductionFreq === "6h"
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-neutral-300"
                            }`}
                          >
                            {selectedProductionFreq === "6h" && <Check className="h-2.5 w-2.5" />}
                          </div>
                        </div>
                        <span className="text-[11px] text-neutral-500 mt-1">4 articles per day</span>
                      </div>

                      {/* Every 12 Hours */}
                      <div
                        onClick={() => setSelectedProductionFreq("12h")}
                        className={`cursor-pointer rounded-2xl border p-4 transition flex flex-col justify-between ${
                          selectedProductionFreq === "12h"
                            ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                            : "border-neutral-200 hover:border-neutral-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900">Every 12 Hours</span>
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              selectedProductionFreq === "12h"
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-neutral-300"
                            }`}
                          >
                            {selectedProductionFreq === "12h" && <Check className="h-2.5 w-2.5" />}
                          </div>
                        </div>
                        <span className="text-[11px] text-neutral-500 mt-1">2 articles per day</span>
                      </div>

                      {/* Daily at Specific Time */}
                      <div
                        onClick={() => setSelectedProductionFreq("daily")}
                        className={`cursor-pointer rounded-2xl border p-4 transition flex flex-col justify-between ${
                          selectedProductionFreq === "daily"
                            ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                            : "border-neutral-200 hover:border-neutral-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900">Daily at Fixed Time</span>
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              selectedProductionFreq === "daily"
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-neutral-300"
                            }`}
                          >
                            {selectedProductionFreq === "daily" && <Check className="h-2.5 w-2.5" />}
                          </div>
                        </div>
                        <span className="text-[11px] text-neutral-500 mt-1">1 article every day</span>
                      </div>

                      {/* Every 24 Hours */}
                      <div
                        onClick={() => setSelectedProductionFreq("24h")}
                        className={`cursor-pointer rounded-2xl border p-4 transition flex flex-col justify-between ${
                          selectedProductionFreq === "24h"
                            ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                            : "border-neutral-200 hover:border-neutral-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900">Every 24 Hours</span>
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              selectedProductionFreq === "24h"
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-neutral-300"
                            }`}
                          >
                            {selectedProductionFreq === "24h" && <Check className="h-2.5 w-2.5" />}
                          </div>
                        </div>
                        <span className="text-[11px] text-neutral-500 mt-1">Rolling 24-hour cycle</span>
                      </div>
                    </div>

                    {/* Time Input when Daily is chosen */}
                    {selectedProductionFreq === "daily" && (
                      <div className="mt-4 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-neutral-800">Set Daily Publication Time:</span>
                          <p className="text-[11px] text-neutral-500">The blog will automatically generate at this exact time each day.</p>
                        </div>
                        <input
                          type="time"
                          value={dailyTimeInput}
                          onChange={(e) => setDailyTimeInput(e.target.value)}
                          className="rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-800 outline-none focus:border-emerald-500 shadow-xs"
                        />
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleSaveProductionSchedule(true)}
                        disabled={isUpdatingConfig}
                        className="flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition disabled:opacity-50 shadow-xs cursor-pointer"
                      >
                        {isUpdatingConfig ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Save &amp; Apply Schedule
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ACTIVITY LOGS */}
              {modalTab === "logs" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Auto-Publish History
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fetchAutoPublishState()}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-emerald-700 bg-neutral-100 hover:bg-neutral-200/80 px-2 py-0.5 rounded-md transition cursor-pointer"
                        title="Refresh Activity Logs"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Refresh
                      </button>
                      <span className="text-[11px] text-neutral-400">
                        {autoPublishConfig?.logs?.length || 0} total events
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden max-h-60 overflow-y-auto divide-y divide-neutral-100">
                    {autoPublishConfig?.logs && autoPublishConfig.logs.length > 0 ? (
                      autoPublishConfig.logs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-neutral-50/80 transition"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            {log.status === "success" ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-neutral-900 truncate">{log.topic}</p>
                              <p className="text-[10px] text-neutral-400">
                                {new Date(log.timestamp).toLocaleString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                })}
                              </p>
                            </div>
                          </div>

                          {log.slug && (
                            <Link
                              href={`/${log.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 shrink-0 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100"
                            >
                              View Live <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-xs text-neutral-400">
                        No articles published automatically yet. Run a 1-Minute Test to see activity here!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: TERMINAL LOGS */}
              {modalTab === "terminal" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Live Terminal Output
                    </span>
                    <button
                      onClick={() => fetchTerminalLogs()}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-emerald-700 bg-neutral-100 hover:bg-neutral-200/80 px-2 py-0.5 rounded-md transition cursor-pointer"
                      title="Refresh Terminal Logs"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Refresh
                    </button>
                  </div>
                  
                  <div className="rounded-2xl border border-neutral-700 bg-neutral-900 overflow-hidden shadow-inner flex flex-col h-72">
                    <pre 
                      ref={terminalRef}
                      className="p-4 text-[11px] text-emerald-400 font-mono whitespace-pre-wrap overflow-y-auto leading-relaxed flex-1 select-text"
                    >
                      {terminalLogs || "No logs available yet..."}
                    </pre>
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    Displays raw standard output from the backend auto-publish pipeline. Useful for tracking AI generation progress, errors, and system warnings.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 text-[11px] text-neutral-500 hidden sm:flex">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Calibrated Tone
                </span>
                <span>•</span>
                <span>3 GFM Tables</span>
                <span>•</span>
                <span>Supabase Live Sync</span>
              </div>
              <button
                onClick={() => setIsAutoPublishModalOpen(false)}
                className="rounded-xl border border-neutral-300 bg-white px-5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition shadow-xs cursor-pointer ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Auto-Publish Notification Toast */}
      {autoPublishToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md rounded-2xl bg-neutral-900 text-white p-4 shadow-2xl border border-neutral-700 flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">🎉 Blog Auto-Published!</h4>
            <p className="text-xs font-semibold text-white truncate mt-0.5">{autoPublishToast.title}</p>
            <div className="mt-2 flex items-center gap-3">
              <Link
                href={`/${autoPublishToast.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                View Live Article <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <button
            onClick={() => setAutoPublishToast(null)}
            className="text-neutral-400 hover:text-white p-1 rounded transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error popup */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <WifiOff className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-bold text-neutral-900">Notice</h3>
              <p className="text-sm text-neutral-500">{error}</p>
              <button
                onClick={() => setError("")}
                className="w-full rounded-xl bg-neutral-100 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
