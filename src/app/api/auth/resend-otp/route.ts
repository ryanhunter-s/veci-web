import { and, count, desc, eq, gte } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

import { resendOtpSchema } from "@/lib/schemas";
import { db } from "@/server/db";
import { otps, profiles } from "@/server/db/schema";
import { auth } from "@/lib/auth";
import { generateOtpCode, otpExpiresAt, sendOtpSms } from "@/lib/sms";

const RESEND_COOLDOWN_MINUTES = 2;
const RESEND_WINDOW_MINUTES = 60;
const MAX_SENDS_PER_HOUR = 5;

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { message: "You must log in to verify your email." },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => null);

  const parsed = resendOtpSchema.safeParse(body);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      { message: firstError?.message ?? "Invalid data" },
      { status: 400 },
    );
  }

  const { channel } = parsed.data;

  if (channel === "phone") {
    const [profile] = await db
      .select({ phoneNumber: profiles.phoneNumber })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (!profile?.phoneNumber) {
      return NextResponse.json(
        { message: "No phone number is associated with your account." },
        { status: 400 },
      );
    }

    const since = new Date(Date.now() - RESEND_WINDOW_MINUTES * 60 * 1000);

    const [usage] = await db
      .select({ total: count() })
      .from(otps)
      .where(
        and(
          eq(otps.userId, userId),
          eq(otps.channel, "phone"),
          gte(otps.createdAt, since),
        ),
      );

    if ((usage?.total ?? 0) >= MAX_SENDS_PER_HOUR) {
      return NextResponse.json(
        { message: `You can only request ${MAX_SENDS_PER_HOUR} codes per hour. Try again later.` },
        { status: 429 },
      );
    }

    const [latest] = await db
      .select({ createdAt: otps.createdAt })
      .from(otps)
      .where(and(eq(otps.userId, userId), eq(otps.channel, "phone")))
      .orderBy(desc(otps.createdAt))
      .limit(1);

    const cooldownMs = RESEND_COOLDOWN_MINUTES * 60 * 1000;
    const last = latest;

    if (last && Date.now() - new Date(last.createdAt).getTime() < cooldownMs) {
      return NextResponse.json(
        { message: `Please wait ${RESEND_COOLDOWN_MINUTES} minutes before requesting another code.` },
        { status: 429 },
      );
    }

    const code = generateOtpCode();

    await db.insert(otps).values({
      userId,
      channel,
      code,
      attempts: 0,
      expiresAt: otpExpiresAt(),
    });

    const result = await sendOtpSms(profile.phoneNumber, code);

    if (!result.sent && result.reason === "invalid_number") {
      return NextResponse.json(
        { message: "The phone number on your account is not valid." },
        { status: 400 },
      );
    }

    if (!result.sent && result.reason === "provider_error") {
      return NextResponse.json(
        { message: "We could not send the SMS right now. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: "A new code was sent to your phone." });
  }

  await db.insert(otps).values({
    userId,
    channel,
    code: generateOtpCode(),
    attempts: 0,
    expiresAt: otpExpiresAt(5),
  });

  return NextResponse.json({ message: "A new code was sent to your email." });
}
