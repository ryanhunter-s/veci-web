import { NextResponse } from "next/server";
import { twilioClient, verifyServiceSid } from "@/lib/twilio";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    const verification = await twilioClient.verify.v2.services(verifyServiceSid).verifications.create({to: phone, channel: "sms" });

    return NextResponse.json({success: true, status: verification.status});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not send verification code" }, { status: 500 });
  }
}