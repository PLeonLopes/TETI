import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1, "O comentário não pode estar vazio"),
  taskId: z.number().int("ID da tarefa inválido"),
  authorId: z.number().int("ID do autor inválido"),
});

export const updateCommentSchema = z
  .object({
    content: z.string().min(1, "O comentário não pode estar vazio").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização",
  });
