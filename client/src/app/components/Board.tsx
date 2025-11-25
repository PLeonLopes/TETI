"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../lib/api";
import Column from "./Column";
import type { Task } from "../lib/types";
import EditTaskDialogHost from "./EditTaskDialog";

const ColumnComp: any = Column;

type Status = "todo" | "doing" | "done";

export default function Board({ projectId }: { projectId: number }) {
	const queryClient = useQueryClient();

	const {
		data: tasks = [],
		isLoading,
		// error,
	} = useQuery<Task[]>({
		queryKey: ["tasks", projectId],
		queryFn: async () => {
			const res = await endpoints.tasks.listByProject(projectId);
			const raw = res.data;
			return Array.isArray(raw) ? raw : raw ? [raw] : [];
		},
	});

	const hasInvalidTasks = !Array.isArray(tasks);

	const { data: project } = useQuery<any>({
		queryKey: ["project", projectId],
		queryFn: async () => {
			const res = await endpoints.projects.byId(projectId);
			return res.data;
		},
		enabled: !!projectId,
	});

	const { mutate: moveTask } = useMutation({
		mutationFn: async ({
			taskId,
			status,
		}: {
			taskId: number;
			status: Status;
		}) => {
			return endpoints.tasks.update(taskId, { status });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
		},
	});

	function handleDrop(taskId: number, status: Status) {
		moveTask({ taskId, status });
	}

	if (isLoading) {
		return (
			<div className="flex min-h-[120px] items-center justify-center text-sm text-gray-500">
				Carregando tarefas…
			</div>
		);
	}

	if (hasInvalidTasks) {
		return (
			<div className="flex min-h-[120px] items-center justify-center text-sm text-red-500">
				Erro ao carregar tarefas.
			</div>
		);
	}

	if (tasks.length === 0) {
		return (
			<div className="flex min-h-[120px] items-center justify-center text-sm text-gray-500">
				{!project
					? "Selecione um projeto para ver as tarefas."
					: "Nenhuma tarefa encontrada para este projeto."}
			</div>
		);
	}

	const todo = tasks.filter((t) => t.status === "todo");
	const doing = tasks.filter((t) => t.status === "doing");
	const done = tasks.filter((t) => t.status === "done");
	return (
		<div className="grid gap-4 md:grid-cols-3">
			<ColumnComp
				title="To do"
				tasks={todo}
				status="todo"
				onDropTask={(taskId: number) => handleDrop(taskId, "todo")}
			/>
			<ColumnComp
				title="Doing"
				tasks={doing}
				status="doing"
				onDropTask={(taskId: number) => handleDrop(taskId, "doing")}
			/>
			<ColumnComp
				title="Done"
				tasks={done}
				status="done"
				onDropTask={(taskId: number) => handleDrop(taskId, "done")}
			/>
			<EditTaskDialogHost />
		</div>
	);
}
