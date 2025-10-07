import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  status: z.enum(["todo", "doing", "done"]).optional().default("todo"),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  dueDate: z.string().datetime().optional(),
  projectId: z.number().int("ID do projeto inválido"),
  assignedId: z.number().int("ID do usuário inválido").optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(3, "O título deve ter pelo menos 3 caracteres").optional(),
    description: z.string().optional(),
    status: z.enum(["todo", "doing", "done"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z.string().datetime().optional(),
    projectId: z.number().int("ID do projeto inválido").optional(),
    assignedId: z.number().int("ID do usuário inválido").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização",
  });
