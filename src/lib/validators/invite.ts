import { z } from "zod";

export const createInviteSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["ADMIN", "COACH", "PLAYER"]),
  teamId: z.string().optional().nullable(),
});

export const acceptInviteSchema = z
  .object({
    token: z.string(),
    name: z.string().min(2, "Nome muito curto"),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
    confirmPassword: z.string(),
    gameName: z.string().optional(),
    tagLine: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
