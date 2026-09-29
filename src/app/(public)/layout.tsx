import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="relative z-1">
        <Header />
      </div>
      <div className="min-h-[calc(100vh-151px)] sm:min-h-[calc(100vh-181px)]">
        <main className="w-full">
          {children}
        </main>
      </div>
      <div className="relative z-1">
        <Footer />
      </div>
    </>
  );
}
