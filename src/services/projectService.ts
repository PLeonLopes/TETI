import prisma from "../../prisma/client";
import { ServiceError } from "../utils/serviceError";

export const projectService = {
	async createProject(
		name: string,
		description: string | undefined,
		teamId: number,
		ownerId: number
	) {
		if (!name || !teamId || !ownerId) {
			throw new ServiceError(
				"Nome, time e dono do projeto são obrigatórios.",
				400
			);
		}

		const team = await prisma.team.findUnique({ where: { id: teamId } });
		if (!team) throw new ServiceError("Time não encontrado.", 404);

		const owner = await prisma.user.findUnique({ where: { id: ownerId } });
		if (!owner) throw new ServiceError("Usuário dono não encontrado.", 404);

		const newProject = await prisma.project.create({
			data: { name, description: description ?? null, teamId, ownerId },
		});

		return newProject;
	},

	async getAllProjects() {
		const projects = await prisma.project.findMany({
			include: {
				team: {
					include: {
						members: {
							include: {
								user: true,
							},
						},
					},
				},
			},
		});

		return projects.map((project) => ({
			...project,
			team: project.team && {
				...project.team,
				members: project.team.members.map((m) => m.user),
			},
		}));
	},

	async getProjectById(id: number) {
		const project = await prisma.project.findUnique({
			where: { id },
			include: {
				team: {
					include: {
						members: {
							include: {
								user: true,
							},
						},
					},
				},
				owner: true,
				tasks: true,
			},
		});

		if (!project) throw new ServiceError("Projeto não encontrado.", 404);

		return {
			...project,
			team: project.team && {
				...project.team,
				members: project.team.members.map((m) => m.user),
			},
		};
	},

	async updateProject(
		id: number,
		data: { name?: string; description?: string }
	) {
		const existing = await prisma.project.findUnique({ where: { id } });
		if (!existing) throw new ServiceError("Projeto não encontrado.", 404);

		const updatedProject = await prisma.project.update({
			where: { id },
			data: { ...data },
		});

		return updatedProject;
	},

	async deleteProject(id: number) {
		const existing = await prisma.project.findUnique({ where: { id } });
		if (!existing) throw new ServiceError("Projeto não encontrado.", 404);

		return await prisma.project.delete({ where: { id } });
	},
};
