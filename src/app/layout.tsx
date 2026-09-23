import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Providers from "@/components/Providers";
import AuthButton from "@/components/AuthButton";
import { FullLogo } from "@/components/Logo";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Veci - Neighborly help",
    template: "%s | Veci",
  },
  description: "Community help platform. Ask for help or offer your time to your neighbors in your neighborhood.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
            <nav className="flex items-center mx-auto justify-between px-4 py-3 sm:px-6 lg:px-8 max-w-[1400px]">
              <Link href="/" className="transition-opacity sm:h-12">
                <FullLogo />
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/jobs" className="hidden text-sm font-medium text-muted hover:text-foreground transition-colors sm:block">
                  Jobs
                </Link>
                <Link href="/workers" className="hidden text-sm font-medium text-muted hover:text-foreground transition-colors sm:block">
                  Workers
                </Link>
                <Link href="/new" className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors sm:block">
                  Ask for help
                </Link>
                <AuthButton />
              </div>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

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
        </Providers>
      </body>
    </html>
  );
}