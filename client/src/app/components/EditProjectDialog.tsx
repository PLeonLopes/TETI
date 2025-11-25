"use client";

import { useEffect, useState, FormEvent } from "react";

type Project = {
	id: number;
	name: string;
	description?: string | null;
	teamId?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function openEditDialog(project: Project) {
	const event = new CustomEvent("open-edit-project-dialog", {
		detail: { project },
	});
	window.dispatchEvent(event);
}

export default function EditProjectDialog() {
	const [open, setOpen] = useState(false);
	const [project, setProject] = useState<Project | null>(null);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		function handleOpen(e: CustomEvent<{ project: Project }>) {
			const p = e.detail.project;
			setProject(p);
			setName(p.name ?? "");
			setDescription(p.description ?? "");
			setOpen(true);
		}

		const listener = (e: Event) =>
			handleOpen(e as CustomEvent<{ project: Project }>);

		window.addEventListener("open-edit-project-dialog", listener);
		return () => {
			window.removeEventListener("open-edit-project-dialog", listener);
		};
	}, []);

	if (!open || !project) {
		return null;
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!project) return;

		try {
			setSaving(true);

			const res = await fetch(`${API_URL}/project/${project.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					description,
				}),
			});

			if (!res.ok) {
				console.error("Erro ao atualizar projeto. Status:", res.status);
				alert("Erro ao atualizar projeto.");
				return;
			}

			setOpen(false);
			setProject(null);

			window.location.reload();
		} catch (err) {
			console.error("Erro ao atualizar projeto", err);
			alert("Erro ao atualizar projeto.");
		} finally {
			setSaving(false);
		}
	}

	function handleClose() {
		setOpen(false);
		setProject(null);
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h2 className="mb-4 text-lg font-semibold">Editar projeto</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Nome
						</label>
						<input
							type="text"
							className="mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={name}
							onChange={(e) => setName(e.target.value)}
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

					<div className="mt-4 flex justify-end space-x-2">
						<button
							type="button"
							className="rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
							onClick={handleClose}
							disabled={saving}
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
							disabled={saving}
						>
							{saving ? "Salvando..." : "Salvar alterações"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
