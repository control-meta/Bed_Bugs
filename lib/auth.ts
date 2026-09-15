import crypto from "crypto";
export { SESSION_COOKIE_NAME, createAdminToken, verifyAdminToken } from "./session";

// ==============================================================================
// Brute Force & Rate Limit Protection for Admin Login
// ==============================================================================
type LoginAttempt = {
  count: number;
  lockedUntil?: number;
};

const loginAttempts = new Map<string, LoginAttempt>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkLoginLockout(ip: string): {
  isLocked: boolean;
  remainingMinutes?: number;
} {
  const attempt = loginAttempts.get(ip);
  if (!attempt) return { isLocked: false };

  if (attempt.lockedUntil && attempt.lockedUntil > Date.now()) {
    const remainingMs = attempt.lockedUntil - Date.now();
    return {
      isLocked: true,
      remainingMinutes: Math.ceil(remainingMs / (60 * 1000)),
    };
  }

  // Lockout expired, reset
  if (attempt.lockedUntil && attempt.lockedUntil <= Date.now()) {
    loginAttempts.delete(ip);
  }

  return { isLocked: false };
}

export function recordFailedLogin(ip: string): {
  isNowLocked: boolean;
  remainingAttempts: number;
} {
  const current = loginAttempts.get(ip) || { count: 0 };
  current.count += 1;

  if (current.count >= MAX_FAILED_ATTEMPTS) {
    current.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    loginAttempts.set(ip, current);
    return { isNowLocked: true, remainingAttempts: 0 };
  }

  loginAttempts.set(ip, current);
  return {
    isNowLocked: false,
    remainingAttempts: MAX_FAILED_ATTEMPTS - current.count,
  };
}

export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

// ==============================================================================
// Timing-Safe Credential Verification
// ==============================================================================
function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      // Execute dummy timing compare to prevent length timing leakage
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function verifyAdminCredentials(
  usernameInput: string,
  passwordInput: string,
): boolean {
  const configuredUsername = process.env.ADMIN_USERNAME || "admin";
  const configuredPassword = process.env.ADMIN_PASSWORD || "admin123456";

  const isUsernameMatch = timingSafeCompare(usernameInput.trim(), configuredUsername);
  const isPasswordMatch = timingSafeCompare(passwordInput, configuredPassword);

  return isUsernameMatch && isPasswordMatch;
}


