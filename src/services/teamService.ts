import prisma from "../../prisma/client";
import { ServiceError } from "../utils/serviceError";

export const teamService = {
  async createTeam(name: string, description?: string) {
    if (!name) {
      throw new ServiceError("O nome do time é obrigatório.", 400);
    }

    const existing = await prisma.team.findUnique({ where: { name } });
    if (existing) {
      throw new ServiceError("Um time com esse nome já existe.", 400);
    }

    const newTeam = await prisma.team.create({
      data: { 
        name,
        description: description ?? null},        
    });

    return newTeam;
  },

  async getAllTeams() {
    const teams = await prisma.team.findMany();
    if (!teams.length) {
      throw new ServiceError("Nenhum time encontrado.", 404);
    }
    return teams;
  },

  async getTeamById(id: number) {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: true,  // inclui os membros do time
        projects: true, // inclui projetos do time
      },
    });

    if (!team) {
      throw new ServiceError("Time não encontrado.", 404);
    }

    return team;
  },

  async updateTeam(id: number, data: { name?: string; description?: string }) {
    const existing = await prisma.team.findUnique({ where: { id } });
    if (!existing) {
      throw new ServiceError("Time não encontrado.", 404);
    }

    const updatedTeam = await prisma.team.update({
      where: { id },
      data,
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
