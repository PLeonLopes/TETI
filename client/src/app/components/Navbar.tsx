"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/app/services/authClient";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";

export default function Navbar() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleLogout = async () => {
		try {
			setLoading(true);
			await logout();
			router.push("/auth/login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<header className="border-b bg-white">
			<div className="mx-auto max-w-7xl p-4 flex items-center justify-between">
				<h1 className="text-xl font-semibold">
					<Link href="/">DocFlow</Link>
				</h1>

				<nav>
					<ul className="flex al items-center space-x-4">
						<li>
							<Link
								href="/project/all"
								className="hover:cursor-pointer hover:text-gray-600"
							>
								Projetos
							</Link>
						</li>
						<li>
							<Link
								href="/team/all"
								className="hover:cursor-pointer hover:text-gray-600"
							>
								Equipes
							</Link>
						</li>
						<li>
							<button
								onClick={handleLogout}
								disabled={loading}
								className="text-xl p-2 rounded-md border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 disabled:opacity-60"
								title="Sair"
							>
								{loading ? <span className="text-sm">...</span> : <FiLogOut />}
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
}
