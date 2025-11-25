import type { Request, Response } from "express";
import { projectService } from "../services/projectService";
import { ServiceError } from "../utils/serviceError";

export const projectController = {
	async createProject(req: Request, res: Response) {
		try {
			const { name, description, teamId, ownerId } = req.body;
			const project = await projectService.createProject(
				name,
				description,
				Number(teamId),
				Number(ownerId)
			);
			return res
				.status(201)
				.json({ message: "Projeto criado com sucesso!", data: project });
		} catch (error) {
			if (error instanceof ServiceError)
				return res.status(error.status).json({ message: error.message });
			return res.status(500).json({ message: "Erro interno do servidor!" });
		}
	},

	async getAllProjects(req: Request, res: Response) {
		try {
			const projects = await projectService.getAllProjects();
			return res
				.status(200)
				.json({ message: "Projetos retornados com sucesso!", data: projects });
		} catch (error) {
			console.log(error);
			if (error instanceof ServiceError)
				return res.status(error.status).json({ message: error.message });
			return res.status(500).json({ message: "Erro interno do servidor!" });
		}
	},

	async getProjectById(req: Request, res: Response) {
		try {
			const id = Number(req.params.id);
			const project = await projectService.getProjectById(id);
			return res
				.status(200)
				.json({ message: "Projeto retornado com sucesso!", data: project });
		} catch (error) {
			if (error instanceof ServiceError)
				return res.status(error.status).json({ message: error.message });
			return res.status(500).json({ message: "Erro interno do servidor!" });
		}
	},

	async updateProject(req: Request, res: Response) {
		try {
			const id = Number(req.params.id);
			const project = await projectService.updateProject(id, req.body);
			return res
				.status(200)
				.json({ message: "Projeto atualizado com sucesso!", data: project });
		} catch (error) {
			if (error instanceof ServiceError)
				return res.status(error.status).json({ message: error.message });
			return res.status(500).json({ message: "Erro interno do servidor!" });
		}
	},

	async deleteProject(req: Request, res: Response) {
		try {
			const id = Number(req.params.id);
			const project = await projectService.deleteProject(id);
			return res
				.status(200)
				.json({ message: "Projeto deletado com sucesso!", data: project });
		} catch (error) {
			if (error instanceof ServiceError)
				return res.status(error.status).json({ message: error.message });
			return res.status(500).json({ message: "Erro interno do servidor!" });
		}
	},
};
