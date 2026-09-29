import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Header } from "@/components/common/Header"; 
import { Footer } from "@/components/common/Footer";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  return (
    <>
      <div className="relative z-1">
        <Header />
      </div>
      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <DashboardNav
          userEmail={session.user.email ?? ""}
          userName={session.user.name ?? "Neighbor"}
          verified={!!session.user.identityVerified}
        />
        <main className="min-w-0 flex-1 animate-fade-in-up">{children}</main>
      </div>
      <div className="relative z-1">
        <Footer />
      </div>
    </>
  );
}