
import { NextRequest, NextResponse } from "next/server";
import { and, eq, gt, lt, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { otps, users } from "@/server/db/schema";
import { verifyEmailSchema } from "@/lib/schemas";

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "You must log in to verify your email." }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "The request body is invalid." }, { status: 400 });
    }

    const parsed = verifyEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
    }

    const { otp } = parsed.data;
    const now = new Date();

    await db.delete(otps).where(lt(otps.expiresAt, now));

    const [otpRecord] = await db
      .select({ id: otps.id })
      .from(otps)
      .where(
        and(
          eq(otps.userId, userId),
          eq(otps.channel, "email"),
          eq(otps.code, otp),
          gt(otps.expiresAt, now),
          lt(otps.attempts, MAX_ATTEMPTS),
        ),
      )
      .limit(1);

    if (!otpRecord) {
      await db
        .update(otps)
        .set({attempts: sql`${otps.attempts} + 1`,})
        .where(
          and(
            eq(otps.userId, userId),
            eq(otps.channel, "email"),
            gt(otps.expiresAt, now),
            lt(otps.attempts, MAX_ATTEMPTS),
          ),
        );
    return NextResponse.json({ message: "The code is invalid or has expired." }, { status: 400 });
  }

    const result = await db.transaction(async (tx) => {
      const [consumed] = await tx
        .delete(otps)
        .where(
          and(
            eq(otps.id, otpRecord.id),
            eq(otps.userId, userId),
            eq(otps.channel, "email"),
            eq(otps.code, otp),
            gt(otps.expiresAt, now),
            lt(otps.attempts, MAX_ATTEMPTS),
          ),
        )
        .returning({ id: otps.id });

      if (!consumed) {
        return false;
      }

      await tx.update(users).set({ emailVerified: now }).where(eq(users.id, userId));
      return true;
    });

    if (!result) {
      return NextResponse.json({ message: "The code has already been used or has expired." }, { status: 400 });
    }

    return NextResponse.json({ message: "Your email address has been verified." }, { status: 200 });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ message: "An error occurred while verifying your email." }, { status: 500 });
  }
}