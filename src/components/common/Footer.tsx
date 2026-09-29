import { FullLogo } from "@/components/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="px-4 py-8 sm:px-6 lg:px-8 mx-auto max-w-[1400px]">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="transition-opacity hover:opacity-80 sm:h-12" aria-label="Veci home">
            <FullLogo />
          </Link>
          <p className="text-sm text-muted">
            Neighborly help &middot; {new Date().getFullYear()}
          </p>
          <div className="flex gap-4 text-sm text-muted">
            <Link href="/jobs" className="hover:text-foreground transition-colors">
              Jobs
            </Link>
            <Link href="/workers" className="hover:text-foreground transition-colors">
              Workers
            </Link>
            <Link href="/new" className="hover:text-foreground transition-colors">
              Ask for help
            </Link>
            <Link href="/auth/login" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}