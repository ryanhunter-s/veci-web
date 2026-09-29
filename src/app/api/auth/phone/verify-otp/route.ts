import { NextResponse } from "next/server";
import { twilioClient, verifyServiceSid } from "@/lib/twilio";

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json({ error: "Phone and code are required" }, { status: 400 });
    }

    const result = await twilioClient.verify.v2.services(verifyServiceSid).verificationChecks.create({to: phone, code });

    if (result.status !== "approved") {
      return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 });
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}