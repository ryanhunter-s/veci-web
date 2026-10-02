
import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, gt, lt, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { otps, profiles } from "@/server/db/schema";
import { verifyPhoneSchema } from "@/lib/schemas";

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "You must log in to verify your phone." }, { status: 401 });
    }

    // 2. Validate request body
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "The request body is invalid." }, { status: 400 });
    }

    const parsed = verifyPhoneSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
    }

    const { otp } = parsed.data;
    const now = new Date();

    // 3. Delete expired OTPs
    await db.delete(otps).where(lt(otps.expiresAt, now));

    // 4. Find the latest active phone OTP
    const [otpRecord] = await db
      .select({
        id: otps.id,
        code: otps.code,
        attempts: otps.attempts,
      })
      .from(otps)
      .where(
        and(
          eq(otps.userId, userId),
          eq(otps.channel, "phone"),
          gt(otps.expiresAt, now),
          lt(otps.attempts, MAX_ATTEMPTS),
        ),
      )
      .orderBy(desc(otps.createdAt))
      .limit(1);

    if (!otpRecord || otpRecord.code !== otp) {
      // Increment attempts only for the latest active OTP
      if (otpRecord) {
        await db
          .update(otps)
          .set({ attempts: sql`${otps.attempts} + 1` })
          .where(and(eq(otps.id, otpRecord.id), lt(otps.attempts, MAX_ATTEMPTS)));
      }

      return NextResponse.json({ message: "The code is invalid or has expired." }, { status: 400 });
    }

    // 5. Consume OTP and verify phone atomically
    const result = await db.transaction(async (tx) => {
      const [consumed] = await tx
        .delete(otps)
        .where(
          and(
            eq(otps.id, otpRecord.id),
            eq(otps.userId, userId),
            eq(otps.channel, "phone"),
            eq(otps.code, otp),
            gt(otps.expiresAt, now),
            lt(otps.attempts, MAX_ATTEMPTS),
          ),
        )
        .returning({ id: otps.id });

      if (!consumed) {
        return false;
      }

      await tx.update(profiles).set({ phoneVerified: true }).where(eq(profiles.userId, userId));
      return true;
    });

    if (!result) {
      return NextResponse.json({ message: "The code has already been used or has expired." }, { status: 400 });
    }

    return NextResponse.json({ message: "Your phone number has been verified." }, { status: 200 });
  } catch (error) {
    console.error("Error verifying phone:", error);
    return NextResponse.json({ message: "An error occurred while verifying your phone." }, { status: 500 });
  }
}