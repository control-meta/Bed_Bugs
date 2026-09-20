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
  MessageSquare,
  Globe,
  SearchCheck,
  ChevronLeft,
  ChevronRight,
  BookOpen,
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [timeStr, setTimeStr] = useState<string>("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If on login page, render clean full-page login without dashboard chrome
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_sidebar_collapsed");
      if (stored !== null) {
        setIsCollapsed(stored === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleSidebar = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    try {
      localStorage.setItem("admin_sidebar_collapsed", String(next));
    } catch {
      // ignore
    }
  };

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
      window.location.href = "/admin/login";
    } catch {
      window.location.href = "/admin/login";
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
      label: "Edit Blogs",
      href: "/admin/edit-blogs",
      icon: BookOpen,
      active: pathname.startsWith("/admin/edit-blogs"),
    },
    {
      label: "Content Calendar",
      href: "/admin/calendar",
      icon: CalendarDays,
      active: pathname === "/admin/calendar",
    },
    {
      label: "Edit Pages",
      href: "/admin/edit-pages",
      icon: Globe,
      active: pathname.startsWith("/admin/edit-pages"),
    },
    {
      label: "Global SEO & Metadata",
      href: "/admin/seo",
      icon: SearchCheck,
      active: pathname.startsWith("/admin/seo"),
    },
    {
      label: "Customer Reviews",
      href: "/admin/reviews",
      icon: MessageSquare,
      active: pathname === "/admin/reviews",
    },
  ];

  const getHeaderInfo = (path: string) => {
    if (path === "/admin/blog-generator") {
      return {
        title: "AI Blog Writer",
        description: "Generate SEO-optimized blog content with AI",
      };
    }
    if (path.startsWith("/admin/edit-blogs")) {
      return {
        title: "Edit Blogs Studio",
        description: "Manage, live-edit, regenerate, and preview all website blogs",
      };
    }
    if (path === "/admin/calendar") {
      return {
        title: "Content Calendar",
        description: "AI-planned monthly content schedule for your website",
      };
    }
    if (path.startsWith("/admin/edit-pages")) {
      return {
        title: "Live Page Studio",
        description: "Interactive visual page editor with live preview",
      };
    }
    if (path.startsWith("/admin/seo")) {
      return {
        title: "Global SEO & Metadata",
        description: "Manage page meta titles, descriptions, and image Alt text across the site",
      };
    }
    if (path === "/admin/reviews") {
      return {
        title: "Customer Reviews",
        description: "Manage and moderate reviews shown on your website",
      };
    }
    return {
      title: "Customer Enquiries & Leads",
      description: "Centralized leads from Homepage, Contact Page & Floating Widget",
    };
  };

  const headerInfo = getHeaderInfo(pathname);

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

      {/* Redesigned Sidebar Navigation with Expand/Collapse Arrow */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-neutral-200/90 bg-white shadow-xs transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-[72px]" : "lg:w-64"}`}
      >
        {/* Desktop Expand / Collapse Floating Arrow Button on Sidebar Edge */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3.5 top-4 z-50 hidden lg:flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 shadow-md hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title={isCollapsed ? "Expand sidebar (Arrow)" : "Collapse sidebar (Arrow)"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Brand Header */}
        <div
          className={`flex h-14 shrink-0 items-center border-b border-neutral-200/80 transition-all ${
            isCollapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          <Link
            href="/admin"
            className="flex items-center gap-2.5 overflow-hidden group"
            title="BedBug Admin Dashboard"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-sm shadow-emerald-700/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h2 className="font-display text-xs font-bold tracking-tight text-neutral-900 leading-tight">
                  BedBug Admin
                </h2>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 leading-tight">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Control Center
                </span>
              </div>
            )}
          </Link>
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
        <div className="flex-1 space-y-1.5 p-3 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && (
            <p className="px-2.5 text-[9.5px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Modules
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                title={item.label}
                className={`group relative flex items-center rounded-xl transition-all duration-150 ${
                  isCollapsed
                    ? "h-11 w-11 mx-auto justify-center"
                    : "gap-2.5 px-3 py-2 text-xs"
                } ${
                  item.active
                    ? "bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/90 shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900"
                }`}
              >
                {/* Active Left Indicator Bar */}
                {item.active && !isCollapsed && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-600" />
                )}

                <Icon
                  className={`h-4.5 w-4.5 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                    item.active
                      ? "text-emerald-700"
                      : "text-neutral-400 group-hover:text-neutral-700"
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Expand / Collapse Bar */}
        <div className="hidden lg:block px-2.5 py-1.5 border-t border-neutral-100">
          <button
            type="button"
            onClick={toggleSidebar}
            className={`w-full flex items-center rounded-xl py-2 text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer ${
              isCollapsed ? "justify-center px-0" : "gap-2.5 px-3"
            }`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-neutral-500 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 text-neutral-500 shrink-0" />
                <span className="truncate">Collapse sidebar</span>
              </>
            )}
          </button>
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-neutral-200/80 p-2.5 bg-white">
          <div
            className={`flex items-center rounded-xl bg-neutral-50/90 border border-neutral-200/80 transition-all ${
              isCollapsed ? "flex-col gap-2 p-1.5" : "justify-between p-2"
            }`}
          >
            <div className={`flex items-center overflow-hidden ${isCollapsed ? "justify-center" : "gap-2.5"}`}>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 text-[10px] font-bold text-white shadow-xs"
                title="Admin User (Authenticated)"
              >
                AD
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <p className="truncate text-xs font-semibold text-neutral-900 leading-tight">
                    Admin User
                  </p>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Logout"
              title="Logout"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-500 hover:bg-rose-50 hover:text-rose-600 transition disabled:opacity-50 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Strict 100vh viewport, no window scroll) */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 min-h-0">
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
                {headerInfo.title}
              </h1>
              <p className="hidden text-[11px] text-neutral-500 sm:block mt-0.5">
                {headerInfo.description}
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
        <main
          className={`flex-1 min-h-0 ${
            pathname === "/admin/edit-pages" || pathname.startsWith("/admin/edit-blogs/")
              ? "p-0 overflow-hidden flex flex-col"
              : pathname === "/admin/edit-blogs"
              ? "p-0 overflow-y-auto"
              : "p-3.5 sm:p-4 overflow-hidden flex flex-col"
          }`}
        >
          <CalendarProvider>
            {children}
          </CalendarProvider>
        </main>
      </div>
    </div>
  );
}
