export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
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

  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string }> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/auth/login`,
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
    if (!token) return false;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  }
}

export const authService = new AuthService();
