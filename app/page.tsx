"use client";

import { useState, useEffect } from "react";
import { apiClient, SalesStatistics } from "@/lib/api";
import SalesOverview from "@/components/SalesOverview";
import TopSellingMovies from "@/components/TopSellingMovies";
import RecentTransactions from "@/components/RecentTransactions";
import SalesChart from "@/components/SalesChart";
import MovieSalesCharts from "@/components/MovieSalesCharts";

export default function Dashboard() {
	const [data, setData] = useState<SalesStatistics | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const salesData = await apiClient.getSalesStatistics();
			setData(salesData);
		} catch (err) {
			console.error("Dashboard error:", err);
			setError("Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	// Fetch data when component mounts (authentication is already verified by ProtectedRoute)
	useEffect(() => {
		fetchData();
	}, []);

	// Show loading while fetching data
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading dashboard data...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-600 text-lg font-medium">{error}</div>
					<p className="mt-2 text-gray-600">
						Please check your connection and try again.
					</p>
					<div className="space-x-2">
						<button
							onClick={() => window.location.reload()}
							className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							Retry
						</button>
						<button
							onClick={() => {
								localStorage.clear();
								window.location.reload();
							}}
							className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
						>
							Clear Storage & Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600">No data available</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-full px-0 sm:px-2 lg:px-4 py-4 sm:py-6 lg:py-8 overflow-x-hidden box-border">
			<div className="mb-6 sm:mb-8">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
					Movie Sales Dashboard
				</h1>
				<p className="mt-2 text-sm sm:text-base text-gray-600 break-words">
					Real-time insights into your movie sales performance
				</p>
			</div>

			<SalesOverview
				totalRevenue={data.totalRevenue}
				totalTransactions={data.totalTransactions}
				averageTransactionValue={data.averageTransactionValue}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 w-full overflow-hidden auto-cols-fr">
				<div className="w-full min-w-0 overflow-hidden">
					<SalesChart transactions={data.transactions} />
				</div>
				<div className="w-full min-w-0 overflow-hidden">
					<TopSellingMovies movies={data.topSellingMovies} />
				</div>
			</div>

			<div className="mt-6 sm:mt-8 w-full">
				<MovieSalesCharts transactions={data.transactions} />
			</div>

			<div className="mt-6 sm:mt-8 w-full">
				<RecentTransactions transactions={data.transactions} />
			</div>
		</div>
	);
}
