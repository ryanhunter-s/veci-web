import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    neighborhood: z.string().min(2, "Enter your neighborhood"),
    password: z
      .string()
      .min(8, "Must have at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one capital letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export const registerSchemaApi = z
  .object({
    name: z.string().min(2, "Enter your name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    neighborhood: z.string().min(2, "Enter your neighborhood"),
    password: z
      .string()
      .min(8, "Must have at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one capital letter")
      .regex(/[0-9]/, "Must include at least one number"),
  });

export type RegisterValues = z.infer<typeof registerSchema>;
  
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(8, "Must have at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one capital letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmNewPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords don't match",
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;