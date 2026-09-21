"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (<span className="h-8 w-20 animate-pulse rounded-full bg-muted-light" aria-hidden />);
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover transition-colors">
          Dashboard
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted hover:text-danger transition-colors sm:block">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
        Sign in
      </Link>
      <Link href="/register" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
        Join
      </Link>
    </div>
  );
}