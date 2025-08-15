"use client";

import { useEffect, useMemo, useState } from "react";
import { apiClient, Movie } from "@/lib/api";
import { authService } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ManageUsersPage() {
	const router = useRouter();
	const user = authService.getUser(); // Get user synchronously since auth is already verified
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		assignedMovieId: "",
	});

	const isAdmin = useMemo(() => user?.role === "admin", [user]);

	useEffect(() => {
		const loadMovies = async () => {
			try {
				// Check if user is admin (redirect if not)
				if (!isAdmin) {
					router.replace("/");
					return;
				}

				// Load movies for admin
				console.log("Loading movies for dropdown...");
				const list = await apiClient.getMovies();
				console.log("Movies loaded:", list);
				setMovies(list);
			} catch (e) {
				console.error("Error loading movies:", e);
				setError(e instanceof Error ? e.message : "Failed to load movies");
			} finally {
				setLoading(false);
			}
		};

		loadMovies();
	}, [isAdmin, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		try {
			if (!form.assignedMovieId) {
				setError("Please select a movie to assign");
				return;
			}
			const res = await apiClient.createFilmmakerUser(form);
			setSuccess(res.message || "Filmmaker created");
			setForm({ name: "", email: "", password: "", assignedMovieId: "" });
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to create user");
		}
	};

	// Show loading while loading movies
	if (loading) {
		return (
			<div className="max-w-2xl mx-auto p-4 sm:p-6 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-2 text-gray-600">Loading movies...</p>
				</div>
			</div>
		);
	}

	if (!isAdmin) return null;

	return (
		<div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
			<h2 className="text-xl sm:text-2xl font-semibold">Create Filmmaker</h2>

			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Name
					</label>
					<input
						className="mt-1 block w-full rounded border px-3 py-2"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						type="email"
						className="mt-1 block w-full rounded border px-3 py-2"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Password
					</label>
					<input
						type="password"
						className="mt-1 block w-full rounded border px-3 py-2"
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Assign Movie
					</label>
					<select
						className="mt-1 block w-full rounded border px-3 py-2"
						value={form.assignedMovieId}
						onChange={(e) =>
							setForm({ ...form, assignedMovieId: e.target.value })
						}
						required
					>
						<option value="" disabled>
							Select a movie
						</option>
						{movies.map((m) => (
							<option key={m._id} value={m._id}>
								{m.title}
							</option>
						))}
					</select>
				</div>

				{error && (
					<div className="text-sm text-red-600">
						{error}
						{error.includes("Token is invalid") ||
						error.includes("Authentication failed") ? (
							<button
								onClick={() => window.location.reload()}
								className="ml-2 text-blue-600 hover:text-blue-800 underline"
							>
								Refresh Page
							</button>
						) : null}
					</div>
				)}
				{success && <div className="text-sm text-green-600">{success}</div>}

				<button
					type="submit"
					className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Create Filmmaker
				</button>
			</form>
		</div>
	);
}
