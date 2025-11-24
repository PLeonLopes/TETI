"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../../lib/api";
import NewProjectDialog from "../../components/NewProjectDialog";
import Navbar from "@/app/components/Navbar";
import {
	EyeIcon,
	PencilSquareIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { openEditDialog } from "../../components/EditProjectDialog";
import EditProjectDialog from "../../components/EditProjectDialog";

export default function Dashboard() {
	const router = useRouter();
	const queryClient = useQueryClient();

	async function handleDelete(id: number) {
		if (!confirm("Tem certeza que deseja deletar este projeto?")) return;

		await endpoints.projects.remove(id);
		queryClient.invalidateQueries({ queryKey: ["projects"] });
	}

	const { data, isLoading } = useQuery({
		queryKey: ["projects"],
		queryFn: endpoints.projects.getAllProjects,
	});

	if (isLoading) return <p>Carregando projetos…</p>;

	return (
		<>
			<Navbar />
			<main className="min-h-screen bg-gray-50 px-4 py-8">
				<div className="mx-auto flex max-w-6xl items-center justify-between pb-6">
					<div>
						<h2 className="text-3xl font-bold text-gray-900">Projetos</h2>
						<p className="text-sm text-gray-500">
							Gerencie os projetos da sua organização.
						</p>
					</div>

					<NewProjectDialog />
				</div>
				<div className="mx-auto max-w-6xl rounded-xl bg-white p-4 shadow-sm sm:p-6">
					{!data?.data || data.data.length === 0 ? (
						<p className="text-gray-600 text-lg">
							Nenhum projeto ainda. Crie o primeiro no botão acima.
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full border-collapse text-sm">
								<thead>
									<tr className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
										<th className="px-4 py-3">Nome</th>
										<th className="px-4 py-3">Descrição</th>
										<th className="px-4 py-3">Equipe</th>
										<th className="px-4 py-3">Responsáveis</th>
										<th className="px-4 py-3">Ações</th>
									</tr>
								</thead>

								<tbody>
									{data.data.map((p: any, index: number) => {
										const isOdd = index % 2 === 1;

										return (
											<tr
												key={p.id}
												className={
													(isOdd ? "bg-gray-50/70" : "bg-white") +
													" border-b last:border-b-0"
												}
											>
												<td className="px-4 py-3 align-middle text-gray-800">
													{p.name}
												</td>
												<td className="px-4 py-3 align-middle text-gray-800">
													{p.description}
												</td>

												<td className="px-4 py-3 align-middle text-gray-800">
													{p.team?.name || "-"}
												</td>

												<td className="px-4 py-3 align-middle text-gray-800">
													{p.team?.members?.length
														? p.team.members.map((m: any) => m.name).join(", ")
														: "-"}
												</td>

												<td className="px-4 py-2 text-sm text-gray-800 flex items-center space-x-4">
													{/* ABRIR */}
													<button
														className="text-blue-600 hover:text-blue-800 cursor-pointer"
														title="Abrir"
														onClick={() => router.push(`/project/${p.id}`)}
													>
														<EyeIcon className="h-5 w-5" />
													</button>

													{/* EDITAR */}
													<button
														onClick={() => openEditDialog(p)}
														className="text-yellow-600 hover:text-yellow-800 cursor-pointer"
														title="Editar"
													>
														<PencilSquareIcon className="h-5 w-5" />
													</button>

													{/* DELETAR */}
													<button
														className="text-red-600 hover:text-red-800 cursor-pointer"
														title="Deletar"
														onClick={() => handleDelete(p.id)}
													>
														<TrashIcon className="h-5 w-5" />
													</button>
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
			<EditProjectDialog />
		</>
	);
}
