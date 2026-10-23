import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: z.enum(["admin", "teacher", "student"]),
  identifierNumber: z.string().min(5, "NIP/NISN minimal 5 karakter"),
  phone: z.string().optional(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["active", "pending", "suspended"]),
});

export const resetPasswordSchema = z.object({
  userId: z.string().uuid("ID Pengguna tidak valid"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;