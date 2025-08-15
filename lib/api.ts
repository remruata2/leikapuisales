const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

import { authService } from "./auth";

export interface Transaction {
	_id: string;
	user: {
		_id: string;
		email: string;
		name?: string;
	} | null;
	contentId: {
		_id: string;
		title: string;
		horizontal_poster?: string;
		ppv_cost?: number;
	} | null;
	contentType: string;
	amount: number;
	status: string;
	created_at: string;
	paymentReference?: string;
	deviceInfo?: {
		platform: string;
		appVersion: string;
	};
	lastUpdated?: string;
	metadata?: Record<string, unknown>;
	razorpayPaymentId?: string;
}

export interface Movie {
	_id: string;
	title: string;
	description?: string;
	horizontal_poster?: string;
	ppv_cost?: number;
}

export interface SalesStatistics {
	totalRevenue: number;
	totalTransactions: number;
	averageTransactionValue: number;
	topSellingMovies: Array<{
		_id: {
			_id: string;
			title: string;
			horizontal_poster?: string;
			ppv_cost?: number;
		};
		totalSales: number;
		totalTransactions: number;
	}>;
	transactions: Transaction[];
}

class ApiClient {
	private baseUrl: string;

	constructor() {
		this.baseUrl = API_BASE_URL;
		console.log("API Client initialized with URL:", this.baseUrl);
	}

	async createFilmmakerUser(params: {
		name: string;
		email: string;
		password: string;
		assignedMovieId: string;
	}): Promise<{ success: boolean; message: string }> {
		const token = authService.getToken();
		if (!token) {
			throw new Error("No authentication token found. Please login again.");
		}

		console.log(
			"Creating filmmaker with token:",
			token.substring(0, 20) + "..."
		);

		const response = await fetch(`${this.baseUrl}/api/admin/users`, {
			method: "POST",
			headers: this.getHeaders(),
			body: JSON.stringify({
				name: params.name,
				email: params.email,
				password: params.password,
				role: "filmmaker",
				assignedMovieId: params.assignedMovieId,
			}),
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			console.error("Create filmmaker error response:", error);

			if (response.status === 401) {
				throw new Error("Authentication failed. Please login again.");
			}

			throw new Error(error.message || "Failed to create filmmaker");
		}

		return response.json();
	}

	private getHeaders(): HeadersInit {
		const token = authService.getToken();
		console.log(
			"API Client - Using token:",
			token ? token.substring(0, 20) + "..." : "No token"
		);
		return {
			"Content-Type": "application/json",
			...(token && { Authorization: `Bearer ${token}` }),
		};
	}

	async getTransactions(): Promise<Transaction[]> {
		const user = authService.getUser();
		const params = new URLSearchParams();
		if (user?.role === "filmmaker" && user.assignedMovieId) {
			params.set("movieId", user.assignedMovieId);
		}
		const url = `${this.baseUrl}/api/dashboard/sales${
			params.toString() ? `?${params.toString()}` : ""
		}`;
		console.log("Fetching transactions from:", url);
		const response = await fetch(url, { headers: this.getHeaders() });
		if (!response.ok) {
			throw new Error("Failed to fetch transactions");
		}
		const data = await response.json();
		return data.data.transactions || [];
	}

	async getMovies(): Promise<Movie[]> {
		const user = authService.getUser();
		const params = new URLSearchParams();
		if (user?.role === "filmmaker" && user.assignedMovieId) {
			params.set("movieId", user.assignedMovieId);
		}
		const url = `${this.baseUrl}/api/movies${
			params.toString() ? `?${params.toString()}` : ""
		}`;
		console.log("Fetching movies from:", url);
		const response = await fetch(url, { headers: this.getHeaders() });
		if (!response.ok) {
			throw new Error("Failed to fetch movies");
		}
		const data = await response.json();
		console.log("Movies response:", data);

		// Handle different response formats
		if (data.success && data.data) {
			// Format: { success: true, data: [...] }
			return data.data;
		} else if (Array.isArray(data)) {
			// Format: [...] (direct array)
			return data;
		} else if (data.movies) {
			// Format: { movies: [...] }
			return data.movies;
		}

		console.warn("Unexpected movies response format:", data);
		return [];
	}

	async getSalesStatistics(): Promise<SalesStatistics> {
		console.log("Fetching sales statistics using parallel API calls");

		// Make parallel API calls for better performance
		// Get last 7 days of data for charts instead of all data
		const last7Days = new Date();
		last7Days.setDate(last7Days.getDate() - 7);
		const startDate = last7Days.toISOString().split("T")[0];

		const user = authService.getUser();
		const query = new URLSearchParams({ startDate });
		const filter = new URLSearchParams();
		if (user?.role === "filmmaker" && user.assignedMovieId) {
			filter.set("movieId", user.assignedMovieId);
		}

		const overviewUrl = `${this.baseUrl}/api/dashboard/overview${
			filter.toString() ? `?${filter.toString()}` : ""
		}`;
		const chartDataUrl = `${
			this.baseUrl
		}/api/dashboard/chart-data?${query.toString()}${
			filter.toString() ? `&${filter.toString()}` : ""
		}`;
		const topMoviesUrl = `${this.baseUrl}/api/dashboard/top-movies${
			filter.toString() ? `?${filter.toString()}` : ""
		}`;

		const [overviewResponse, chartDataResponse, topMoviesResponse] =
			await Promise.all([
				fetch(overviewUrl, { headers: this.getHeaders() }),
				fetch(chartDataUrl, { headers: this.getHeaders() }),
				fetch(topMoviesUrl, { headers: this.getHeaders() }),
			]);

		if (
			!overviewResponse.ok ||
			!chartDataResponse.ok ||
			!topMoviesResponse.ok
		) {
			throw new Error("Failed to fetch dashboard data");
		}

		const [overviewData, chartData, topMoviesData] = await Promise.all([
			overviewResponse.json(),
			chartDataResponse.json(),
			topMoviesResponse.json(),
		]);

		console.log("Overview data:", overviewData);
		console.log(
			"Chart data transactions count:",
			chartData.data?.transactions?.length
		);
		console.log(
			"Top movies count:",
			topMoviesData.data?.topSellingMovies?.length
		);

		return {
			totalRevenue: overviewData.data.statistics.totalRevenue,
			totalTransactions: overviewData.data.statistics.totalTransactions,
			averageTransactionValue:
				overviewData.data.statistics.averageTransactionValue,
			topSellingMovies: topMoviesData.data.topSellingMovies,
			transactions: chartData.data.transactions,
		};
	}
}

export const apiClient = new ApiClient();
