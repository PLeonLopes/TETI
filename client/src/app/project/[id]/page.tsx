"use client";

import { useParams } from "next/navigation";
import Board from "../../components/Board";
import NewTaskDialog from "../../components/NewTaskDialog";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../../lib/api";
import Navbar from "@/app/components/Navbar";

export default function ProjectBoardPage() {
	const params = useParams();
	const id = Number(params.id);

	const { data: project } = useQuery<any>({
		queryKey: ["project", id],
		queryFn: async () => {
			const res = await endpoints.projects.byId(id);
			return res.data;
		},
		enabled: !!id,
	});

	if (!id) return <p>Carregando projeto…</p>;

	if (!project) return <p>Projeto não encontrado.</p>;

	return (
		<>
			<Navbar />

			{/* CONTAINER PRINCIPAL COM FUNDO SUAVE */}
			<div className="min-h-screen bg-gray-50 px-4 py-8">
				<div className="mx-auto max-w-6xl space-y-6">
					{/* HEADER DO PROJETO */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 className="text-3xl font-bold text-gray-900">
								Projeto {project.name}
							</h2>
							<p className="text-sm text-gray-500">
								Organize e acompanhe as tarefas deste projeto no quadro abaixo.
							</p>
						</div>

						<div className="flex justify-start sm:justify-end">
							<NewTaskDialog projectId={id} />
						</div>
					</div>

					{/* QUADRO KANBAN EM CARD */}
					<div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
						<Board projectId={id} />
					</div>
				</div>
			</div>
		</>
	);
}
