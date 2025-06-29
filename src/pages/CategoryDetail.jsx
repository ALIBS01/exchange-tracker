import { useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import { useState } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

const CategoryDetail = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const perPage = 50;

  const params = {
    vs_currency: "usd",
    category: id,
    order: "market_cap_desc",
    per_page: perPage,
    page,
    sparkline: true,
    price_change_percentage: "1h,24h,7d",
  };

  const { data, loading, error } = useFetchData("/coins/markets", params);

  if (loading) return <p className="p-4">Loading coins for {id}...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading data.</p>;

  return (
    <section className="p-4 w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 capitalize">{id} Coins</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">#</th>
              <th className="p-4 text-left text-sm font-semibold">Name</th>
              <th className="p-4 text-right text-sm font-semibold">Price</th>
              <th className="p-4 text-right text-sm font-semibold">1h %</th>
              <th className="p-4 text-right text-sm font-semibold">24h %</th>
              <th className="p-4 text-right text-sm font-semibold">7d %</th>
              <th className="p-4 text-right text-sm font-semibold">Market Cap</th>
              <th className="p-4 text-right text-sm font-semibold">24h Volume</th>
              <th className="p-4 text-right text-sm font-semibold">Supply</th>
              <th className="p-4 text-right text-sm font-semibold">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((coin, index) => (
              <tr key={coin.id} className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="p-4">{(page - 1) * perPage + index + 1}</td>
                <td className="p-4 flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">{coin.name}</div>
                    <div className="text-xs text-gray-500 uppercase">{coin.symbol}</div>
                  </div>
                </td>
                <td className="p-4 text-right">${coin.current_price?.toLocaleString()}</td>
                <td className={`p-4 text-right ${coin.price_change_percentage_1h_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                </td>
                <td className={`p-4 text-right ${coin.price_change_percentage_24h_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
                </td>
                <td className={`p-4 text-right ${coin.price_change_percentage_7d_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                </td>
                <td className="p-4 text-right">${coin.market_cap?.toLocaleString()}</td>
                <td className="p-4 text-right">${coin.total_volume?.toLocaleString()}</td>
                <td className="p-4 text-right">
                  {coin.circulating_supply?.toLocaleString()} {coin.symbol.toUpperCase()}
                </td>
                <td className="p-4 text-right w-[150px] h-[50px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={coin.sparkline_in_7d?.price?.map((p, idx) => ({ value: p, time: idx })) || []}
                      margin={{ top: 5, bottom: 5, left: 0, right: 0 }}
                    >
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-8">
        <ul className="flex gap-2 text-black font-semibold items-center">
          <li>
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${page === 1 ? "text-gray-400 cursor-not-allowed" : ""}`}
            >
              &lt;
            </button>
          </li>

          {[...Array(5)].map((_, i) => (
            <li key={i}>
              <button
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded cursor-pointer hover:bg-gray-200 ${page === i + 1 ? "bg-gray-300" : ""}`}
              >
                {i + 1}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 rounded hover:bg-gray-200"
            >
              &gt;
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default CategoryDetail;
