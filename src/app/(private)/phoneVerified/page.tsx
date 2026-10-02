import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import OtpVerifyForm from "@/components/OtpVerifyForm";
import { maskPhone } from "@/utils/format";

export default async function PhoneVerifiedPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/phoneVerified");
  }

  return (
    <OtpVerifyForm
      userId={session.user.id}
      channel="phone"
      target={maskPhone(session.user.phoneNumber ?? "")}
      nextPath="/identityVerified"
    />
  );
}
