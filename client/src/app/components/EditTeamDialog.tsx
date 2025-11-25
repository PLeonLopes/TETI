"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../lib/api";

type EditTeamDialogProps = {
	team: any;
	onClose: () => void;
};

type User = {
	id: number;
	name: string;
	email: string;
};

export default function EditTeamDialog({ team, onClose }: EditTeamDialogProps) {
	const qc = useQueryClient();
	const [name, setName] = useState(team.name ?? "");
	const [description, setDescription] = useState(team.description ?? "");
	const [users, setUsers] = useState<User[]>([]);
	const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>(
		team.members?.map((m: any) => m.userId) ?? []
	);
	const [memberSearch, setMemberSearch] = useState("");

	useEffect(() => {
		setName(team.name ?? "");
		setDescription(team.description ?? "");
		setSelectedMemberIds(team.members?.map((m: any) => m.userId) ?? []);
	}, [team]);

	useEffect(() => {
		let isMounted = true;

		async function loadUsers() {
			try {
				const res = await endpoints.users.list();
				if (!isMounted) return;

				const list = Array.isArray(res)
					? res
					: Array.isArray((res as any)?.data)
					? (res as any).data
					: [];

				setUsers(list);
			} catch (error) {
				console.error("Erro ao carregar usuários:", error);
			}
		}

		loadUsers();

		return () => {
			isMounted = false;
		};
	}, []);

	function toggleMember(userId: number) {
		setSelectedMemberIds((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId]
		);
	}

	const filteredUsers = users.filter((user) => {
		if (!memberSearch.trim()) return true;
		const term = memberSearch.toLowerCase();
		return (
			user.email.toLowerCase().includes(term) ||
			user.name.toLowerCase().includes(term)
		);
	});

	const { mutate, isPending } = useMutation({
		mutationFn: () =>
			endpoints.teams.update(team.id, {
				name,
				description,
				memberIds: selectedMemberIds,
			} as any),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["teams"] });
			qc.invalidateQueries({ queryKey: ["team", team.id] });
			onClose();
		},
	});

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!name || isPending) return;
		mutate();
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-800">Editar equipe</h2>
					<button
						onClick={onClose}
						className="text-sm text-gray-500 hover:text-gray-700"
					>
						✕
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Nome
						</label>
						<input
							className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							className="mt-2 w-full rounded-md border border-gray-300 px-3 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							placeholder="Buscar membro pelo e-mail..."
							value={memberSearch}
							onChange={(e) => setMemberSearch(e.target.value)}
						/>

						<div className="mt-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
							{selectedMemberIds.length === 0 ? (
								<p className="text-xs text-gray-400">
									Nenhum membro selecionado.
								</p>
							) : (
								<div className="flex flex-wrap gap-2">
									{selectedMemberIds.map((id) => {
										const user = users.find((u) => u.id === id);
										if (!user) return null;
										return (
											<span
												key={id}
												className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
											>
												{user.name}
												<button
													type="button"
													onClick={() => toggleMember(id)}
													className="text-[10px] text-blue-700 hover:text-blue-900"
												>
													✕
												</button>
											</span>
										);
									})}
								</div>
							)}

							<div className="mt-3 flex flex-wrap gap-2">
								{filteredUsers.map((user) => {
									const isSelected = selectedMemberIds.includes(user.id);
									return (
										<button
											key={user.id}
											type="button"
											onClick={() => toggleMember(user.id)}
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
						</div>

						<p className="mt-1 text-xs text-gray-400">
							Você pode adicionar ou remover membros desta equipe a qualquer
							momento.
						</p>
					</div>

					<div className="mt-4 flex justify-end space-x-2">
						<button
							type="button"
							className="rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
							onClick={onClose}
							disabled={isPending}
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
							disabled={!name || isPending}
						>
							{isPending ? "Salvando..." : "Salvar"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
