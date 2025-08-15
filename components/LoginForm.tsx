"use client";

import { useState } from "react";
import { authService, LoginCredentials } from "@/lib/auth";

interface LoginFormProps {
	onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await authService.login(credentials);
			onLoginSuccess();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Logo and Branding Section */}
				<div className="text-center mb-8">
					<div className="flex justify-center mb-6">
						<img
							src="/logo.png"
							alt="Leikapui Studios Logo"
							className="h-20 w-auto drop-shadow-lg"
						/>
					</div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
						Leikapui Studios
					</h1>
					<h2 className="text-2xl font-semibold text-gray-800 mb-3">
						Movie Sales Dashboard
					</h2>
					<p className="text-gray-600 text-sm leading-relaxed">
						Access real-time insights into movie sales performance and analytics
					</p>
				</div>

				{/* Login Form Card */}
				<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-4">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Email Address
								</label>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
									placeholder="Enter your email"
									value={credentials.email}
									onChange={(e) =>
										setCredentials({ ...credentials, email: e.target.value })
									}
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
									placeholder="Enter your password"
									value={credentials.password}
									onChange={(e) =>
										setCredentials({ ...credentials, password: e.target.value })
									}
								/>
							</div>
						</div>

						{error && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-3">
								<div className="flex items-center">
									<svg
										className="h-5 w-5 text-red-400 mr-2"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clipRule="evenodd"
										/>
									</svg>
									<span className="text-red-700 text-sm font-medium">
										{error}
									</span>
								</div>
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
									Signing in...
								</div>
							) : (
								<div className="flex items-center justify-center">
									<svg
										className="h-5 w-5 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
										/>
									</svg>
									Sign in to Dashboard
								</div>
							)}
						</button>
					</form>

					{/* Footer */}
					<div className="mt-8 pt-6 border-t border-gray-100 text-center">
						<p className="text-xs text-gray-500">
							© 2025 Leikapui Studios. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
