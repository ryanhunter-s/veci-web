export type Gender = "male" | "female" | "other";
export type IdentityDocType = "dpi" | "passport";

export interface OTPRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

export interface IdentityDoc {
  type: IdentityDocType;
  number: string;
  fileName: string;
  uploadedAt: string;
}

export interface StoredUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  phoneNumber: string;
  email: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  city: string;
  zip: string;
  neighborhood: string;
  password: string;
  createdAt: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  identityDoc?: IdentityDoc;
  emailOtp?: OTPRecord;
  phoneOtp?: OTPRecord;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  neighborhood: string;
  address: string;
  city: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
}

const users: StoredUser[] = [];
let nextId = 1;

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isOtpValid(record: OTPRecord | undefined, code: string): boolean {
  return !!record && record.code === code && record.expiresAt > Date.now();
}

export function createPendingUser(data: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  city: string;
  zip: string;
  neighborhood: string;
  password: string;
}): StoredUser | null {
  const exists = users.find((u) => u.email === data.email);
  if (exists) return null;

  const now = Date.now();
  const emailOtp: OTPRecord = { code: generateOtp(), expiresAt: now + OTP_TTL_MS, attempts: 0 };
  const phoneOtp: OTPRecord = { code: generateOtp(), expiresAt: now + OTP_TTL_MS, attempts: 0 };

  const user: StoredUser = {
    id: String(nextId++),
    name: `${data.firstName} ${data.lastName}`.trim(),
    createdAt: new Date(now).toISOString(),
    emailVerified: false,
    phoneVerified: false,
    identityVerified: false,
    emailOtp,
    phoneOtp,
    ...data,
  };

  users.push(user);
  simulateSendEmailOtp(user.email, emailOtp.code);
  simulateSendPhoneOtp(user.phoneNumber, phoneOtp.code);

  return user;
}

export function getUserById(id: string): StoredUser | undefined {
  return users.find((u) => u.id === id);
}

export function verifyEmailOtp(userId: string, code: string): { ok: boolean; message: string } {
  const user = getUserById(userId);
  if (!user) return { ok: false, message: "User not found. Please start registration again." };

  if (user.emailVerified) return { ok: true, message: "Email already verified" };

  const record = user.emailOtp;
  if (!record || record.attempts >= MAX_OTP_ATTEMPTS) {
    return { ok: false, message: "Too many attempts. Request a new code." };
  }
  if (!record || record.expiresAt <= Date.now()) {
    return { ok: false, message: "The code expired. Request a new one." };
  }
  if (record.code !== code) {
    record.attempts += 1;
    return { ok: false, message: "Incorrect code. Try again." };
  }

  user.emailVerified = true;
  delete user.emailOtp;
  return { ok: true, message: "Email verified" };
}

export function verifyPhoneOtp(userId: string, code: string): { ok: boolean; message: string } {
  const user = getUserById(userId);
  if (!user) return { ok: false, message: "User not found. Please start registration again." };

  if (user.phoneVerified) return { ok: true, message: "Phone already verified" };

  const record = user.phoneOtp;
  if (!record || record.attempts >= MAX_OTP_ATTEMPTS) {
    return { ok: false, message: "Too many attempts. Request a new code." };
  }
  if (!record || record.expiresAt <= Date.now()) {
    return { ok: false, message: "The code expired. Request a new one." };
  }
  if (record.code !== code) {
    record.attempts += 1;
    return { ok: false, message: "Incorrect code. Try again." };
  }

  user.phoneVerified = true;
  delete user.phoneOtp;
  return { ok: true, message: "Phone verified" };
}

export function resendOtp(userId: string, channel: "email" | "phone"): boolean {
  const user = getUserById(userId);
  if (!user) return false;

  const now = Date.now();
  if (channel === "email") {
    user.emailOtp = { code: generateOtp(), expiresAt: now + OTP_TTL_MS, attempts: 0 };
    simulateSendEmailOtp(user.email, user.emailOtp.code);
  } else {
    user.phoneOtp = { code: generateOtp(), expiresAt: now + OTP_TTL_MS, attempts: 0 };
    simulateSendPhoneOtp(user.phoneNumber, user.phoneOtp.code);
  }
  return true;
}

export function verifyIdentity(
  userId: string,
  doc: { type: IdentityDocType; number: string; fileName: string },
): boolean {
  const user = getUserById(userId);
  if (!user) return false;

  user.identityDoc = { ...doc, uploadedAt: new Date().toISOString() };
  user.identityVerified = true;
  return true;
}

export function findUserByCredentials(email: string, password: string): StoredUser | undefined {
  return users.find((u) => u.email === email && u.password === password);
}

export function isFullyVerified(user: StoredUser): boolean {
  return user.emailVerified && user.phoneVerified && user.identityVerified;
}

export function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    neighborhood: user.neighborhood,
    address: user.address,
    city: user.city,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    identityVerified: user.identityVerified,
  };
}

function simulateSendEmailOtp(email: string, code: string): void {
  console.log(
    `\n[VE·CI DEV] 📧 SIMULATED EMAIL to ${email}\n` +
      `  Subject: Your Veci verification code\n` +
      `  Your code is: ${code}\n` +
      `  It expires in 10 minutes.\n` +
      `  (Replace this log with a real email provider, e.g. Resend.)\n`,
  );
}

function simulateSendPhoneOtp(phoneNumber: string, code: string): void {
  console.log(
    `\n[VE·CI DEV] 📱 SIMULATED SMS/WHATSAPP to ${phoneNumber}\n` +
      `  Your Veci verification code is: ${code}\n` +
      `  It expires in 10 minutes.\n` +
      `  (Replace this log with a real SMS provider, e.g. Twilio.)\n`,
  );
}

export function debugUsers(): StoredUser[] {
  return users;
}