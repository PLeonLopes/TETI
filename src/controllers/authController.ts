import type { Request, Response } from "express";
import { authService } from "../services/authService";
import { ServiceError } from "../utils/serviceError";

export const authController = {
	async register(req: Request, res: Response) {
		try {
			const { name, email, password } = req.body;
			const result = await authService.register(name, email, password);

			return res.status(201).json({
				message: "Usuário criado com sucesso!",
				data: result,
			});
		} catch (error) {
			console.error(error);
			if (error instanceof ServiceError) {
				return res.status(error.status).json({ message: error.message });
			}
			return res.status(500).json({ message: "Erro interno do servidor." });
		}
	},

	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;

			const result = await authService.login(email, password);

			return res.status(200).json(result);
		} catch (error) {
			if (error instanceof ServiceError) {
				return res.status(error.status).json({ message: error.message });
			}

			console.error(error);
			return res.status(500).json({ message: "Erro interno do servidor!" });
		}
	},
};
