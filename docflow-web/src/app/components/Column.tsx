import type { DragEvent } from "react";
import TaskCard from "./TaskCard";
import type { Task } from "../lib/types";

type Status = "todo" | "doing" | "done";

type ColumnProps = {
	title: string;
	tasks: Task[];
	status: Status;
	onDropTask?: (taskId: number) => void;
};

export default function Column({
	title,
	tasks,
	status,
	onDropTask,
}: ColumnProps) {
	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const idStr = event.dataTransfer.getData("text/plain");
		if (!idStr) return;
		const taskId = Number(idStr);
		if (Number.isNaN(taskId)) return;
		onDropTask?.(taskId);
	};

	const statusBorderColors: Record<Status, string> = {
		todo: "border-blue-100",
		doing: "border-yellow-100",
		done: "border-emerald-100",
	};

	return (
		<div
			className={`flex flex-col rounded-xl bg-gray-100 px-3 py-4 border ${statusBorderColors[status]}`}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			<div className="mb-3 flex items-center justify-between">
				<h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
					{title}
				</h3>
				<span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
					{tasks.length}
				</span>
			</div>

			<div className="flex flex-col gap-3">
				{tasks.map((t) => (
					<TaskCard key={t.id} task={t} draggable />
				))}

				{tasks.length === 0 && (
					<p className="text-xs italic text-gray-400">
						Nenhuma tarefa aqui ainda.
					</p>
				)}
			</div>
		</div>
	);
}
