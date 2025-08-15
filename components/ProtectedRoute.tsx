"use client";

import { useEffect, useState } from "react";
import { authService, User } from "@/lib/auth";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import LoginForm from "./LoginForm";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	console.log("🔐 ProtectedRoute: Component mounted");
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				// First check if there's a token at all
				const token = authService.getToken();
				console.log(
					"🔐 ProtectedRoute: Token check result:",
					token ? "Found" : "Not found"
				);
				if (!token) {
					console.log(
						"🔐 ProtectedRoute: No token found, redirecting to login"
					);
					setIsAuthenticated(false);
					setIsLoading(false);
					return;
				}

				// Check if token is expiring soon
				if (authService.isTokenExpiringSoon()) {
					console.warn("Token expiring soon, redirecting to login");
					await authService.logout();
					setIsAuthenticated(false);
					setIsLoading(false);
					return;
				}

				// Verify token with backend
				console.log("Verifying token with backend...");
				const isValid = await authService.verifyToken();
				console.log("Token verification result:", isValid);

				if (isValid) {
					setUser(authService.getUser());
					setIsAuthenticated(true);
				} else {
					console.log(
						"Token verification failed, clearing auth and redirecting to login"
					);
					await authService.logout(); // Clear invalid tokens
					setUser(null);
					setIsAuthenticated(false);
				}
			} catch (error) {
				console.error("Auth check failed:", error);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	const handleLoginSuccess = () => {
		setIsAuthenticated(true);
		setUser(authService.getUser());
		// Force a page refresh to ensure all components re-render with new auth state
		window.location.reload();
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Checking authentication...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <LoginForm onLoginSuccess={handleLoginSuccess} />;
	}

	return (
		<div className="min-h-screen bg-gray-50 overflow-x-hidden">
			{/* Desktop Sidebar - Hidden on mobile */}
			<div className="hidden md:block">{user && <Sidebar user={user} />}</div>

			{/* Mobile Navigation - Only visible on mobile */}
			<div className="md:hidden">{user && <MobileNav user={user} />}</div>

			{/* Main Content - No left margin on mobile */}
			<div className="w-full md:ml-64 md:w-[calc(100vw-16rem)] overflow-x-hidden">
				<main className="pt-20 md:pt-6 px-2 sm:px-4 md:px-6 py-4 md:py-6 w-full max-w-full overflow-x-hidden box-border">
					{children}
				</main>
			</div>
		</div>
	);
}
