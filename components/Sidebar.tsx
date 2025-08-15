"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService, User } from "@/lib/auth";
import { useCallback } from "react";

interface SidebarProps {
	user: User;
}

export default function Sidebar({ user }: SidebarProps) {
	const pathname = usePathname();
	const router = useRouter();

	const isActive = useCallback(
		(href: string) =>
			pathname === href
				? "bg-blue-50 text-blue-700"
				: "text-gray-700 hover:bg-gray-50",
		[pathname]
	);

	const handleLogout = async () => {
		await authService.logout();
		router.replace("/");
		window.location.reload();
	};

	return (
		<aside className="hidden md:flex md:flex-col w-64 bg-white border-r h-screen fixed left-0 top-0 z-10">
			<div className="flex flex-col h-full">
				{/* Header */}
				<div className="px-4 py-5 border-b flex-shrink-0">
					<div className="flex items-center mb-3">
						<img
							src="/logo.png"
							alt="Leikapui Studios Logo"
							className="h-8 w-auto mr-3"
						/>
						<div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							Leikapui Studios
						</div>
					</div>
					<div className="text-sm font-medium text-gray-700 mb-1">
						Dashboard
					</div>
					<div className="text-xs text-gray-500">
						{user.name} • {user.role === "admin" ? "Admin" : "Filmmaker"}
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
					<Link
						href="/"
						className={`block px-3 py-3 rounded-lg transition-colors duration-200 ${isActive(
							"/"
						)}`}
					>
						<div className="flex items-center">
							<svg
								className="h-5 w-5 mr-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 5v14"
								/>
							</svg>
							Dashboard
						</div>
					</Link>
					{user.role === "admin" && (
						<Link
							href="/admin/users"
							className={`block px-3 py-3 rounded-lg transition-colors duration-200 ${isActive(
								"/admin/users"
							)}`}
						>
							<div className="flex items-center">
								<svg
									className="h-5 w-5 mr-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
									/>
								</svg>
								Manage Users
							</div>
						</Link>
					)}
				</nav>

				{/* Footer */}
				<div className="px-4 py-4 border-t flex-shrink-0">
					<button
						onClick={handleLogout}
						className="w-full text-left px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center"
					>
						<svg
							className="h-5 w-5 mr-3"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
						Logout
					</button>
				</div>
			</div>
		</aside>
	);
}
