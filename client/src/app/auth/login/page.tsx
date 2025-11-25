"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../services/authClient";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const data = await login(email, password);
			console.log("Login OK, user:", data.user);

			localStorage.setItem("authToken", data.token);
			router.push("/project/all");
		} catch (err: any) {
			console.error(err);
			setError(err.message ?? "Erro ao fazer login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex h-screen items-center justify-center bg-gray-100 px-4">
			<div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md">
				<h1 className="mb-4 text-center text-2xl font-semibold">Entrar</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						className="w-full rounded-md border px-3 py-2 text-sm"
						placeholder="E-mail"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<input
						className="w-full rounded-md border px-3 py-2 text-sm"
						placeholder="Senha"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					{error && <p className="text-red-500 text-sm text-center">{error}</p>}

					<button
						type="submit"
						disabled={loading || !email || !password}
						className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
					>
						{loading ? "Entrando..." : "Entrar"}
					</button>

					<p className="text-center text-sm text-gray-600">
						Não tem conta?{" "}
						<a href="/auth/register" className="text-blue-600 hover:underline">
							Criar conta
						</a>
					</p>
				</form>
			</div>
		</div>
	);
}
