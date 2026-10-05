import { randomInt } from "node:crypto";

import { getTwilioClient, getTwilioConfig, isTwilioConfigured, toE164 } from "@/lib/twilio";

export const OTP_TTL_MINUTES = 10;

export function generateOtpCode(): string {
  return randomInt(100000, 1000000).toString();
}

export function otpExpiresAt(ttlMinutes = OTP_TTL_MINUTES): Date {
  return new Date(Date.now() + ttlMinutes * 60 * 1000);
}

function buildOtpMessage(code: string): string {
  return `Tu codigo de verificacion de Veci es ${code}. Vence en ${OTP_TTL_MINUTES} minutos. No compartas este codigo con nadie.`;
}

export type SendSmsResult =
  | { sent: true; sid: string }
  | { sent: false; reason: "not_configured" | "invalid_number" | "provider_error"; detail?: string };

export async function sendSms(to: string, body: string): Promise<SendSmsResult> {
  const from = toE164(to);

  if (!from) {
    return { sent: false, reason: "invalid_number" };
  }

  if (!isTwilioConfigured()) {
    return { sent: false, reason: "not_configured" };
  }

  try {
    const { fromNumber } = getTwilioConfig();
    const message = await getTwilioClient().messages.create({
      to: from,
      from: toE164(fromNumber) ?? fromNumber,
      body,
    });

    return { sent: true, sid: message.sid };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown Twilio error";
    return { sent: false, reason: "provider_error", detail };
  }
}

export async function sendOtpSms(to: string, code: string): Promise<SendSmsResult> {
  const result = await sendSms(to, buildOtpMessage(code));

  if (!result.sent && result.reason === "not_configured") {
    console.log(`[VE·CI DEV] Twilio sin configurar. SMS a ${to} omitido. Codigo: ${code}`);
  }

  if (!result.sent && result.reason === "provider_error") {
    console.error(`[VE·CI] Error enviando SMS a ${to}: ${result.detail}`);
  }

  return result;
}
