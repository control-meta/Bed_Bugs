"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please provide both username and password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Successful login - hard navigate to ensure all cookies and session state are recognized
      window.location.href = redirect;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to log in. Please retry.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#f4f7f5] p-4 font-sans">
      {/* Subtle clean background decorative accents */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-emerald-600/10 blur-[100px]" />

      {/* Login Card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-neutral-900/5">
        {/* Top Header */}
        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-800">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span>Admin Gateway</span>
          </div>

          <h1 className="mt-2.5 font-display text-xl font-bold tracking-tight text-neutral-900">
            Control Portal
          </h1>
          <p className="mt-1 text-xs text-neutral-500">
            Sign in to manage bed bug treatment enquiries.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-5 space-y-3.5">
          <div>
            <label
              htmlFor="username"
              className="block text-[11px] font-bold text-neutral-700 mb-1"
            >
              Admin Username / ID
            </label>
            <div className="relative flex items-center rounded-lg border border-neutral-200 bg-neutral-50/70 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/15">
              <span className="pointer-events-none pl-3 text-neutral-400">
                <User className="h-4 w-4" />
              </span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin ID"
                autoComplete="username"
                required
                className="w-full bg-transparent py-2 pl-2.5 pr-3 text-xs text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[11px] font-bold text-neutral-700 mb-1"
            >
              Password
            </label>
            <div className="relative flex items-center rounded-lg border border-neutral-200 bg-neutral-50/70 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/15">
              <span className="pointer-events-none pl-3 text-neutral-400">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                className="w-full bg-transparent py-2 pl-2.5 pr-9 text-xs text-neutral-900 outline-none placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 text-neutral-400 hover:text-neutral-700 transition"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-700/20 transition hover:bg-emerald-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Security Reassurance & Default Dev Info */}
        <div className="mt-5 border-t border-neutral-100 pt-3.5 text-center">
          <p className="text-[10.5px] text-neutral-500 font-medium">
            Default credentials: <span className="font-bold text-neutral-700">admin</span> / <span className="font-bold text-neutral-700">admin123456</span>
          </p>
          <p className="mt-1 text-[10px] text-neutral-400">
            🔒 Protected with Timing-Safe Verification &amp; Rate-Limiting.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f4f7f5] text-emerald-600">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
