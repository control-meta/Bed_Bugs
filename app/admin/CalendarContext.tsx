"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type BlogPlan = {
  date: string;
  topic: string;
  keywords: string[];
  searchVolume: string;
  type: "how-to" | "guide" | "list" | "comparison" | "local" | "educational";
  status?: "planned" | "generated";
};

type CalendarContextType = {
  isGenerating: boolean;
  error: string;
  generatePlan: (month: number, year: number) => Promise<void>;
  setError: (err: string) => void;
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const STORAGE_KEY = "bedbug_content_calendar";

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const generatePlan = async (month: number, year: number) => {
    setIsGenerating(true);
    setError("");

    try {
      const statusRes = await fetch("/api/admin/blog/status");
      const statusData = await statusRes.json();
      if (!statusData.apiKeySet) {
        setError("OpenAI API key is not set. Add OPENAI_API_KEY to your .env.local file.");
        setIsGenerating(false);
        return;
      }
    } catch {}

    try {
      const res = await fetch("/api/admin/calendar/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate plan");
      }

      const data = await res.json();
      const updatedPlan = data.plan || [];

      // Cache it locally for snappy navigation
      const storageKey = `${STORAGE_KEY}_${year}_${month}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedPlan));

      // Dispatch custom event for CalendarPage to update immediately
      window.dispatchEvent(
        new CustomEvent("calendar-plan-generated", {
          detail: { month, year, plan: updatedPlan, isSupabase: data.isSupabase },
        })
      );

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <CalendarContext.Provider value={{ isGenerating, error, generatePlan, setError }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendarContext must be used within a CalendarProvider");
  }
  return context;
}
