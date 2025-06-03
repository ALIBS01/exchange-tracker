import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import useFetchData from "../hooks/useFetchData";

const SparklineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={50}>
    <LineChart data={data.map((val, i) => ({ value: val, time: i }))}>
      <YAxis domain={["dataMin", "dataMax"]} hide />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#ef4444"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  </ResponsiveContainer>
);

const AnalyticsDashboard = () => {
  const [marketStats, setMarketStats] = useState({});
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);

  const { data: globalData } = useFetchData("/global");
  const { data: coinMarket } = useFetchData("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 100,
    page: 1,
    sparkline: true,
    price_change_percentage: "24h",
  });

  useEffect(() => {
    if (globalData?.data) {
      setMarketStats({
        cap: globalData.data.total_market_cap.usd,
        volume: globalData.data.total_volume.usd,
        capChange: globalData.data.market_cap_change_percentage_24h_usd,
      });
    }

    if (coinMarket) {
      const sorted = [...coinMarket].sort(
        (a, b) =>
          b.price_change_percentage_24h_in_currency -
          a.price_change_percentage_24h_in_currency
      );
      setGainers(sorted.slice(0, 3));
      setLosers(sorted.reverse().slice(0, 3));
    }
  }, [globalData, coinMarket]);

  const statBox = (title, value, change, data) => (
    <div className="bg-white p-4 rounded-xl shadow w-full h-full flex flex-col justify-between min-h-[180px]">
      <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      <p className="text-lg font-bold text-gray-800">${value?.toLocaleString()}</p>
      <p className={`text-sm ${change < 0 ? "text-red-600" : "text-green-600"}`}>
        {change?.toFixed(2)}%
      </p>
      <SparklineChart data={data || []} />
    </div>
  );

  const coinListBox = (title, coins, isGain = true) => (
    <div className="bg-white p-4 rounded-xl shadow w-full h-full flex flex-col justify-between min-h-[180px]">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-sm">{title}</h4>
        <a href="#" className="text-xs text-blue-500">View more</a>
      </div>
      <ul className="space-y-2">
        {coins.map((coin) => (
          <li key={coin.id} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={coin.image} className="w-5 h-5" />
              <span className="text-sm">{coin.name}</span>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${isGain ? "text-green-600" : "text-red-600"}`}>
                {coin.price_change_percentage_24h_in_currency.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">
                ${coin.current_price.toFixed(4)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 w-full mx-auto">

      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
        {statBox(
          "Market Cap",
          marketStats.cap,
          marketStats.capChange,
          coinMarket?.[0]?.sparkline_in_7d?.price
        )}
      </div>


      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
        {statBox(
          "24h Trading Volume",
          marketStats.volume,
          0,
          coinMarket?.[1]?.sparkline_in_7d?.price
        )}
      </div>


      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
        {coinListBox("🚀 Top Gainers", gainers, true)}
      </div>


      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
        {coinListBox("📉 Top Losers", losers, false)}
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
