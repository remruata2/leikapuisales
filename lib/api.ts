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

  private getHeaders(): HeadersInit {
    const token = authService.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getTransactions(): Promise<Transaction[]> {
    console.log(
      "Fetching transactions from:",
      `${this.baseUrl}/api/dashboard/sales`
    );
    const response = await fetch(`${this.baseUrl}/api/dashboard/sales`);
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const data = await response.json();
    return data.data.transactions || [];
  }

  async getMovies(): Promise<Movie[]> {
    console.log("Fetching movies from:", `${this.baseUrl}/api/movies`);
    const response = await fetch(`${this.baseUrl}/api/movies`);
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    const data = await response.json();
    return data.movies || [];
  }

  async getSalesStatistics(): Promise<SalesStatistics> {
    console.log("Fetching sales statistics using parallel API calls");

    // Make parallel API calls for better performance
    // Get last 7 days of data for charts instead of all data
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const startDate = last7Days.toISOString().split("T")[0];

    const [overviewResponse, chartDataResponse, topMoviesResponse] =
      await Promise.all([
        fetch(`${this.baseUrl}/api/dashboard/overview`, {
          headers: this.getHeaders(),
        }),
        fetch(
          `${this.baseUrl}/api/dashboard/chart-data?startDate=${startDate}`,
          {
            headers: this.getHeaders(),
          }
        ),
        fetch(`${this.baseUrl}/api/dashboard/top-movies`, {
          headers: this.getHeaders(),
        }),
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
