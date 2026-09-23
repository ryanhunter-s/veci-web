import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginValues = z.infer<typeof loginSchema>;

function isAtLeast18(dateOfBirth: string): boolean {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return false;

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age >= 18;
}

const registerFields = {
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  phoneNumber: z.string().trim().min(6, "Phone must be at least 6 characters"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  gender: z.enum(["male", "female", "other"], { message: "Select your gender" }),
  dateOfBirth: z.string().trim().min(1, "Date of birth is required"),
  address: z.string().trim().min(5, "Address of residence must be at least 5 characters"),
  city: z.string().trim().min(3, "City must be at least 3 characters"),
  zip: z.string().trim().min(2, "ZIP / postal code is required"),
  neighborhood: z.string().trim().min(2, "Enter your neighborhood"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Must include at least one capital letter").regex(/[0-9]/, "Must include at least one number"),
} satisfies z.ZodRawShape;

export const registerApiSchema = z.object(registerFields);

export const registerSchema = registerApiSchema.extend({
  confirmPassword: z.string().min(1, "Confirm your password"),
  captcha: z.literal(true, { message: "Please confirm you are not a robot" }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords don't match",
}).refine((data) => isAtLeast18(data.dateOfBirth), {
  path: ["dateOfBirth"],
  message: "You must be at least 18 years old",
});

export type RegisterValues = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  id: z.string().min(1, "Missing pending user id"),
  otp: z.string().trim().length(6, "Enter the 6-digit code"),
});

export const verifyPhoneSchema = z.object({
  id: z.string().min(1, "Missing pending user id"),
  otp: z.string().trim().length(6, "Enter the 6-digit code"),
});

export const verifyIdentitySchema = z.object({
  id: z.string().min(1, "Missing pending user id"),
  docType: z.enum(["dpi", "passport"], { message: "Select a document type" }),
  docNumber: z.string().trim().min(6, "Enter a valid document number"),
  fileName: z.string().trim().min(1, "Please upload a photo of your document"),
  docContent: z.string().min(1, "Please upload a photo of your document"),
});

export const resendOtpSchema = z.object({
  id: z.string().min(1, "Missing pending user id"),
  channel: z.enum(["email", "phone"], { message: "Select a channel" }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: z
    .string()
    .min(8, "Must have at least 8 characters")
    .regex(/[A-Z]/, "Must include at least one capital letter")
    .regex(/[0-9]/, "Must include at least one number"),
  confirmNewPassword: z.string().min(1, "Confirm your new password"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  path: ["confirmNewPassword"],
  message: "Passwords don't match",
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;