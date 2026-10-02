import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import OtpVerifyForm from "@/components/OtpVerifyForm";
import { maskEmail } from "@/utils/format";

export default async function EmailVerifiedPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/emailVerified");
  }

  return (
    <OtpVerifyForm
      userId={session.user.id}
      channel="email"
      target={maskEmail(session.user.email ?? "")}
      nextPath="/phoneVerified"
    />
  );
}
