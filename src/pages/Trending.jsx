import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

const Trending = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trendingRes = await fetch("https://api.coingecko.com/api/v3/search/trending");
        const trendingData = await trendingRes.json();
        const ids = trendingData.coins.map(c => c.item.id).join(",");
        const marketsRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&sparkline=true&price_change_percentage=1h,24h,7d`
        );
        const marketsData = await marketsRes.json();
        setCoins(marketsData);
        setLoading(false);
      } catch (err) {
        console.error("Trending fetch failed:", err);
        setError(true);
      }
    };

    fetchTrending();
  }, []);

  if (loading) return <p className="p-4">Loading trending coins...</p>;
  if (error) return <p className="p-4 text-red-500">Failed to load data.</p>;

  return (
    <section className="px-4 py-10 w-full dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Top Trending Cryptocurrencies Today
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 rounded-2xl shadow">
          <thead className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">#</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Coin</th>
              <th className="p-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
              <th className="p-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">1h %</th>
              <th className="p-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">24h %</th>
              <th className="p-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">7d %</th>
              <th className="p-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Market cap</th>
              <th className="p-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Volume (24h)</th>
              <th className="p-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Last 7 days</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => (
              <tr
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <td className="p-4">{index + 1}</td>
                <td className="p-4 flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-white">{coin.name}</div>
                    <div className="text-xs text-gray-500 uppercase">{coin.symbol}</div>
                  </div>
                </td>
                <td className="p-4 text-right text-gray-800 dark:text-gray-200">
                  ${coin.current_price?.toLocaleString()}
                </td>
                <td className={`p-4 text-right ${coin.price_change_percentage_1h_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                </td>
                <td className={`p-4 text-right ${coin.price_change_percentage_24h_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
                </td>
                <td className={`p-4 text-right ${coin.price_change_percentage_7d_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                </td>
                <td className="p-4 text-right text-gray-600 dark:text-gray-300">
                  ${coin.market_cap?.toLocaleString()}
                </td>
                <td className="p-4 text-right text-gray-600 dark:text-gray-300">
                  ${coin.total_volume?.toLocaleString()}
                </td>
                <td className="p-4 text-right w-[150px] h-[50px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={coin.sparkline_in_7d?.price?.map((p, idx) => ({
                        value: p,
                        time: idx,
                      })) || []}
                      margin={{ top: 5, bottom: 5, left: 0, right: 0 }}
                    >
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Trending;
