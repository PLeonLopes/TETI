import prisma from "../../prisma/client";

import bcrypt from "bcryptjs";
import { ServiceError } from "../utils/serviceError";

export const userService = {
  async createUser(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new ServiceError("Todos os campos são obrigatórios.", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ServiceError("Esse usuário já existe.", 400);
    }

    const hashed_pass = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashed_pass },
    });

    return newUser;
  },

  async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!users.length) {
      throw new ServiceError("Nenhum usuário encontrado.", 404);
    }

    return users;
  },

  async getUserById(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ServiceError("Este usuário não existe!", 404);
    }

    return user;
  },

  async updateUser(id: number, data: { name?: string; email?: string }) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new ServiceError("Este usuário não existe!", 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    return updatedUser;
  },

  async deleteUser(id: number) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new ServiceError("Este usuário não existe!", 404);
    }

    return await prisma.user.delete({ where: { id } });
  },
};
