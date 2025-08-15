"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService, User } from "@/lib/auth";
import { useState } from "react";

interface MobileNavProps {
	user: User;
}

export default function MobileNav({ user }: MobileNavProps) {
	const pathname = usePathname();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	const isActive = (href: string) =>
		pathname === href ? "bg-blue-50 text-blue-700" : "text-gray-700";

	const handleLogout = async () => {
		await authService.logout();
		router.replace("/");
		window.location.reload();
	};

	const closeMenu = () => setIsOpen(false);

	return (
		<>
			{/* Mobile Header */}
			<div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-30 shadow-sm w-full box-border">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<img
							src="/logo.png"
							alt="Leikapui Studios Logo"
							className="h-6 w-auto mr-2"
							onError={(e) => {
								e.currentTarget.style.display = "none";
							}}
						/>
						<div className="text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							Leikapui Studios
						</div>
					</div>

					{/* Hamburger Button */}
					<button
						onClick={() => setIsOpen(!isOpen)}
						className={`p-3 rounded-lg transition-all duration-200 border ${
							isOpen
								? "text-blue-600 bg-blue-50 border-blue-300"
								: "text-gray-700 bg-gray-50 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
						}`}
						aria-label="Toggle mobile menu"
					>
						{isOpen ? (
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						) : (
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						)}
					</button>
				</div>
			</div>

			{/* Mobile Offcanvas Menu */}
			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
						onClick={closeMenu}
					/>

					{/* Offcanvas Menu */}
					<div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
						<div className="flex flex-col h-full">
							{/* Header */}
							<div className="px-6 py-6 border-b border-gray-200">
								<div className="flex items-center mb-4">
									<img
										src="/logo.png"
										alt="Leikapui Studios Logo"
										className="h-10 w-auto mr-3"
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
							<nav className="flex-1 px-6 py-6 space-y-2">
								<Link
									href="/"
									className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${isActive(
										"/"
									)}`}
									onClick={closeMenu}
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
										className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${isActive(
											"/admin/users"
										)}`}
										onClick={closeMenu}
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
							<div className="px-6 py-6 border-t border-gray-200">
								<button
									onClick={async () => {
										await handleLogout();
										closeMenu();
									}}
									className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center"
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
					</div>
				</>
			)}
		</>
	);
}
