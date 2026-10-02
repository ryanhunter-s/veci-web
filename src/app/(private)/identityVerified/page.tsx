import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import IdentityVerifyForm from "@/components/IdentityVerifyForm";
import { IconLogo } from "@/components/Logo";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "cn";

export default async function IdentityVerifiedPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/identityVerified");
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "w-fit text-muted-foreground")}>
        <ArrowLeft />
        Go back
      </Link>

      <div className="mt-6 text-center">
        <div className="mx-auto h-20 w-20">
          <IconLogo />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-foreground">Validate your identity</h1>
        <p className="mt-1 text-muted-foreground">
          Upload a photo of your government-issued ID so your neighbors know who they are dealing with.
        </p>
      </div>

      <div className="mt-8">
        <IdentityVerifyForm userId={session.user.id} />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Your document is only used to confirm your identity and is stored privately.
      </p>
    </div>
  );
}
