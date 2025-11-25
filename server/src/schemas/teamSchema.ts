import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(3, "O nome do time deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
});

export const updateTeamSchema = z
  .object({
    name: z.string().min(3, "O nome do time deve ter pelo menos 3 caracteres").optional(),
    description: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização",
  });
