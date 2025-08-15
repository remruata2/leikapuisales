export type UserRole = "admin" | "filmmaker" | "customer";

export interface User {
	_id: string;
	email: string;
	name: string;
	role: UserRole;
	/**
	 * If role is filmmaker, backend should include the movie id this user is assigned to.
	 */
	assignedMovieId?: string | null;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

class AuthService {
	private tokenKey = "dashboard_token";
	private userKey = "dashboard_user";

	get apiBaseUrl(): string {
		const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
		console.log("Debug - Environment check:", {
			NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
			fallbackUrl: "http://localhost:4000",
			finalUrl: url,
		});
		return url;
	}

	async login(
		credentials: LoginCredentials
	): Promise<{ user: User; token: string }> {
		const response = await fetch(
			`${this.apiBaseUrl}/api/dashboard/auth/login`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(credentials),
			}
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Login failed");
		}

		const data = await response.json();

		// Store token and user data
		localStorage.setItem(this.tokenKey, data.token);
		localStorage.setItem(this.userKey, JSON.stringify(data.user));

		return data;
	}

	async logout(): Promise<void> {
		localStorage.removeItem(this.tokenKey);
		localStorage.removeItem(this.userKey);
	}

	getToken(): string | null {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(this.tokenKey);
	}

	getUser(): User | null {
		if (typeof window === "undefined") return null;
		const userStr = localStorage.getItem(this.userKey);
		return userStr ? JSON.parse(userStr) : null;
	}

	isAuthenticated(): boolean {
		return !!this.getToken() && !!this.getUser();
	}

	async verifyToken(): Promise<boolean> {
		const token = this.getToken();
		if (!token) {
			console.log("No token found for verification");
			return false;
		}

		// Check if fetch is available
		if (typeof fetch === "undefined") {
			console.error("Fetch API is not available");
			return false;
		}

		try {
			console.log("Debug - apiBaseUrl:", this.apiBaseUrl);
			console.log(
				"Debug - Full URL:",
				`${this.apiBaseUrl}/api/dashboard/auth/verify`
			);
			console.log("Debug - Token length:", token.length);
			console.log("Debug - Fetch available:", typeof fetch);

			const response = await fetch(
				`${this.apiBaseUrl}/api/dashboard/auth/verify`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!response.ok) {
				console.warn(
					"Token verification failed:",
					response.status,
					response.statusText
				);
				// Clear invalid token
				if (response.status === 401) {
					console.log("401 response, clearing token");
					await this.logout();
				}
				return false;
			}

			console.log("Token verification successful");
			return true;
		} catch (error) {
			console.error("Token verification error details:", {
				error: error,
				errorType: typeof error,
				errorMessage: error instanceof Error ? error.message : String(error),
				errorStack: error instanceof Error ? error.stack : undefined,
			});
			return false;
		}
	}

	// Check if token is about to expire (within 5 minutes)
	isTokenExpiringSoon(): boolean {
		const token = this.getToken();
		if (!token) return false;

		try {
			// Decode JWT payload (without verification)
			const payload = JSON.parse(atob(token.split(".")[1]));
			const expTime = payload.exp * 1000; // Convert to milliseconds
			const currentTime = Date.now();
			const fiveMinutes = 5 * 60 * 1000;

			return expTime - currentTime < fiveMinutes;
		} catch (error) {
			console.error("Error checking token expiration:", error);
			return true; // Assume expired if we can't decode
		}
	}
}

export const authService = new AuthService();
