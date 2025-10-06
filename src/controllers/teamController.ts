import type { Request, Response } from "express";
import { teamService } from "../services/teamService";
import { ServiceError } from "../utils/serviceError";

export const teamController = {
  async createTeam(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const newTeam = await teamService.createTeam(name, description);

      return res.status(201).json({
        message: "Time criado com sucesso!",
        data: newTeam,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor!" });
    }
  },

  async getAllTeams(_req: Request, res: Response) {
    try {
      const teams = await teamService.getAllTeams();

      return res.status(200).json({
        message: "Times recuperados com sucesso!",
        data: teams,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor!" });
    }
  },

  async getTeamById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const team = await teamService.getTeamById(id);

      return res.status(200).json({
        message: "Time recuperado com sucesso!",
        data: team,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor!" });
    }
  },

  async updateTeam(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { name, description } = req.body;

      const updatedTeam = await teamService.updateTeam(id, { name, description });

      return res.status(200).json({
        message: "Time atualizado com sucesso!",
        data: updatedTeam,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor!" });
    }
  },

  async deleteTeam(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deletedTeam = await teamService.deleteTeam(id);

      return res.status(200).json({
        message: "Time deletado com sucesso!",
        data: deletedTeam,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor!" });
    }
  },
};
