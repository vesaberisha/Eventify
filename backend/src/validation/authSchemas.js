import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8, "Password duhet te kete minimum 8 karaktere")
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});

export const roleUpdateSchema = z.object({
  role: z.enum(["Admin", "Organizer", "User"])
});
