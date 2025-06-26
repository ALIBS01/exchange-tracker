import { useNavigate } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import { LineChart, Line, YAxis, ResponsiveContainer } from "recharts";
import { FiArrowRight } from "react-icons/fi";

const TopLosers = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useFetchData("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 50,
    price_change_percentage: "24h",
    sparkline: true,
  });

  if (loading) return <div className="p-4">Loading top losers...</div>;
  if (error) return <div className="p-4 text-red-500">Failed to load losers.</div>;

  const topLosers = (data || [])
    .filter((coin) => coin.price_change_percentage_24h_in_currency < 0)
    .sort(
      (a, b) =>
        a.price_change_percentage_24h_in_currency -
        b.price_change_percentage_24h_in_currency
    )
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Top Losers (24h)
        </h3>
        <button
          onClick={() => navigate("/gainers-losers")}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          See All <FiArrowRight size={14} />
        </button>
      </div>

      <ul className="space-y-3">
        {topLosers.map((coin) => (
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
                <div className="text-sm text-red-600 dark:text-red-400 font-semibold">
                  {coin.price_change_percentage_24h_in_currency.toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="w-[80px] h-[30px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    coin.sparkline_in_7d?.price?.map((p, idx) => ({
                      value: p,
                      time: idx,
                    })) || []
                  }
                >
                  <YAxis domain={["dataMin", "dataMax"]} hide />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ef4444"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopLosers;
