import { Transaction } from "@/lib/api";

interface MovieSalesChartProps {
  transactions: Transaction[];
  movieId: string;
  movieTitle: string;
}

export default function MovieSalesChart({
  transactions,
  movieId,
  movieTitle,
}: MovieSalesChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter transactions for this specific movie (completed only - matches business logic)
  const movieTransactions = transactions.filter(
    (t) => t.contentId?._id === movieId && t.status === "completed"
  );

  // Generate last 7 days (including today)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i)); // Start from 6 days ago, end today
    return date.toISOString().split("T")[0];
  });

  // Calculate daily sales for this movie
  const dailySales = last7Days.map((date) => {
    const dayTransactions = movieTransactions.filter((t) => {
      if (!t.created_at) return false;
      // Convert transaction date to local date string for comparison
      const transactionDate = new Date(t.created_at);
      const transactionDateStr = transactionDate.toISOString().split("T")[0];
      return transactionDateStr === date;
    });

    return {
      date: new Date(date).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
      sales: dayTransactions.reduce((sum, t) => sum + t.amount, 0),
      transactions: dayTransactions.length,
    };
  });

  const totalSales = movieTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = movieTransactions.length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">{movieTitle}</h3>
        <div className="mt-2 flex space-x-4 text-sm text-gray-600">
          <span>Total Sales: {formatCurrency(totalSales)}</span>
          <span>Transactions: {totalTransactions}</span>
        </div>
      </div>

      <div className="space-y-2">
        {dailySales.map((day) => (
          <div key={day.date} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{day.date}</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.max(
                      (day.sales /
                        Math.max(...dailySales.map((d) => d.sales), 1)) *
                        100,
                      2
                    )}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 min-w-[60px] text-right">
                {formatCurrency(day.sales)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
