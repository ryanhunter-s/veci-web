import { NextResponse, NextRequest } from "next/server";
import { resendOtpSchema } from "@/lib/schemas";
import { resendOtp } from "@/lib/users";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = resendOtpSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json({ message: firstError?.message ?? "Invalid data" }, { status: 400 });
  }

  const ok = resendOtp(parsed.data.id, parsed.data.channel);
  if (!ok) {
    return NextResponse.json(
      { message: "User not found. Please start registration again." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    message: `A new code was sent to your ${parsed.data.channel === "email" ? "email" : "phone"} (simulated — check the terminal).`,
  });
}