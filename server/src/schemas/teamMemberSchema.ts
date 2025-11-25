import { z } from "zod";

export const createTeamMemberSchema = z.object({
  role: z
    .enum(["member", "admin"])
    .optional()
    .default("member"),
  userId: z.number().int("ID do usuário inválido"),
  teamId: z.number().int("ID do time inválido"),
});

export const updateTeamMemberSchema = z
  .object({
    role: z.enum(["member", "admin"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização",
  });
