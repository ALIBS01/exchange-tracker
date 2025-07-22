import { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CoinChart = ({ coinId, currency = "usd" }) => {
  const [chartData, setChartData] = useState([]);
  const [days, setDays] = useState(1);
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
          price: price,
          timestamp: timestamp,
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
    if (value >= 1e9) return (value / 1e9).toFixed(1) + "B";
    if (value >= 1e6) return (value / 1e6).toFixed(1) + "M";
    if (value >= 1e3) return (value / 1e3).toFixed(1) + "K";
    if (value >= 1) return value.toFixed(2);
    if (value >= 0.0001) return value.toFixed(6);
    return value.toFixed(8);
  };

  const TooltipContent = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const timestamp = new Date(data.timestamp);
    const dateStr = timestamp.toLocaleDateString("en-US");
    const timeStr = timestamp.toUTCString().split(" ")[4];

    const symbol = currency === "usd" ? "$" : currency.toUpperCase() + " ";
    const price = data.price;

    const formattedPrice =
      symbol +
      price.toLocaleString(undefined, {
        minimumFractionDigits: price >= 1 ? 2 : price >= 0.0001 ? 6 : 8,
        maximumFractionDigits: price >= 1 ? 2 : price >= 0.0001 ? 6 : 8,
      });

    return (
      <div className="bg-white shadow p-2 rounded-md text-xs text-gray-800">
        <div className="font-semibold">{dateStr}</div>
        <div className="text-gray-500">{timeStr} UTC</div>
        <div className="mt-1">Price: {formattedPrice}</div>
      </div>
    );
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
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide={chartData.length > 30} />
            <YAxis
              domain={["auto", "auto"]}
              orientation="right"
              tickFormatter={formatYAxisTick}
            />
            <Tooltip content={<TooltipContent />} />
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CoinChart;
