import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";
// import { Header } from "@/components/common/Header"; 
// import { Footer } from "@/components/common/Footer";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  return (
    <div className="mx-auto flex">
      <DashboardNav userEmail={session.user.email ?? ""} userName={session.user.name ?? "Neighbor"} verified={!!session.user.identityVerified} />
      <main className="min-w-0 flex-1 animate-fade-in-up py-5 px-6">{children}</main>
    </div>
  );
}