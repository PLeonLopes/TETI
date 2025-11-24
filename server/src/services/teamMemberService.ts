import prisma from "../../prisma/client";
import { ServiceError } from "../utils/serviceError";

export const teamMemberService = {
  // ADIÇÃO DE UM USUÁRIO A UM TIME
  async addMember(userId: number, teamId: number, role = "member") {
    if (!userId || !teamId) {
      throw new ServiceError("UserId e TeamId são obrigatórios.", 400);
    }

    // CHECA SE UM USUÁRIO JÁ É MEMBRO
    const existing = await prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId } },
    });
    if (existing) {
      throw new ServiceError("Esse usuário já é membro deste time.", 400);
    }

    // VERIFICAÇÃO SE TIME E USER EXISTEM
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!user || !team) {
      throw new ServiceError("Usuário ou time não encontrados.", 404);
    }

    const newMember = await prisma.teamMember.create({
      data: { userId, teamId, role },
      include: { user: true, team: true },
    });

    return newMember;
  },

  // LISTA TODOS OS MEMBROS DO TIME
  async getMembersByTeam(teamId: number) {
    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: { user: true },
    });

    if (!members.length) {
      throw new ServiceError("Nenhum membro encontrado para este time.", 404);
    }

    return members;
  },

  // ATUALIZAR PAPEL DO MEMBRO
  async updateMemberRole(userId: number, teamId: number, role: string) {
    const existing = await prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId } },
    });

    if (!existing) {
      throw new ServiceError("Membro não encontrado neste time.", 404);
    }

    const updated = await prisma.teamMember.update({
      where: { userId_teamId: { userId, teamId } },
      data: { role },
    });

    return updated;
  },

  // REMOVER MEMBRO DE UM TIME
  async removeMember(userId: number, teamId: number) {
    const existing = await prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId } },
    });

    if (!existing) {
      throw new ServiceError("Membro não encontrado neste time.", 404);
    }

    await prisma.teamMember.delete({
      where: { userId_teamId: { userId, teamId } },
    });

    return { message: "Membro removido com sucesso." };
  },
};
