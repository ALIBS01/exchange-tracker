import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Link } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";

const SparklineChart = ({ data, isPositive }) => (
  <ResponsiveContainer width="100%" height={50}>
    <LineChart data={data.map((val, i) => ({ value: val, time: i }))}>
      <YAxis domain={["dataMin", "dataMax"]} hide />
      <Line
        type="monotone"
        dataKey="value"
        stroke={isPositive ? "#16a34a" : "#dc2626"}
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

  const StatBox = ({ title, value, change, data }) => (
    <div className="bg-white p-4 rounded-2xl shadow-md w-full h-full flex flex-col justify-between min-h-[180px]">
      <h4 className="text-xs font-semibold text-gray-500">{title}</h4>
      <p className="text-xl font-bold text-gray-800">${value?.toLocaleString()}</p>
      <p className={`text-sm font-medium ${change < 0 ? "text-red-600" : "text-green-600"}`}>
        {change?.toFixed(2)}%
      </p>
      {data && <SparklineChart data={data} isPositive={change >= 0} />}
    </div>
  );

  const CoinListBox = ({ title, coins, isGain }) => (
    <div className="bg-white p-4 rounded-2xl shadow-md w-full h-full flex flex-col justify-between min-h-[180px]">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-sm">{title}</h4>
        <Link to="/gainers-losers" className="text-xs text-blue-500 hover:underline">View more</Link>
      </div>
      <ul className="space-y-2">
        {coins.map((coin) => (
          <li key={coin.id}>
            <Link to={`/coin/${coin.id}`} className="flex justify-between items-center hover:text-blue-600 transition-colors">
              <div className="flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
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
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 w-full mx-auto">
      <div className="col-span-1">
        <StatBox
          title="Market Cap"
          value={marketStats.cap}
          change={marketStats.capChange}
          data={coinMarket?.[0]?.sparkline_in_7d?.price}
        />
      </div>

      <div className="col-span-1">
        <StatBox
          title="24h Trading Volume"
          value={marketStats.volume}
          change={0}
          data={coinMarket?.[1]?.sparkline_in_7d?.price}
        />
      </div>

      <div className="col-span-1">
        <CoinListBox title="🚀 Top Gainers" coins={gainers} isGain={true} />
      </div>

      <div className="col-span-1">
        <CoinListBox title="📉 Top Losers" coins={losers} isGain={false} />
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
