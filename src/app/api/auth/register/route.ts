import { NextResponse, NextRequest } from "next/server";
import { registerApiSchema } from "@/lib/schemas";
import { db } from "@/server/db";
import { users, profiles, otps } from "@/server/db/schema";
import { generateOtpCode, sendOtpSms } from "@/lib/sms";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/server/hashPass";

export interface OTPRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
  
    const parsed = registerApiSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json({ message: firstError?.message ?? "Invalid data" }, { status: 400 });
    }
  
    const exists = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1);
  
    if (exists.length) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    }
  
    const user = await db.insert(users).values({
      name: parsed.data.firstName + " " + parsed.data.lastName,
      email: parsed.data.email,
    }).returning({
      id: users.id,
      email: users.email,
    });
  
    if (!user.length) {
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    }
    const hashedPassword = await hashPassword(parsed.data.password);
    
    const profile = await db.insert(profiles).values({
      userId: user[0].id,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phoneNumber: parsed.data.phoneNumber,
      gender: parsed.data.gender,
      dateOfBirth: parsed.data.dateOfBirth,
      address: parsed.data.address,
      city: parsed.data.city,
      zip: parsed.data.zip,
      neighborhood: parsed.data.neighborhood,
      passwordHash: hashedPassword,
      phoneVerified: false,
      identityVerified: false,
    }).returning({
      id: profiles.id,
      userId: profiles.userId,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      phoneNumber: profiles.phoneNumber,
      gender: profiles.gender,
      dateOfBirth: profiles.dateOfBirth,
      address: profiles.address,
      city: profiles.city,
      zip: profiles.zip,
      neighborhood: profiles.neighborhood,
      phoneVerified: profiles.phoneVerified,
      identityVerified: profiles.identityVerified,
    });
  
    if (!profile.length) {
      return NextResponse.json({ message: "Failed to create profile" }, { status: 500 });
    }
  
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    const expirationTimePhone = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    const codeEmail = generateOtpCode();
    const codePhone = generateOtpCode();

    const smsResult = await sendOtpSms(parsed.data.phoneNumber, codePhone);

    if (!smsResult.sent && smsResult.reason === "provider_error") {
      console.error("[VE·CI] SMS de verificacion no enviado tras registro");
    }

    const code = `${smsResult.code}` || codePhone;

    await db.insert(otps).values([{
      userId: user[0].id,
      channel: 'email',
      code: codeEmail,
      attempts: 0,
      expiresAt: expirationTime,
    }, {
      userId: user[0].id,
      channel: 'phone',
      code: code,
      attempts: 0,
      expiresAt: expirationTimePhone,
    }]);

   
    return NextResponse.json({ ...profile[0] }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error to register' }, { status: 500 })
  }
}