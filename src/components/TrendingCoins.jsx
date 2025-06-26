import useFetchData from "../hooks/useFetchData";
import { useNavigate } from "react-router-dom";

const TrendingCoins = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useFetchData("/search/trending");

  if (loading) return <div className="p-4">Loading trending coins...</div>;
  if (error) return <div className="p-4 text-red-500">Failed to load trending coins.</div>;

  const coins = data?.coins || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        🔥 Trending Searches
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {coins.map((item) => {
          const coin = item.item;
          return (
            <div
              key={coin.id}
              onClick={() => navigate(`/coin/${coin.id}`)}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center gap-4">
                <img
                  src={coin.large}
                  alt={coin.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {coin.name}{" "}
                    <span className="uppercase text-sm text-gray-500 dark:text-gray-300">
                      ({coin.symbol})
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    Rank #{coin.market_cap_rank ?? "N/A"}
                  </div>
                </div>
              </div>

              {coin.data?.price && (
                <div className="mt-3 flex justify-between items-center text-sm">
                  <span className="text-gray-700 dark:text-gray-200">
                    ${parseFloat(coin.data.price).toLocaleString()}
                  </span>
                  <span
                    className={`font-semibold ${
                      coin.data.price_change_percentage_24h?.usd > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {coin.data.price_change_percentage_24h?.usd?.toFixed(2) ?? "0"}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingCoins;
