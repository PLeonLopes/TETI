import type { Request, Response } from "express";
import { teamMemberService } from "../services/teamMemberService";
import { ServiceError } from "../utils/serviceError";

export const teamMemberController = {
  async addMember(req: Request, res: Response) {
    try {
      const { userId, teamId, role } = req.body;
      const member = await teamMemberService.addMember(userId, teamId, role);
      return res.status(201).json({ message: "Membro adicionado!", data: member });
    } catch (error) {
      if (error instanceof ServiceError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async getMembersByTeam(req: Request, res: Response) {
    try {
      const teamId = Number(req.params.teamId);
      const members = await teamMemberService.getMembersByTeam(teamId);
      return res.json({ members });
    } catch (error) {
      if (error instanceof ServiceError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async updateMemberRole(req: Request, res: Response) {
    try {
      const { userId, teamId, role } = req.body;
      const updated = await teamMemberService.updateMemberRole(userId, teamId, role);
      return res.json({ message: "Papel atualizado com sucesso!", data: updated });
    } catch (error) {
      if (error instanceof ServiceError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },

  async removeMember(req: Request, res: Response) {
    try {
      const { userId, teamId } = req.body;
      const result = await teamMemberService.removeMember(userId, teamId);
      return res.json(result);
    } catch (error) {
      if (error instanceof ServiceError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },
};
