import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import { useNavigate } from "react-router-dom";

const TABS = [
  { key: "gainers", label: "Top Gainers" },
  { key: "losers", label: "Top Losers" },
];

const GainersLosers = () => {
  const [activeTab, setActiveTab] = useState("gainers");
  const navigate = useNavigate();

  const { data, loading, error } = useFetchData("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 100,
    sparkline: false,
    price_change_percentage: "24h",
  });

  const sortedCoins = (data || [])
    .filter((coin) =>
      typeof coin.price_change_percentage_24h_in_currency === "number"
    )
    .sort((a, b) =>
      activeTab === "gainers"
        ? b.price_change_percentage_24h_in_currency -
          a.price_change_percentage_24h_in_currency
        : a.price_change_percentage_24h_in_currency -
          b.price_change_percentage_24h_in_currency
    )
    .slice(0, 30);

  return (
    <section className="px-4 py-10 w-full dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        {activeTab === "gainers" ? "Top Gainers" : "Top Losers"} (24h)
      </h2>

      <div className="flex gap-4 mb-4 border-b border-gray-200 dark:border-gray-700">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-4 font-semibold transition border-b-2 ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading coins...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load data.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow">
            <thead className="bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-right">24h %</th>
                <th className="p-4 text-right">Market Cap</th>
                <th className="p-4 text-right">Volume (24h)</th>
              </tr>
            </thead>
            <tbody>
              {sortedCoins.map((coin) => (
                <tr
                  key={coin.id}
                  onClick={() => navigate(`/coin/${coin.id}`)}
                  className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
                >
                  <td className="p-4 flex items-center gap-3">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {coin.name}
                      </div>
                      <div className="text-xs uppercase text-gray-500">
                        {coin.symbol}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right text-gray-800 dark:text-gray-200">
                    ${coin.current_price?.toLocaleString()}
                  </td>
                  <td
                    className={`p-4 text-right font-semibold ${
                      coin.price_change_percentage_24h_in_currency > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
                  </td>
                  <td className="p-4 text-right text-gray-600 dark:text-gray-300">
                    ${coin.market_cap?.toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-gray-600 dark:text-gray-300">
                    ${coin.total_volume?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default GainersLosers;
