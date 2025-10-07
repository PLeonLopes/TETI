import type { Request, Response } from "express";
import { userService } from "../services/userService";
import { ServiceError } from "../utils/serviceError";

export const userController = {
  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const newUser = await userService.createUser(name, email, password);

      return res.status(201).json({
        message: "Usuário criado com Sucesso!",
        data: newUser,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do Servidor!" });
    }
  },

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json({
        message: "Usuário retornado com sucesso!",
        data: users,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await userService.getUserById(id);

      return res.status(200).json({
        message: "Usuário retornado com sucesso!",
        data: user,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updatedUser = await userService.updateUser(id, req.body);

      return res.status(200).json({
        message: "Usuário retornado com sucesso!",
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deletedUser = await userService.deleteUser(id);

      return res.status(200).json({
        message: "Usuário deletado com sucesso!",
        data: deletedUser,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  },
};
