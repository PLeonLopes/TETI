export type User = { id: number; name: string; email: string };
export type Team = { id: number; name: string; description?: string };
export type Project = {
	id: number;
	name: string;
	description?: string;
	teamId: number;
	ownerId: number;
};
export type Task = {
	id: number;
	title: string;
	description?: string;
	status: "todo" | "doing" | "done";
	priority: "low" | "medium" | "high";
	projectId: number;
	assignedId?: number;
	dueDate?: string;
};
