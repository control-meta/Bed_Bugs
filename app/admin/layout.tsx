"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Inbox,
  LogOut,
  Menu,
  ShieldCheck,
  X,
  PenTool,
  CalendarDays,
} from "lucide-react";
import { CalendarProvider } from "./CalendarContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState<string>("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If on login page, render clean full-page login without dashboard chrome
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    {
      label: "Enquiries & Leads",
      href: "/admin",
      icon: Inbox,
      active: pathname === "/admin",
    },
    {
      label: "Blog Generator",
      href: "/admin/blog-generator",
      icon: PenTool,
      active: pathname === "/admin/blog-generator",
    },
    {
      label: "Content Calendar",
      href: "/admin/calendar",
      icon: CalendarDays,
      active: pathname === "/admin/calendar",
    },
  ];

  return (
    <div
      id="admin-root"
      data-admin-portal="true"
      className="flex h-screen w-screen overflow-hidden bg-[#f4f7f5] text-neutral-800 font-sans text-xs"
    >
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-neutral-200/90 bg-white shadow-sm transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-neutral-200/80 px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-700/20">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-xs font-bold tracking-tight text-neutral-900">
                BedBug Admin
              </h2>
              <span className="text-[10px] font-semibold text-emerald-600 block leading-tight">
                Control Center
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 space-y-1 p-3">
          <p className="px-2.5 text-[9.5px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Modules
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  item.active
                    ? "bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/80 shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    item.active
                      ? "text-emerald-700"
                      : "text-neutral-400 group-hover:text-neutral-700"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-neutral-200/80 p-3">
          <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-2.5 border border-neutral-200/80">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                AD
              </div>
              <div className="truncate">
                <p className="truncate text-xs font-semibold text-neutral-900 leading-tight">
                  Admin User
                </p>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Logout"
              title="Logout"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-500 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Strict 100vh viewport, no window scroll) */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Compact Top Navigation Bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200/80 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              className="rounded-lg border border-neutral-200 p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <h1 className="font-display text-sm sm:text-base font-bold text-neutral-900 tracking-tight leading-none">
                {pathname === "/admin/blog-generator"
                  ? "AI Blog Writer"
                  : pathname === "/admin/calendar"
                  ? "Content Calendar"
                  : "Customer Enquiries & Leads"}
              </h1>
              <p className="hidden text-[11px] text-neutral-500 sm:block mt-0.5">
                {pathname === "/admin/blog-generator"
                  ? "Generate SEO-optimized blog content with AI"
                  : pathname === "/admin/calendar"
                  ? "AI-planned monthly content schedule for your website"
                  : "Centralized leads from Homepage, Contact Page & Floating Widget"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {timeStr && (
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200/80 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-700">
                <Clock className="h-3 w-3 text-emerald-600" />
                <span>{timeStr}</span>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Viewport - Contains all cards and table with internal scroll */}
        <main className="flex-1 overflow-hidden p-3.5 sm:p-4 flex flex-col">
          <CalendarProvider>
            {children}
          </CalendarProvider>
        </main>
      </div>
    </div>
  );
}
