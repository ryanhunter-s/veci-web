import { NextResponse, NextRequest } from "next/server";
import { verifyPhoneSchema } from "@/lib/schemas";
import { db } from "@/server/db";
import { users, otps } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const parsed = verifyPhoneSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json({ success: false, message: firstError?.message ?? "Invalid data" }, { status: 400 });
    }

    const { id: userId, otp } = parsed.data;

    // 1. Check if user exists
    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // 2. Find the phone OTP
    const verification = await db
      .select({
        id: otps.id,
        code: otps.code,
        attempts: otps.attempts,
        expiresAt: otps.expiresAt,
      })
      .from(otps)
      .where(and(
        eq(otps.userId, userId),
        eq(otps.channel, "phone")
      ))
      .limit(1);

    // 3. OTP doesn't exist
    if (verification.length === 0) {
      return NextResponse.json({ success: false, message: "Verification code not found" }, { status: 400 });
    }

    const record = verification[0];

    // 4. Check expiration
    if (record.expiresAt <= new Date()) {
      await db.delete(otps).where(eq(otps.id, record.id));
      return NextResponse.json({ success: false, message: "The code has expired." }, { status: 400 });
    }

    // 5. Check maximum attempts
    const MAX_ATTEMPTS = 5;

    if (record.attempts >= MAX_ATTEMPTS) {
      await db.delete(otps).where(eq(otps.id, record.id));
      return NextResponse.json({ success: false, message: "Too many attempts. Please request a new code.", }, { status: 429 });
    }

    // 6. Check OTP
    if (record.code !== otp) {
      await db.update(otps).set({ attempts: record.attempts + 1 }).where(eq(otps.id, record.id));
      return NextResponse.json({ success: false, message: "Incorrect code", attemptsRemaining: MAX_ATTEMPTS - (record.attempts + 1)}, { status: 400 });
    }

    // 7. OTP is valid
    //
    // Here you can update the user to mark
    // the phone as verified.
    //
    // Example:
    //
    // await db
    //   .update(users)
    //   .set({
    //     phoneVerified: true,
    //   })
    //   .where(eq(users.id, userId));

    // 8. Delete OTP so it cannot be reused
    await db.delete(otps).where(eq(otps.id, record.id));

    return NextResponse.json({ success: true, message: "Phone verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Phone verification error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}