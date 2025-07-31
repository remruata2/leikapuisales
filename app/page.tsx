"use client";

import { useState, useEffect } from "react";
import { apiClient, SalesStatistics } from "@/lib/api";
import { authService } from "@/lib/auth";
import SalesOverview from "@/components/SalesOverview";
import TopSellingMovies from "@/components/TopSellingMovies";
import RecentTransactions from "@/components/RecentTransactions";
import SalesChart from "@/components/SalesChart";
import MovieSalesCharts from "@/components/MovieSalesCharts";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  const [data, setData] = useState<SalesStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // First check if user is authenticated
        const isValid = await authService.verifyToken();
        setIsAuthenticated(isValid);
        
        if (!isValid) {
          return; // Don't fetch data if not authenticated
        }

        // Only fetch data if authenticated
        setLoading(true);
        const salesData = await apiClient.getSalesStatistics();
        setData(salesData);
        setError(null);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // If not authenticated, let ProtectedRoute handle the login form
  if (isAuthenticated === false) {
    return <ProtectedRoute><div></div></ProtectedRoute>;
  }

  // Show loading while fetching data
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium">{error}</div>
            <p className="mt-2 text-gray-600">
              Please check your connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!data) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No data available</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Movie Sales Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Real-time insights into your movie sales performance
          </p>
        </div>

        <SalesOverview
          totalRevenue={data.totalRevenue}
          totalTransactions={data.totalTransactions}
          averageTransactionValue={data.averageTransactionValue}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesChart transactions={data.transactions} />
          <TopSellingMovies movies={data.topSellingMovies} />
        </div>

        <div className="mt-8">
          <MovieSalesCharts transactions={data.transactions} />
        </div>

        <div className="mt-8">
          <RecentTransactions transactions={data.transactions} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
