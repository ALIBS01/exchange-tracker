import useFetchData from "../hooks/useFetchData";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const NewlyAddedCoins = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useFetchData("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_asc",
    per_page: 50,
    sparkline: true,
    price_change_percentage: "24h",
  });

  if (loading) return <div className="p-4">Loading newly added coins...</div>;
  if (error) return <div className="p-4 text-red-500">Failed to load data.</div>;

  const coins = (data || []).slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          🆕 Newly Added Coins
        </h3>
        <button
          onClick={() => navigate("/new-coins")}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          See All <FiArrowRight size={14} />
        </button>
      </div>

      <ul className="space-y-3">
        {coins.map((coin) => (
          <li
            key={coin.id}
            onClick={() => navigate(`/coin/${coin.id}`)}
            className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-2 rounded cursor-pointer transition"
          >
            <div className="flex items-center gap-2">
              <img src={coin.image} alt={coin.name} className="w-6 h-6" />
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {coin.name} ({coin.symbol.toUpperCase()})
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  ${coin.current_price?.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="text-gray-600 dark:text-gray-300">
                MC: ${coin.market_cap?.toLocaleString()}
              </div>
              <div
                className={`font-semibold ${
                  coin.price_change_percentage_24h_in_currency > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewlyAddedCoins;
