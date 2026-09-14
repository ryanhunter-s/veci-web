"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Resumen", icon: "📊", exact: true },
  { href: "/dashboard/trabajos", label: "Trabajos", icon: "🔧" },
  { href: "/dashboard/comentarios", label: "Comentarios", icon: "💬" },
  { href: "/dashboard/chats", label: "Chats", icon: "💭" },
  { href: "/dashboard/configuracion", label: "Configuración", icon: "⚙️" },
];

export default function DashboardNav({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <a
          href="/"
          className="flex items-center gap-2 border-b border-border px-5 py-4 text-lg font-bold text-foreground"
        >
          <span>🏘️</span> Veci
        </a>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-light text-primary"
                    : "text-muted hover:bg-muted-light hover:text-foreground"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-lg">
              {userName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{userName}</p>
              <p className="truncate text-xs text-muted">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-4 w-full rounded-full border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-card-hover hover:text-foreground transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <nav className="sticky top-[57px] z-30 flex gap-2 overflow-x-auto border-b border-border bg-card px-4 py-2 lg:hidden">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "bg-muted-light text-muted hover:bg-border"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}