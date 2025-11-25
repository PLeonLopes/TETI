"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/app/components/Navbar";
import { endpoints } from "@/app/lib/api";
import NewTeamDialog from "@/app/components/NewTeamDialog";
import EditTeamDialog from "@/app/components/EditTeamDialog";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

type Team = any;

export default function TeamsPage() {
	const qc = useQueryClient();
	const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);

	const { data, isLoading } = useQuery({
		queryKey: ["teams"],
		queryFn: endpoints.teams.list,
	});

	const { mutate: deleteTeam } = useMutation({
		mutationFn: (id: number) => endpoints.teams.remove(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["teams"] });
		},
	});

	const teams: Team[] = data?.data ?? [];

	// console.log("TEAMS LIST:", teams);

	function handleDelete(team: Team) {
		if (
			confirm(
				`Tem certeza que deseja excluir a equipe "${team.name}"? Esta ação não pode ser desfeita.`
			)
		) {
			deleteTeam(team.id);
		}
	}

	return (
		<>
			<Navbar />

			<main className="min-h-screen bg-gray-50 px-4 py-8">
				<div className="mx-auto flex max-w-6xl items-center justify-between pb-6">
					<div>
						<h2 className="text-3xl font-bold text-gray-900">Equipes</h2>
						<p className="text-sm text-gray-500">
							Gerencie as equipes e veja seus integrantes.
						</p>
					</div>

					<NewTeamDialog />
				</div>

				<div className="mx-auto max-w-6xl rounded-xl bg-white p-4 shadow-sm sm:p-6">
					{isLoading ? (
						<p className="text-sm text-gray-500">Carregando equipes…</p>
					) : teams.length === 0 ? (
						<p className="text-sm text-gray-500">
							Nenhuma equipe cadastrada ainda.
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full border-collapse text-sm">
								<thead>
									<tr className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
										<th className="px-4 py-3">Nome</th>
										<th className="px-4 py-3">Descrição</th>
										<th className="px-4 py-3">Membros</th>
										<th className="px-4 py-3 text-center">Ações</th>
									</tr>
								</thead>
								<tbody>
									{teams.map((team: any, index: number) => {
										const members =
											team.members ??
											team.users ??
											(team.owner ? [team.owner] : []);

										const memberNames = members
											.map((m: any) => m.user?.name ?? m.name)
											.filter(Boolean);

										const isOdd = index % 2 === 1;

										return (
											<tr
												key={team.id}
												className={
													(isOdd ? "bg-gray-50/70" : "bg-white") +
													" border-b last:border-b-0"
												}
											>
												<td className="px-4 py-3 align-middle text-gray-800">
													{team.name}
												</td>
												<td className="px-4 py-3 align-middle text-gray-600">
													{team.description || "-"}
												</td>
												<td className="px-4 py-3 align-middle text-gray-600">
													{memberNames.length > 0
														? memberNames.join(", ")
														: "-"}
												</td>
												<td className="px-4 py-3 text-center align-middle">
													<div className="inline-flex items-center gap-3 text-xs">
														{/* EDITAR */}
														<button
															onClick={() => setTeamToEdit(team)}
															className="text-yellow-600 hover:text-yellow-800 cursor-pointer"
															title="Editar"
														>
															<PencilSquareIcon className="h-5 w-5" />
														</button>

														{/* DELETAR */}
														<button
															className="text-red-600 hover:text-red-800 cursor-pointer"
															title="Deletar"
															onClick={() => handleDelete(team)}
														>
															<TrashIcon className="h-5 w-5" />
														</button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</main>

			{/* Modal Editar */}
			{teamToEdit && (
				<EditTeamDialog team={teamToEdit} onClose={() => setTeamToEdit(null)} />
			)}
		</>
	);
}
