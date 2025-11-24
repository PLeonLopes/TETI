import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";
import { ServiceError } from "../utils/serviceError";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "1d";

export const authService = {
	async register(name: string, email: string, password: string) {
		if (!name || !email || !password) {
			throw new ServiceError("Nome, e-mail e senha são obrigatórios.", 400);
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			throw new ServiceError("Já existe um usuário com esse e-mail.", 400);
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: passwordHash,
			},
		});

		const token = jwt.sign({ sub: user.id }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});

		const { password: _, ...safeUser } = user;

		return { user: safeUser, token };
	},

	async login(email: string, password: string) {
		if (!email || !password) {
			throw new ServiceError("E-mail e senha são obrigatórios.", 400);
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			throw new ServiceError("Credenciais inválidas.", 401);
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			throw new ServiceError("Credenciais inválidas.", 401);
		}

		const token = jwt.sign({ sub: user.id }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		});

		const { password: _, ...safeUser } = user;

		return { user: safeUser, token };
	},
};
