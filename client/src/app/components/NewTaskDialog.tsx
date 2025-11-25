"use client";

import { useState, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../lib/api";

export default function NewTaskDialog({ projectId }: { projectId: number }) {
	const qc = useQueryClient();
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const { mutate, isPending } = useMutation({
		mutationFn: () =>
			endpoints.tasks.create({
				title,
				description,
				projectId,
				priority: "medium",
			}),
		onSuccess: () => {
			setOpen(false);
			setTitle("");
			setDescription("");
			qc.invalidateQueries({ queryKey: ["tasks", projectId] });
		},
	});

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!title || isPending) return;
		mutate();
	}

	// Botão que abre a modal
	if (!open)
		return (
			<button
				onClick={() => setOpen(true)}
				className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-900"
			>
				Nova Tarefa
			</button>
		);

	// Modal
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h2 className="mb-4 text-lg font-semibold text-gray-800">
					Nova tarefa
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Título
						</label>
						<input
							className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Título da tarefa"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Descrição (opcional)
						</label>
						<textarea
							className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Descrição da tarefa"
							rows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
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
							disabled={!title || isPending}
						>
							{isPending ? "Criando..." : "Criar"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
