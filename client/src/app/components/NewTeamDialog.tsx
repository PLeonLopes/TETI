"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../lib/api";

export default function NewTeamDialog() {
	const qc = useQueryClient();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
	const [memberSearch, setMemberSearch] = useState("");

	const { data: usersResponse } = useQuery({
		queryKey: ["users"],
		queryFn: () => endpoints.users.list(),
	});
	const users = (usersResponse as any)?.data ?? usersResponse ?? [];

	const filteredUsers = Array.isArray(users)
		? users.filter((user: any) => {
				if (!memberSearch) return true;
				const search = memberSearch.toLowerCase();
				return (
					user.email?.toLowerCase().includes(search) ||
					user.name?.toLowerCase().includes(search)
				);
		  })
		: [];

	const { mutate, isPending } = useMutation({
		mutationFn: () => {
			const payload: any = { name };
			if (description) payload.description = description;
			if (selectedMemberIds.length > 0) {
				payload.memberIds = selectedMemberIds.map((id) => Number(id));
			}
			return endpoints.teams.create(payload);
		},
		onSuccess: () => {
			setOpen(false);
			setName("");
			setDescription("");
			setSelectedMemberIds([]);
			setMemberSearch("");
			qc.invalidateQueries({ queryKey: ["teams"] });
		},
	});

	function toggleMemberSelection(userId: string) {
		setSelectedMemberIds((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId]
		);
	}

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!name || isPending) return;
		mutate();
	}

	if (!open)
		return (
			<button
				onClick={() => setOpen(true)}
				className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-900 cursor-pointer"
			>
				Nova Equipe
			</button>
		);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h2 className="mb-4 text-lg font-semibold text-gray-800">
					Nova equipe
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Nome
						</label>
						<input
							className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Nome da equipe"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Descrição (opcional)
						</label>
						<textarea
							className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Descrição da equipe"
							rows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Membros (opcional)
						</label>
						<p className="mt-1 text-xs text-gray-500">
							Selecione um ou mais membros para fazerem parte desta equipe.
						</p>
						<input
							type="text"
							value={memberSearch}
							onChange={(e) => setMemberSearch(e.target.value)}
							placeholder="Buscar membro pelo e-mail..."
							className="mt-2 w-full rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
						<div className="mt-2 flex flex-wrap gap-2 max-h-40 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-2">
							{filteredUsers.length === 0 && (
								<span className="text-xs text-gray-400">
									Nenhum usuário disponível para seleção.
								</span>
							)}
							{filteredUsers.map((user: any) => {
								const isSelected = selectedMemberIds.includes(String(user.id));
								return (
									<button
										key={user.id}
										type="button"
										onClick={() => toggleMemberSelection(String(user.id))}
										className={`rounded-full border px-3 py-1 text-xs transition ${
											isSelected
												? "border-blue-600 bg-blue-600 text-white"
												: "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600"
										}`}
									>
										<span className="font-medium">{user.name}</span>
										<span className="ml-1 text-[10px] opacity-80">
											({user.email})
										</span>
									</button>
								);
							})}
						</div>
						<p className="mt-1 text-xs text-gray-400">
							Você pode adicionar aqui membros iniciais da equipe. Mais membros
							podem ser adicionados depois.
						</p>
					</div>

					<div className="mt-4 flex justify-end space-x-2">
						<button
							type="button"
							className="rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							onClick={() => setOpen(false)}
							disabled={isPending}
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
							disabled={!name || isPending}
						>
							{isPending ? "Criando..." : "Criar"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
