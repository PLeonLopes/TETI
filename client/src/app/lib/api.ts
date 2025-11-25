import axios from "axios";

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});

export function setAuthToken(token: string | null) {
	if (token) {
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		localStorage.setItem("authToken", token);
	} else {
		delete api.defaults.headers.common["Authorization"];
		localStorage.removeItem("authToken");
	}
}

export const endpoints = {
	auth: {
		login: (payload: { email: string; password: string }) =>
			api.post("/auth/login", payload),

		register: (payload: { name: string; email: string; password: string }) =>
			api.post("/auth/register", payload),
	},
	projects: {
		getAllProjects: () => api.get("/project/all").then((r) => r.data),
		create: (data: {
			name: string;
			description?: string;
			teamId: number;
			ownerId: number;
		}) => api.post("/project/create", data).then((r) => r.data),
		byId: (id: number) => api.get(`/project/${id}`).then((r) => r.data),
		update: (
			id: number,
			data: Partial<{
				name: string;
				description?: string;
				teamId: number;
				ownerId: number;
			}>
		) => api.put(`/project/${id}`, data).then((r) => r.data),
		remove: (id: number) => api.delete(`/project/${id}`).then((r) => r.data),
	},
	tasks: {
		listByProject: (projectId: number) =>
			api.get(`/projects/${projectId}/tasks`).then((r) => r.data),
		create: (data: {
			title: string;
			description?: string;
			projectId: number;
			assignedId?: number;
			priority?: string;
			dueDate?: string;
		}) => api.post("/task/create", data).then((r) => r.data),
		update: (
			id: number,
			data: Partial<{
				title: string;
				description?: string;
				status: string;
				priority: string;
				assignedId?: number;
				dueDate?: string;
			}>
		) => api.put(`/task/${id}`, data).then((r) => r.data),
		remove: (id: number) => api.delete(`/task/${id}`).then((r) => r.data),
	},
	teams: {
		list: () => api.get("/team/all").then((r) => r.data),
		byId: (id: number) => api.get(`/team/${id}`).then((r) => r.data),
		create: (data: { name: string; description?: string }) =>
			api.post("/team/create", data).then((r) => r.data),
		update: (
			id: number,
			data: Partial<{ name: string; description?: string }>
		) => api.put(`/team/${id}`, data).then((r) => r.data),
		remove: (id: number) => api.delete(`/team/${id}`).then((r) => r.data),
	},
	users: {
		list: () => api.get("/user/all").then((r) => r.data),
	},
};
