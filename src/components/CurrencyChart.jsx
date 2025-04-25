import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CurrencyChart = ({ coinId = "bitcoin" }) => {
  const [chartData, setChartData] = useState([]);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = "https://api.coingecko.com/api/v3";

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/coins/${coinId}/market_chart`,
          {
            params: {
              vs_currency: "usd",
              days: 7,
              x_cg_demo_api_key: API_KEY,
            },
          }
        );

        const formattedData = res.data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price.toFixed(2),
        }));

        setChartData(formattedData);
      } catch (err) {
        console.error("Chart fetch error", err);
      }
    };

    fetchChartData();
  }, [coinId]);

  return (
    <div className="p-4 bg-white rounded-2xl shadow mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">7-Day Price Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CurrencyChart;
