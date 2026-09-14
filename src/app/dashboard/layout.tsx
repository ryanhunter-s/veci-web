import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardNav
        userName={session.user.name ?? "Vecino"}
        userEmail={session.user.email ?? ""}
      />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}