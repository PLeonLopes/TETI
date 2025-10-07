import prisma from "../../prisma/client";
import { ServiceError } from "../utils/serviceError";

export const taskService = {
  async createTask(
    title: string,
    projectId: number,
    assignedId?: number,
    description?: string,
    status?: string,
    priority?: string,
    dueDate?: Date
  ) {
    if (!title || !projectId) {
      throw new ServiceError("Título e projeto são obrigatórios.", 400);
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new ServiceError("Projeto não encontrado.", 404);

    if (assignedId) {
      const user = await prisma.user.findUnique({ where: { id: assignedId } });
      if (!user) throw new ServiceError("Usuário responsável não encontrado.", 404);
    }

    // Criando objeto de data condicional
    const data: any = {
      title,
      projectId,
    };
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;
    if (priority !== undefined) data.priority = priority;
    if (dueDate !== undefined) data.dueDate = dueDate;
    if (assignedId !== undefined) data.assignedId = assignedId;

    const newTask = await prisma.task.create({ data });

    return newTask;
  },

  async getAllTasks() {
    const tasks = await prisma.task.findMany({
      include: { project: true, assigned: true, comments: true },
    });
    if (!tasks.length) throw new ServiceError("Nenhuma task encontrada.", 404);
    return tasks;
  },

  async getTaskById(id: number) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true, assigned: true, comments: true },
    });
    if (!task) throw new ServiceError("Task não encontrada.", 404);
    return task;
  },

  async updateTask(
    id: number,
    data: Partial<{ title: string; description: string; status: string; priority: string; dueDate: Date; assignedId: number }>
  ) {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) throw new ServiceError("Task não encontrada.", 404);

    // Removendo campos undefined antes de atualizar
    const updatedData: any = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) updatedData[key] = value;
    });

    return await prisma.task.update({ where: { id }, data: updatedData });
  },

  async deleteTask(id: number) {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) throw new ServiceError("Task não encontrada.", 404);

    return await prisma.task.delete({ where: { id } });
  },
};
