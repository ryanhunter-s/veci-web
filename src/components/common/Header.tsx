import AuthButton from "@/components/AuthButton";
import { FullLogo } from "@/components/Logo";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <nav className="flex items-center mx-auto justify-between px-4 py-3 sm:px-6 lg:px-8 max-w-[1400px]">
        <Link href="/" className="transition-opacity sm:h-12">
          <FullLogo />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/jobs" className="hidden text-sm font-medium text-muted hover:text-foreground transition-colors sm:block">
            Jobs
          </Link>
          <Link href="/new" className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors sm:block">
            Ask for help
          </Link>
          <AuthButton />
        </div>
      </nav>
    </header>
  );
}