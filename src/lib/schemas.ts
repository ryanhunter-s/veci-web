import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Ingresa un email válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Ingresa tu nombre"),
    email: z.string().min(1, "El email es requerido").email("Ingresa un email válido"),
    neighborhood: z.string().min(2, "Ingresa tu colonia o barrio"),
    password: z
      .string()
      .min(8, "Debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
      .regex(/[0-9]/, "Debe incluir al menos un número"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

export const registerSchemaApi = z
  .object({
    name: z.string().min(2, "Ingresa tu nombre"),
    email: z.string().min(1, "El email es requerido").email("Ingresa un email válido"),
    neighborhood: z.string().min(2, "Ingresa tu colonia o barrio"),
    password: z
      .string()
      .min(8, "Debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
      .regex(/[0-9]/, "Debe incluir al menos un número"),
  });

export type RegisterValues = z.infer<typeof registerSchema>;
  
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresa tu contraseña actual"),
    newPassword: z
      .string()
      .min(8, "Debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
      .regex(/[0-9]/, "Debe incluir al menos un número"),
    confirmNewPassword: z.string().min(1, "Confirma tu nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Las contraseñas no coinciden",
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;