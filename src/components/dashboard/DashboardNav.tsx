"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Logo from "@/components/Logo";
import {
  LayoutDashboard,
  Wrench,
  MessageSquare,
  MessagesSquare,
  Settings,
  LogOut,
  BadgeCheck,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/jobs", label: "Jobs", icon: Wrench, exact: false },
  { href: "/dashboard/comments", label: "Comments", icon: MessageSquare, exact: false },
  { href: "/dashboard/chats", label: "Chats", icon: MessagesSquare, exact: false },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
];

export default function DashboardNav({
  userName,
  userEmail,
  verified = false,
}: {
  userName: string;
  userEmail: string;
  verified?: boolean;
}) {
  const pathname = usePathname();

  function isActive(item: (typeof navItems)[number]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <Link
          href="/"
          className="flex items-center gap-2 border-b border-border px-5 py-4 text-lg font-bold text-foreground transition-opacity hover:opacity-80"
        >
          <Logo />
        </Link>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="px-4 pb-2 pt-2 text-xs font-semibold tracking-wider text-muted uppercase">
            Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-primary-light text-primary"
                      : "text-muted hover:bg-muted-light hover:text-foreground"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-all ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Icon
                    className={`h-[18px] w-[18px] transition-colors ${
                      active ? "text-primary" : "text-muted group-hover:text-foreground"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-base font-bold text-white">
              {userName.charAt(0).toUpperCase().trim() || "?"}
              {verified && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-success text-white">
                  <BadgeCheck className="h-3 w-3" />
                </span>
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{userName}</p>
              <p className="truncate text-xs text-muted">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger hover:border-danger/30"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <nav className="sticky top-[57px] z-30 flex gap-2 overflow-x-auto border-b border-border bg-card px-4 py-2.5 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "bg-muted-light text-muted hover:bg-border"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}