import type { Request, Response } from "express";
import { taskService } from "../services/taskService";
import { ServiceError } from "../utils/serviceError";
import prisma from "../../prisma/client";

export const taskController = {
	async createTask(req: Request, res: Response) {
		try {
			const {
				title,
				projectId,
				assignedId,
				description,
				status,
				priority,
				dueDate,
			} = req.body;
			const task = await taskService.createTask(
				title,
				Number(projectId),
				assignedId ? Number(assignedId) : undefined,
				description,
				status,
				priority,
				dueDate ? new Date(dueDate) : undefined
			);
			return res
				.status(201)
				.json({ message: "Task criada com sucesso!", data: task });
		} catch (error) {
			if (error instanceof ServiceError)
				return res.status(error.status).json({ message: error.message });
			return res.status(500).json({ message: "Erro interno do servidor!" });
		}
	},

	async getAllTasks(req: Request, res: Response) {
		try {
			const tasks = await taskService.getAllTasks();
			return res
				.status(200)
				.json({ message: "Tasks retornadas com sucesso!", data: tasks });
		} catch (error) {
			if (error instanceof ServiceError)
				return res.status(error.status).json({ message: error.message });
			return res.status(500).json({ message: "Erro interno do servidor!" });
		}
	},

	async listTasksByProject(req: Request, res: Response) {
		try {
			const projectId = Number(req.params.projectId);

			const tasks = await prisma.task.findMany({
				where: { projectId },
				orderBy: { id: "asc" },
			});

			return res
				.status(200)
				.json({ message: "Tasks retornadas com sucesso!", data: tasks });
		} catch (error) {
			if (error instanceof ServiceError)
				return res.status(error.status).json({ message: error.message });
			return res.status(500).json({ message: "Erro interno do servidor!" });
		}
	},

	async getTaskById(req: Request, res: Response) {
		try {
			const id = Number(req.params.id);
			const task = await taskService.getTaskById(id);
			return res
				.status(200)
				.json({ message: "Task retornada com sucesso!", data: task });
		} catch (error) {
			if (error instanceof ServiceError)
				return res.status(error.status).json({ message: error.message });
			return res.status(500).json({ message: "Erro interno do servidor!" });
		}
	},

	async updateTask(req: Request, res: Response) {
		try {
			const id = Number(req.params.id);
			const task = await taskService.updateTask(id, req.body);
			return res
				.status(200)
				.json({ message: "Task atualizada com sucesso!", data: task });
		} catch (error) {
			if (error instanceof ServiceError)
				return res.status(error.status).json({ message: error.message });
			return res.status(500).json({ message: "Erro interno do servidor!" });
		}
	},

	async deleteTask(req: Request, res: Response) {
		try {
			const id = Number(req.params.id);
			const task = await taskService.deleteTask(id);
			return res
				.status(200)
				.json({ message: "Task deletada com sucesso!", data: task });
		} catch (error) {
			if (error instanceof ServiceError)
				return res.status(error.status).json({ message: error.message });
			return res.status(500).json({ message: "Erro interno do servidor!" });
		}
	},
};
