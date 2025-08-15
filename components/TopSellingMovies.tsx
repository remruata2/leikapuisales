import Image from "next/image";

interface Movie {
  _id: {
    _id: string;
    title: string;
    horizontal_poster?: string;
    ppv_cost?: number;
  };
  totalSales: number;
  totalTransactions: number;
}

interface TopSellingMoviesProps {
  movies: Movie[];
}

export default function TopSellingMovies({ movies }: TopSellingMoviesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow w-full overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 break-words">
          Top Selling Movies
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {movies.map((movie) => (
          <div key={movie._id._id} className="px-4 sm:px-6 py-4">
            <div className="flex items-center min-w-0">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  {movie._id.horizontal_poster ? (
                    <Image
                      src={movie._id.horizontal_poster}
                      alt={movie._id.title}
                      width={48}
                      height={48}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between min-w-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 break-words">
                      {movie._id.title}
                    </p>
                    <p className="text-sm text-gray-500 break-words">
                      {movie.totalTransactions} transactions
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-medium text-gray-900 break-words">
                      {formatCurrency(movie.totalSales)}
                    </p>
                    <p className="text-sm text-gray-500 break-words">
                      {movie._id.ppv_cost && formatCurrency(movie._id.ppv_cost)}{" "}
                      per view
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
