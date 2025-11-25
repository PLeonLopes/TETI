import type { Project } from "../lib/types";
import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {
	return (
		<Link href={`/project/${project.id}`} className="block">
			<div className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition">
				<h3 className="text-lg font-medium">{project.name}</h3>
				{project.description && (
					<p className="mt-1 text-sm text-gray-600 line-clamp-2">
						{project.description}
					</p>
				)}
			</div>
		</Link>
	);
}
