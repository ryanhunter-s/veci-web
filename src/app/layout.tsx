import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Providers from "@/components/Providers";
import AuthButton from "@/components/AuthButton";
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
    default: "Veci - Ayuda entre vecinos",
    template: "%s | Veci",
  },
  description:
    "Plataforma de ayuda comunitaria. Pide ayuda o ofrece tu tiempo a tus vecinos en tu colonia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold text-foreground"
              >
                <span className="text-2xl">🏘️</span> Veci
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/explorar"
                  className="hidden text-sm font-medium text-muted hover:text-foreground transition-colors sm:block"
                >
                  Explorar
                </Link>
                <Link
                  href="/nueva"
                  className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors sm:block"
                >
                  Pedir ayuda
                </Link>
                <AuthButton />
              </div>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-border bg-card">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <span className="text-xl">🏘️</span> Veci
                </div>
                <p className="text-sm text-muted">
                  Ayuda entre vecinos &middot; {new Date().getFullYear()}
                </p>
                <div className="flex gap-4 text-sm text-muted">
                  <Link href="/explorar" className="hover:text-foreground transition-colors">
                    Explorar
                  </Link>
                  <Link href="/nueva" className="hover:text-foreground transition-colors">
                    Pedir ayuda
                  </Link>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Iniciar sesión
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