"use client";
import { useState, FormEvent } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { endpoints } from "../lib/api";

export default function NewProjectDialog() {
	const qc = useQueryClient();
	const { data: teams } = useQuery({
		queryKey: ["teams"],
		queryFn: endpoints.teams.list,
	});
	const { data: users } = useQuery({
		queryKey: ["users"],
		queryFn: endpoints.users.list,
	});

	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [teamId, setTeamId] = useState<number | undefined>();
	const [ownerId, setOwnerId] = useState<number | undefined>();

	const { mutate, isPending } = useMutation({
		mutationFn: () =>
			endpoints.projects.create({
				name,
				description,
				teamId: teamId!,
				ownerId: ownerId!,
			}),
		onSuccess: () => {
			setOpen(false);
			setName("");
			setDescription("");
			setTeamId(undefined);
			setOwnerId(undefined);
			qc.invalidateQueries({ queryKey: ["projects"] });
		},
	});

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!name || !teamId || !ownerId || isPending) return;
		mutate();
	}

	return (
		<div>
			<button
				onClick={() => setOpen(true)}
				className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-900 cursor-pointer"
			>
				Novo Projeto
			</button>

			{/* Modal */}
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
						<h2 className="mb-4 text-lg font-semibold text-gray-800">
							Novo projeto
						</h2>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Nome
								</label>
								<input
									className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Nome do projeto"
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
									className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Descrição do projeto"
									rows={3}
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>

							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Time
									</label>
									<select
										className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 transition"
										value={teamId ?? ""}
										onChange={(e) =>
											setTeamId(
												e.target.value ? Number(e.target.value) : undefined
											)
										}
										required
									>
										<option value="">Selecione um time</option>
										{teams?.data?.map((t: any) => (
											<option key={t.id} value={t.id}>
												{t.name}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">
										Dono do projeto
									</label>
									<select
										className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 transition"
										value={ownerId ?? ""}
										onChange={(e) =>
											setOwnerId(
												e.target.value ? Number(e.target.value) : undefined
											)
										}
										required
									>
										<option value="">Selecione o dono</option>
										{users?.data?.map((u: any) => (
											<option key={u.id} value={u.id}>
												{u.name}
											</option>
										))}
									</select>
								</div>
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
									disabled={!name || !teamId || !ownerId || isPending}
								>
									{isPending ? "Criando..." : "Criar"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
