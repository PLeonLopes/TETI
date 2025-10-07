import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3, "O nome do projeto deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  teamId: z.number().int("ID do time inválido"),
  ownerId: z.number().int("ID do dono inválido"),
});

export const updateProjectSchema = z
  .object({
    name: z.string().min(3, "O nome do projeto deve ter pelo menos 3 caracteres").optional(),
    description: z.string().optional(),
    teamId: z.number().int("ID do time inválido").optional(),
    ownerId: z.number().int("ID do dono inválido").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização",
  });
