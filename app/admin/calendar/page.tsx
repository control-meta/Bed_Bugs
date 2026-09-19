"use client";

import { useState, useEffect } from "react";
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
  Database,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useCalendarContext, BlogPlan } from "../CalendarContext";

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

          {/* Database indicator pill */}
          {isSupabase !== null && (
            <span
              className={`hidden md:inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                isSupabase
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
              title={isSupabase ? "Saved to Supabase content_calendar" : "Saved to local JSON store"}
            >
              <Database className="h-3 w-3" />
              <span>{isSupabase ? "Supabase DB" : "Local Store"}</span>
            </span>
          )}

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
                    onClick={() => blog && setSelectedDay(blog)}
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

            <h3 className="text-base font-bold text-neutral-900 leading-snug">
              {selectedDay.topic}
            </h3>

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

            {selectedDay.keywords?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-neutral-700 mb-2 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> Target Keywords
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDay.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
