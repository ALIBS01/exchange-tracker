import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CoinChart = ({ coinId, currency = "usd" }) => {
  const [chartData, setChartData] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = "https://api.coingecko.com/api/v3";

  useEffect(() => {
    const fetchChart = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/coins/${coinId}/market_chart`,
          {
            params: {
              vs_currency: currency,
              days: days,
              x_cg_demo_api_key: API_KEY,
            },
          }
        );

        const formatted = res.data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: parseFloat(price.toFixed(2)),
        }));

        setChartData(formatted);
        setLoading(false);
      } catch (error) {
        console.error("Chart error", error);
        setLoading(false);
      }
    };

    if (coinId) fetchChart();
  }, [coinId, days, currency]);

  const timeRanges = [
    { label: "24H", value: 1 },
    { label: "7D", value: 7 },
    { label: "30D", value: 30 },
    { label: "1Y", value: 365 },
  ];

  const formatYAxisTick = (value) => {
    if (value >= 1000) return `${(value / 1000).toFixed(2)}k`;
    return value;
  };

  const formatTooltipValue = (value) => {
    const symbol = currency === "usd" ? "$" : currency.toUpperCase() + " ";
    return [`Price: ${symbol}${value.toLocaleString()}`];
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow mt-6 relative">

      <div className="absolute top-4 right-4 text-sm font-semibold text-gray-500 uppercase">
        {currency}
      </div>

      <div className="flex gap-4 mb-4">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            className={`px-3 py-1 rounded-md text-sm font-medium transition border cursor-pointer ${
              days === range.value
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setDays(range.value)}
          >
            {range.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" hide={chartData.length > 30} />
            <YAxis
              domain={["auto", "auto"]}
              orientation="right"
              tickFormatter={formatYAxisTick}
            />
            <Tooltip
              formatter={formatTooltipValue}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CoinChart;
