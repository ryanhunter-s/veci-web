import { NextResponse, NextRequest } from "next/server";
import { verifyPhoneSchema } from "@/lib/schemas";
import { verifyPhoneOtp } from "@/lib/users";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = verifyPhoneSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json({ message: firstError?.message ?? "Invalid data" }, { status: 400 });
  }

  const result = verifyPhoneOtp(parsed.data.id, parsed.data.otp);
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ message: result.message });
}