"use client";
import { useRef, useState, type DragEvent } from "react";
import type { Task } from "../lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../lib/api";
import { openEditTaskDialog } from "./EditTaskDialog";

type TaskCardProps = {
	task: Task;
	draggable?: boolean;
	onDragStart?: (task: Task, event: DragEvent<HTMLDivElement>) => void;
	onDragEnd?: (task: Task, event: DragEvent<HTMLDivElement>) => void;
	onEdit?: (task: Task) => void;
};

export default function TaskCard({
	task,
	draggable = false,
	onDragStart,
	onDragEnd,
	onEdit,
}: TaskCardProps) {
	const qc = useQueryClient();
	const { mutate: updateStatus } = useMutation({
		mutationFn: (status: Task["status"]) =>
			endpoints.tasks.update(task.id, { status }),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["tasks", task.projectId] }),
	});

	const { mutate: deleteTask } = useMutation({
		mutationFn: () => endpoints.tasks.remove(task.id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["tasks", task.projectId] }),
	});

	const [showDelete, setShowDelete] = useState(false);
	const pressTimerRef = useRef<number | null>(null);

	const startPressTimer = () => {
		if (pressTimerRef.current) {
			window.clearTimeout(pressTimerRef.current);
		}
		pressTimerRef.current = window.setTimeout(() => {
			setShowDelete(true);
		});
	};

	const cancelPressTimer = (hide = false) => {
		if (pressTimerRef.current) {
			window.clearTimeout(pressTimerRef.current);
			pressTimerRef.current = null;
		}
		if (hide) {
			setShowDelete(false);
		}
	};

	const handleDeleteClick = () => {
		if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;
		deleteTask();
		setShowDelete(false);
	};

	const baseCardClasses =
		"relative flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md";
	const dragClasses = draggable ? " cursor-grab active:cursor-grabbing" : "";

	return (
		<div
			className={baseCardClasses + dragClasses}
			draggable={draggable}
			tabIndex={0}
			onDragStart={(event) => {
				if (!draggable) return;
				event.dataTransfer.setData("text/plain", String(task.id));
				onDragStart?.(task, event);
			}}
			onDragEnd={(event) => {
				if (!draggable) return;
				onDragEnd?.(task, event);
			}}
			onMouseDown={startPressTimer}
			onMouseUp={() => cancelPressTimer()}
			onMouseLeave={() => {
				cancelPressTimer(true);
				setShowDelete(false);
			}}
			onMouseEnter={() => setShowDelete(true)}
			onTouchStart={startPressTimer}
			onTouchEnd={() => cancelPressTimer(true)}
			onTouchCancel={() => cancelPressTimer(true)}
			onBlur={() => setShowDelete(false)}
		>
			{showDelete && (
				<div className="absolute -right-2 -top-2 flex gap-1">
					<button
						type="button"
						onClick={() => openEditTaskDialog(task)}
						className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-500 shadow hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
						aria-label="Editar tarefa"
						title="Editar tarefa"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							className="h-3 w-3"
							fill="currentColor"
						>
							<path d="M4 17.25V20h2.75L17.81 8.94l-2.75-2.75L4 17.25Zm13.71-9.04a1 1 0 0 0 0-1.41l-1.51-1.51a1 1 0 0 0-1.41 0l-1.34 1.34 2.75 2.75 1.51-1.51Z" />
						</svg>
					</button>
					<button
						type="button"
						onClick={handleDeleteClick}
						className="flex h-6 w-6 items-center justify-center rounded-full border border-red-100 bg-white text-red-500 shadow hover:bg-red-50 hover:text-red-600 cursor-pointer"
						aria-label="Excluir tarefa"
						title="Excluir tarefa"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							className="h-3 w-3"
							fill="currentColor"
						>
							<path d="M9 3a1 1 0 0 0-.894.553L7.382 5H4a1 1 0 1 0 0 2h.154l.72 11.043A2 2 0 0 0 6.87 20h10.26a2 2 0 0 0 1.996-1.957L19.846 7H20a1 1 0 1 0 0-2h-3.382l-.724-1.447A1 1 0 0 0 15 3H9Zm1.618 4.076a1 1 0 0 0-.99.924l-.5 8a1 1 0 1 0 1.992.124l.5-8a1 1 0 0 0-.002-.216 1 1 0 0 0-1-.832Zm4.764 0a1 1 0 0 0-.99.924l-.5 8a1 1 0 1 0 1.992.124l.5-8a1 1 0 0 0-.002-.216 1 1 0 0 0-.99-.832Z" />
						</svg>
					</button>
				</div>
			)}
			<div className="flex items-center justify-between">
				<h4 className="font-medium">{task.title}</h4>
			</div>
			{task.description && (
				<p className="text-xs text-gray-600 leading-snug">{task.description}</p>
			)}
		</div>
	);
}
