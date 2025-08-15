import { Transaction } from "@/lib/api";

interface SalesChartProps {
	transactions: Transaction[];
}

export default function SalesChart({ transactions }: SalesChartProps) {
	// Safety check for undefined transactions
	if (!transactions || !Array.isArray(transactions)) {
		return (
			<div className="bg-white rounded-lg shadow p-6">
				<div className="mb-4">
					<h3 className="text-lg font-medium text-gray-900">
						Sales Trend (Last 7 Days)
					</h3>
				</div>
				<div className="flex items-center justify-center h-48">
					<p className="text-gray-500">No transaction data available</p>
				</div>
			</div>
		);
	}

	// Generate last 7 days data (including today)
	const last7Days = Array.from({ length: 7 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (6 - i)); // Start from 6 days ago, end today
		return date.toISOString().split("T")[0];
	});

	// Calculate daily sales (only completed transactions - matches business logic)
	const dailySales = last7Days.map((date) => {
		const dayTransactions = transactions.filter((t) => {
			if (!t.created_at || t.status !== "completed") return false;
			// Convert transaction date to local date string for comparison
			const transactionDate = new Date(t.created_at);
			const transactionDateStr = transactionDate.toISOString().split("T")[0];
			return transactionDateStr === date;
		});

		return {
			date,
			sales: dayTransactions.reduce((sum, t) => sum + t.amount, 0),
		};
	});

	const maxSales = Math.max(...dailySales.map((d) => d.sales));

	return (
		<div className="bg-white rounded-lg shadow p-4 sm:p-6 w-full overflow-hidden">
			<div className="mb-4">
				<h3 className="text-lg font-medium text-gray-900 break-words">
					Sales Trend (Last 7 Days)
				</h3>
			</div>
			<div className="flex items-end justify-between h-48 w-full overflow-x-auto">
				{dailySales.map((day) => (
					<div
						key={day.date}
						className="flex flex-col items-center flex-shrink-0 min-w-[40px] mx-1"
					>
						<div
							className="w-4 sm:w-6 lg:w-8 bg-blue-500 rounded-t mx-auto"
							style={{
								height: `${maxSales > 0 ? (day.sales / maxSales) * 120 : 0}px`,
							}}
						></div>
						<div className="mt-2 text-xs text-gray-500 text-center whitespace-nowrap">
							{new Date(day.date).toLocaleDateString("en-IN", {
								month: "short",
								day: "numeric",
							})}
						</div>
						<div className="text-xs font-medium text-gray-900 text-center break-all">
							₹{day.sales.toLocaleString()}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
