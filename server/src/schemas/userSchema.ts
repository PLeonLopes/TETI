import { z } from "zod";

// Schema para criar usuário
export const createUserSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .nonempty("Nome é obrigatório")
    .trim(),
  email: z
    .string()
    .email("Email inválido")
    .nonempty("Email é obrigatório")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
    .nonempty("Senha é obrigatória"),
});

// Schema para atualizar usuário
export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres")
      .trim()
      .optional(),
    email: z.string().email("Email inválido").toLowerCase().trim().optional(),
    password: z
      .string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .max(100, "Senha deve ter no máximo 100 caracteres")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização",
  });

// Inferência de tipos para Typescript
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
