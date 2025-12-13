import { z } from "zod";

// Signup form validation schema
export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  password: z
    .string()
    .min(8, "Palavra-passe deve ter pelo menos 8 caracteres")
    .max(128, "Palavra-passe deve ter no máximo 128 caracteres")
    .regex(/[A-Z]/, "Palavra-passe deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Palavra-passe deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Palavra-passe deve conter pelo menos um número"),
  businessName: z
    .string()
    .trim()
    .min(2, "Nome do negócio deve ter pelo menos 2 caracteres")
    .max(100, "Nome do negócio deve ter no máximo 100 caracteres")
    .optional()
    .or(z.literal("")),
  userType: z.enum(["business", "client"]),
});

// Guest booking validation schema
export const guestBookingSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  clientPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{9,15}$/, "Telefone inválido (9-15 dígitos)"),
  clientEmail: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres")
    .optional()
    .or(z.literal("")),
});

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  password: z
    .string()
    .min(1, "Palavra-passe é obrigatória")
    .max(128, "Palavra-passe deve ter no máximo 128 caracteres"),
});

// Contact form validation schema
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  message: z
    .string()
    .trim()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(1000, "Mensagem deve ter no máximo 1000 caracteres"),
});

// Helper function to validate and get error messages
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    if (err.path.length > 0) {
      errors[err.path[0].toString()] = err.message;
    }
  });
  
  return { success: false, errors };
}
