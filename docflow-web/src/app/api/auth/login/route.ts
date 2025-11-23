import { NextResponse } from "next/server";

const API_URL = "https://teti-front-jx8y.onrender.com/";

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		const apiResponse = await fetch(`${API_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		if (!apiResponse.ok) {
			const errorData = await apiResponse.json().catch(() => ({}));
			return NextResponse.json(
				{ message: errorData.message ?? "Credenciais inválidas" },
				{ status: 401 }
			);
		}

		const data = await apiResponse.json();
		const { token, user } = data;

		const res = NextResponse.json({ user });

		res.cookies.set("auth_token", token, {
			httpOnly: true,
			sameSite: "lax",
			path: "/",
		});

		return res;
	} catch (error) {
		console.error("Erro no /api/auth/login:", error);
		return NextResponse.json(
			{ message: "Erro ao realizar login" },
			{ status: 500 }
		);
	}
}
