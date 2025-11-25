"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../lib/api";
import type { Task } from "../lib/types";

// --- pequeno "event bus" em memória para abrir o modal ---

type Listener = (task: Task | null) => void;
let listeners: Listener[] = [];

export function openEditTaskDialog(task: Task) {
	listeners.forEach((fn) => fn(task));
}

// --- componente host: deve ser renderizado uma vez na tela ---

export default function EditTaskDialogHost() {
	const [task, setTask] = useState<Task | null>(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const qc = useQueryClient();

	const { mutateAsync: updateTask, isPending } = useMutation({
		mutationFn: (data: Partial<Task>) => endpoints.tasks.update(task!.id, data),
		onSuccess: (_, variables) => {
			if (!task) return;
			qc.invalidateQueries({ queryKey: ["tasks", task.projectId] });
		},
	});

	useEffect(() => {
		const listener: Listener = (t) => {
			setTask(t);
			if (t) {
				setTitle(t.title);
				setDescription(t.description ?? "");
			}
		};
		listeners.push(listener);
		return () => {
			listeners = listeners.filter((l) => l !== listener);
		};
	}, []);

	if (!task) return null;

	const handleClose = () => {
		setTask(null);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!task) return;

		try {
			await updateTask({
				title,
				description: description || undefined,
			});
			handleClose();
		} catch (err) {
			console.error("Erro ao atualizar tarefa:", err);
			alert("Erro ao atualizar tarefa.");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h2 className="mb-4 text-lg font-semibold">Editar tarefa</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Título
						</label>
						<input
							type="text"
							className="mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Descrição
						</label>
						<textarea
							className="mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							rows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div className="mt-4 flex justify-end gap-2">
						<button
							type="button"
							onClick={handleClose}
							className="rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
							disabled={isPending}
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
							disabled={isPending || !title.trim()}
						>
							{isPending ? "Salvando..." : "Salvar"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
