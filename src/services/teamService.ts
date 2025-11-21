import prisma from "../../prisma/client";
import { ServiceError } from "../utils/serviceError";

export const teamService = {
	async createTeam(name: string, description?: string, memberIds?: number[]) {
		if (!name) {
			throw new ServiceError("O nome do time é obrigatório.", 400);
		}

		const existing = await prisma.team.findUnique({ where: { name } });
		if (existing) {
			throw new ServiceError("Um time com esse nome já existe.", 400);
		}

		const createData = {
			name,
			description: description ?? null,
			...(memberIds && memberIds.length > 0
				? {
						members: {
							create: memberIds.map((id) => ({
								userId: id,
								role: "member",
							})),
						},
				  }
				: {}),
		};

		const newTeam = await prisma.team.create({
			data: createData,
			include: {
				members: true,
			},
		});

		return newTeam;
	},

	async getAllTeams() {
		const teams = await prisma.team.findMany({
			include: {
				members: {
					include: {
						user: true,
					},
				},
			},
		});

		if (!teams.length) {
			throw new ServiceError("Nenhum time encontrado.", 404);
		}

		return teams;
	},

	async getTeamById(id: number) {
		const team = await prisma.team.findUnique({
			where: { id },
			include: {
				members: {
					include: {
						user: true,
					},
				},
				projects: true,
			},
		});

		if (!team) {
			throw new ServiceError("Time não encontrado.", 404);
		}

		return team;
	},

	async updateTeam(
		id: number,
		data: { name?: string; description?: string; memberIds?: number[] }
	) {
		const existing = await prisma.team.findUnique({ where: { id } });
		if (!existing) {
			throw new ServiceError("Time não encontrado.", 404);
		}

		const updateData: any = {
			name: data.name,
			description: data.description,
		};

		if (data.memberIds && data.memberIds.length > 0) {
			updateData.members = {
				deleteMany: {}, // remove all current members
				create: data.memberIds.map((userId) => ({
					userId,
					role: "member",
				})),
			};
		}

		const updatedTeam = await prisma.team.update({
			where: { id },
			data: updateData,
			include: {
				members: {
					include: {
						user: true,
					},
				},
			},
		});

		return updatedTeam;
	},

	async deleteTeam(id: number) {
		const existing = await prisma.team.findUnique({ where: { id } });
		if (!existing) {
			throw new ServiceError("Time não encontrado.", 404);
		}

		return await prisma.team.delete({ where: { id } });
	},
};
