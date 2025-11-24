"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { endpoints, setAuthToken } from "@/app/lib/api";
import { useMutation } from "@tanstack/react-query";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { mutate, isPending } = useMutation({
		mutationFn: () => endpoints.auth.register({ name, email, password }),
		onSuccess: (res) => {
			const token = res.data.token;
			setAuthToken(token);
			router.push("/auth/login");
		},
		onError: (err: any) =>
			alert(err?.response?.data?.message ?? "Erro ao registrar"),
	});

	function handleSubmit(e: any) {
		e.preventDefault();
		mutate();
	}

	return (
		<div className="flex h-screen items-center justify-center bg-gray-100 px-4">
			<div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md">
				<h1 className="mb-4 text-center text-2xl font-semibold">Criar Conta</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						className="w-full rounded-md border px-3 py-2 text-sm"
						placeholder="Nome completo"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

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

					<button
						type="submit"
						disabled={isPending || !name || !email || !password}
						className={`w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-60`}
					>
						{isPending ? "Criando..." : "Criar conta"}
					</button>

					<p className="text-center text-sm text-gray-600">
						Já tem conta?{" "}
						<a href="/auth/login" className="text-blue-600 hover:underline">
							Entrar
						</a>
					</p>
				</form>
			</div>
		</div>
	);
}
