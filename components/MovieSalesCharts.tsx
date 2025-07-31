import { Transaction } from "@/lib/api";
import MovieSalesChart from "./MovieSalesChart";

interface MovieSalesChartsProps {
  transactions: Transaction[];
}

export default function MovieSalesCharts({
  transactions,
}: MovieSalesChartsProps) {
  // Get unique movies from transactions
  const movies = transactions.reduce((acc, transaction) => {
    if (transaction.contentId?._id && transaction.contentId?.title) {
      const movieId = transaction.contentId._id;
      if (!acc.find((m) => m.id === movieId)) {
        acc.push({
          id: movieId,
          title: transaction.contentId.title,
        });
      }
    }
    return acc;
  }, [] as Array<{ id: string; title: string }>);

  if (movies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Movie Sales Trends
        </h3>
        <p className="text-gray-500">No movie data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Movie Sales Trends</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {movies.map((movie) => (
          <MovieSalesChart
            key={movie.id}
            transactions={transactions}
            movieId={movie.id}
            movieTitle={movie.title}
          />
        ))}
      </div>
    </div>
  );
}
