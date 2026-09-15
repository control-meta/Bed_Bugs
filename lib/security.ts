import { NextRequest } from "next/server";

// ==============================================================================
// Public Enquiry Rate Limiter
// Prevents bot spam by capping submissions to 5 per minute per IP.
// ==============================================================================
type RateLimitRecord = {
  timestamps: number[];
};

const submissionRateLimits = new Map<string, RateLimitRecord>();
const SUBMISSION_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 5;

export function checkSubmissionRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = submissionRateLimits.get(ip) || { timestamps: [] };

  // Filter timestamps within the last minute
  record.timestamps = record.timestamps.filter(
    (time) => now - time < SUBMISSION_WINDOW_MS,
  );

  if (record.timestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.ceil(
      (oldest + SUBMISSION_WINDOW_MS - now) / 1000,
    );
    return { allowed: false, retryAfterSeconds };
  }

  record.timestamps.push(now);
  submissionRateLimits.set(ip, record);
  return { allowed: true };
}

// Clean up stale IP records every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of submissionRateLimits.entries()) {
      record.timestamps = record.timestamps.filter(
        (time) => now - time < SUBMISSION_WINDOW_MS,
      );
      if (record.timestamps.length === 0) {
        submissionRateLimits.delete(ip);
      }
    }
  }, 10 * 60 * 1000);
}

// ==============================================================================
// Input Sanitization & Validation
// ==============================================================================
export function sanitizeString(
  input: unknown,
  maxLength: number = 500,
): string {
  if (typeof input !== "string") return "";
  // Strip HTML / script tags and control characters
  return input
    .replace(/<[^>]*>?/gm, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function validateIndianMobile(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  // Must be 10 digits and start with 6, 7, 8, or 9
  return /^[6-9]\d{9}$/.test(cleaned);
}

export function isHoneypotTriggered(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
