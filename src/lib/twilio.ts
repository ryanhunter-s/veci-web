import twilio from "twilio";

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable ${name}. Add it to .env before using Twilio.`);
  }

  return value;
}

export function getTwilioConfig() {
  return {
    accountSid: requiredEnv("TWILIO_ACCOUNT_SID"),
    authToken: requiredEnv("TWILIO_AUTH_TOKEN"),
    fromNumber: requiredEnv("TWILIO_FROM_NUMBER"),
  };
}

let cachedClient: ReturnType<typeof twilio> | null = null;

export function getTwilioClient() {
  if (!cachedClient) {
    const { accountSid, authToken } = getTwilioConfig();
    cachedClient = twilio(accountSid, authToken);
  }

  return cachedClient;
}

export function isTwilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER,
  );
}

const DEFAULT_COUNTRY_CODE = "+52";

export function toE164(rawPhone: string, countryCode = DEFAULT_COUNTRY_CODE): string | null {
  const trimmed = rawPhone.trim();

  if (!trimmed) return null;

  const digitsOnly = trimmed.replace(/[^\d]/g, "");

  if (digitsOnly.length < 8 || digitsOnly.length > 15) return null;

  if (trimmed.startsWith("+")) return `+${digitsOnly}`;
  if (digitsOnly.startsWith("00")) return `+${digitsOnly.slice(2)}`;

  return `${countryCode}${digitsOnly}`;
}
